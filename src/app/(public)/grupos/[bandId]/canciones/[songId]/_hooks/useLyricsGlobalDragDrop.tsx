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

    // Si la posición no cambió, no hacemos nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStructureId = Number(source.droppableId.replace('lyrics-', ''));
    const destinationStructureId = Number(
      destination.droppableId.replace('lyrics-', ''),
    );

    // 1. Encontrar el item movido
    // Filtramos las lyrics del grupo origen para encontrar cuál es el item en source.index
    const sourceGroupLyrics = lyricsOrder.filter(
      (l) => l.structure.id === sourceStructureId,
    );
    const movedLyric = sourceGroupLyrics[source.index];

    if (!movedLyric) {
      console.error('Moved lyric not found', {
        sourceStructureId,
        sourceIndex: source.index,
        droppableId: source.droppableId,
        lyricsCountStr: sourceGroupLyrics.length,
        allLyricsCount: lyricsOrder.length,
      });
      return;
    }

    // 2. Crear nueva lista sin el item movido
    const newLyricsOrder = lyricsOrder.filter((l) => l.id !== movedLyric.id);

    // 3. Modificar estructura del item si cambió de grupo
    let updatedMovedLyric = { ...movedLyric };
    if (sourceStructureId !== destinationStructureId) {
      const newStructure = songStructure.find(
        (s) => s.id === destinationStructureId,
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

    // 4. Determinar dónde insertar
    // Necesitamos ver las lyrics del grupo destino (¡del orden original!)
    // para saber "entre quién y quién" insertar.
    const destGroupLyricsExpected = lyricsOrder.filter(
      (l) => l.structure.id === destinationStructureId,
    );
    // Nota: Si movemos dentro del mismo grupo, destGroupLyricsExpected incluye el item movido,
    // pero newLyricsOrder ya NO lo incluye.

    let insertionIndex = -1;

    if (destGroupLyricsExpected.length === 0) {
      // Caso: Grupo destino vacío.
      // Estrategia: Insertar al final de la canción (o podríamos intentar ser más listos, pero esto funciona)
      insertionIndex = newLyricsOrder.length;
    } else {
      // Caso normal
      if (destination.index < destGroupLyricsExpected.length) {
        // Insertar ANTES del item que está en destination.index en el grupo destino
        const targetLyric = destGroupLyricsExpected[destination.index];

        // Si estamos moviendo en el mismo grupo y desplazamos hacia abajo (source < dest),
        // el targetLyric es correcto porque usamos la lista original.
        // Pero necesitamos el índice de targetLyric en newLyricsOrder (la lista recortada).

        // Ajuste especial para mismo grupo:
        // Si source.droppableId === destination.droppableId
        // Si moví del 0 al 2. Items: [A, B, C]. Muevo A a pos 2 (después de B, antes de nada?).
        // destGroupLyrics[2] es undefined.
        // destGroupLyrics[1] es B.

        // Mejor simplificación: Usar referencia de ID.

        // El item que ocupa la posición visual 'destination.index' actualmente.
        // Ojo: Si movimos el item PROPIO, los índices se desplazan.
        // DND libraries calculan destination.index asumiendo que el item ya no está donde estaba.

        // Si movemos entre grupos distintos, destination.index referencia los items existentes en destino.
        if (sourceStructureId !== destinationStructureId) {
          const targetLyricId = targetLyric.id;
          insertionIndex = newLyricsOrder.findIndex(
            (l) => l.id === targetLyricId,
          );
        } else {
          // Mismo grupo.
          // Si targetLyric es el mismo que movedLyric (no debería pasar por el check inicial), return.
          // Si insertamos antes de targetLyric.
          // Pero targetLyric lo sacamos de lyricsOrder (que tiene el item).
          // Si el item estaba ANTES que el target, target index en newLyrics se redujo en 1.
          // Si el item estaba DESPUES, target index es igual.

          // Vamos a usar una logica mas robusta:
          // Get lyrics del grupo destino EXCLUYENDO el movedItem (si es mismo grupo).
          const destGroupLyricsFiltered = destGroupLyricsExpected.filter(
            (l) => l.id !== movedLyric.id,
          );

          if (destination.index < destGroupLyricsFiltered.length) {
            const targetLyricId = destGroupLyricsFiltered[destination.index].id;
            insertionIndex = newLyricsOrder.findIndex(
              (l) => l.id === targetLyricId,
            );
          } else {
            // Final del grupo
            const lastLyricId =
              destGroupLyricsFiltered[destGroupLyricsFiltered.length - 1].id;
            insertionIndex =
              newLyricsOrder.findIndex((l) => l.id === lastLyricId) + 1;
          }
        }
      } else {
        // Insertar AL FINAL del grupo destino
        // Buscamos el último item del grupo en la lista recortada y ponemos después
        // Si es cross-group, destGroupLyricsExpected son los que hay.
        // Si es same-group, debemos excluir el item movido.
        const destGroupLyricsFiltered = destGroupLyricsExpected.filter(
          (l) => l.id !== movedLyric.id,
        );

        if (destGroupLyricsFiltered.length > 0) {
          const lastLyricId =
            destGroupLyricsFiltered[destGroupLyricsFiltered.length - 1].id;
          insertionIndex =
            newLyricsOrder.findIndex((l) => l.id === lastLyricId) + 1;
        } else {
          // El grupo se quedó vacío (imposible si estamos en same-group porque acabamos de quitar uno,
          // pero si es cross-group y estaba vacío, caemos en el if inicial).
          // Fallback
          insertionIndex = newLyricsOrder.length;
        }
      }
    }

    // Safety check
    if (insertionIndex === -1) insertionIndex = newLyricsOrder.length;

    // 5. Insertar
    newLyricsOrder.splice(insertionIndex, 0, updatedMovedLyric);

    // 6. Recalcular posiciones
    const reorderedLyrics = newLyricsOrder.map((lyric, index) => ({
      ...lyric,
      position: index + 1,
    }));

    setLyricsOrder(reorderedLyrics);

    // 7. Preparar Payload
    const changes: LyricsPositionUpdate[] = [];

    reorderedLyrics.forEach((lyric) => {
      const original = lyricsOrder.find((l) => l.id === lyric.id);

      let hasChanged = false;
      const update: LyricsPositionUpdate = {
        id: lyric.id,
        position: lyric.position,
      };

      // Si cambió posición
      if (!original || original.position !== lyric.position) {
        hasChanged = true;
      }

      // Si es el item movido y cambió estructura
      if (
        lyric.id === movedLyric.id &&
        sourceStructureId !== destinationStructureId
      ) {
        update.structureId = destinationStructureId;
        hasChanged = true;
      }

      if (hasChanged) {
        changes.push(update);
      }
    });

    if (changes.length > 0) {
      mutateUpdateLyricsPositions(changes);
    }
  };

  return {
    handleDragEnd,
    handleDragStart,
    isDragging,
    lyricsOrder,
  };
};
