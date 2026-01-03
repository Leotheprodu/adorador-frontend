import { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { updateLyricsPositionsService } from '../_services/songIdServices';
import toast from 'react-hot-toast';
import { LyricsPositionUpdate } from '../_interfaces/lyricsInterfaces';
import { songStructure } from '@global/config/constants';

interface UseLyricsGlobalDragDropProps {
  lyrics: LyricsProps[];
  params: { bandId: string; songId: string };
  refetchLyricsOfCurrentSong: () => void;
}

export const useLyricsGlobalDragDrop = ({
  lyrics,
  params,
  refetchLyricsOfCurrentSong,
}: UseLyricsGlobalDragDropProps) => {
  const [lyricsOrder, setLyricsOrder] = useState<LyricsProps[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const {
    mutate: mutateUpdateLyricsPositions,
    status: statusUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });

  useEffect(() => {
    setLyricsOrder([...(lyrics || [])].sort((a, b) => a.position - b.position));
  }, [lyrics]);

  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success') {
      toast.success('Orden actualizado');
      refetchLyricsOfCurrentSong();
    }
  }, [statusUpdateLyricsPositions, refetchLyricsOfCurrentSong]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination } = result;

    if (!destination) return;

    // Parse IDs: "lyrics-{structureId}-{groupIndex}"
    const parseId = (droppableId: string) => {
      const parts = droppableId.replace('lyrics-', '').split('-');
      return {
        structureId: Number(parts[0]),
        groupIndex: Number(parts[1]),
      };
    };

    const sourceInfo = parseId(source.droppableId);
    const destInfo = parseId(destination.droppableId);

    // Si la posición no cambió, no hacemos nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Helper to Group Lyrics (Must match LyricsSection logic)
    const getGroups = (lyrics: LyricsProps[]) => {
      const sorted = [...lyrics].sort((a, b) => a.position - b.position);
      const groups: LyricsProps[][] = [];
      if (sorted.length === 0) return groups;

      let currentGroup: LyricsProps[] = [];
      let currentStructId = sorted[0].structure.id;

      sorted.forEach((lyric) => {
        if (lyric.structure.id === currentStructId) {
          currentGroup.push(lyric);
        } else {
          if (currentGroup.length > 0) groups.push(currentGroup);
          currentStructId = lyric.structure.id;
          currentGroup = [lyric];
        }
      });
      if (currentGroup.length > 0) groups.push(currentGroup);
      return groups;
    };

    const currentGroups = getGroups(lyricsOrder);

    // 1. Identify Source Group and Moved Lyric
    const sourceGroupLyrics = currentGroups[sourceInfo.groupIndex];
    if (!sourceGroupLyrics) {
      console.error('Source group not found');
      return;
    }
    const movedLyric = sourceGroupLyrics[source.index];

    if (!movedLyric) {
      return;
    }

    // 2. Create new flat list without moved item
    const newLyricsOrder = lyricsOrder.filter((l) => l.id !== movedLyric.id);

    // 3. Update Structure if changed Group
    // When moving to a different structure type (e.g. Intro -> Verse), update the internal structure.
    let updatedMovedLyric = { ...movedLyric };
    if (sourceInfo.structureId !== destInfo.structureId) {
      const newStructure = songStructure.find(
        (s) => s.id === destInfo.structureId,
      );
      if (newStructure) {
        updatedMovedLyric = {
          ...updatedMovedLyric,
          structure: {
            id: newStructure.id,
            title: newStructure.title,
          },
        };
      }
    }

    // 4. Determine Insertion Index
    // Find where to insert in the new flat list
    const destGroupLyricsOriginal = currentGroups[destInfo.groupIndex];
    let insertionIndex = -1;

    if (!destGroupLyricsOriginal) {
      // Should not happen for existing groups
      insertionIndex = newLyricsOrder.length;
    } else {
      let targetAnchor: LyricsProps | undefined;
      let insertAfter = false;

      if (source.droppableId === destination.droppableId) {
        // Same Group Move
        // We look at the list relative to the *remaining* items in that group.
        const lyricsInGroup = destGroupLyricsOriginal.filter(
          (l) => l.id !== movedLyric.id,
        );

        if (destination.index < lyricsInGroup.length) {
          targetAnchor = lyricsInGroup[destination.index];
        } else {
          targetAnchor = lyricsInGroup[lyricsInGroup.length - 1];
          insertAfter = true;
        }
      } else {
        // Cross Group Move
        // Destination index is relative to the items currently in the target group.
        const lyricsInDest = destGroupLyricsOriginal;

        if (destination.index < lyricsInDest.length) {
          targetAnchor = lyricsInDest[destination.index];
        } else {
          targetAnchor = lyricsInDest[lyricsInDest.length - 1];
          insertAfter = true;
        }
      }

      if (targetAnchor) {
        const anchorIndex = newLyricsOrder.findIndex(
          (l) => l.id === targetAnchor!.id,
        );
        if (anchorIndex !== -1) {
          insertionIndex = insertAfter ? anchorIndex + 1 : anchorIndex;
        }
      }
    }

    if (insertionIndex === -1) insertionIndex = newLyricsOrder.length;

    // 5. Insert
    newLyricsOrder.splice(insertionIndex, 0, updatedMovedLyric);

    // 6. Recalculate
    const reorderedLyrics = newLyricsOrder.map((lyric, index) => ({
      ...lyric,
      position: index + 1,
    }));

    setLyricsOrder(reorderedLyrics);

    // 7. Payload
    const changes: LyricsPositionUpdate[] = [];
    reorderedLyrics.forEach((lyric) => {
      const original = lyricsOrder.find((l) => l.id === lyric.id);
      let hasChanged = false;
      const update: LyricsPositionUpdate = {
        id: lyric.id,
        position: lyric.position,
      };

      if (!original || original.position !== lyric.position) hasChanged = true;
      if (
        lyric.id === movedLyric.id &&
        sourceInfo.structureId !== destInfo.structureId
      ) {
        update.structureId = destInfo.structureId;
        hasChanged = true;
      }
      if (hasChanged) changes.push(update);
    });

    if (changes.length > 0) mutateUpdateLyricsPositions(changes);
  };

  return {
    handleDragEnd,
    handleDragStart,
    isDragging,
    lyricsOrder,
  };
};
