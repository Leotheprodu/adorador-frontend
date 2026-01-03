'use client';
import { useState, useEffect, useRef } from 'react';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import {
  parseAndUpdateSingleLyricService,
  deleteLyricService,
  updateLyricsPositionsService,
  updateLyricService,
} from '../_services/songIdServices';
import toast from 'react-hot-toast';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
import { songStructure, structureLib } from '@global/config/constants';

interface MiniLyricsEditorProps {
  lyric: LyricsProps;
  params: { bandId: string; songId: string };
  refetchLyricsOfCurrentSong: () => void;
  onClose: () => void;
  lyricsScale?: number;
  lyricsOfCurrentSong: LyricsProps[];
}

export const MiniLyricsEditor = ({
  lyric,
  params,
  refetchLyricsOfCurrentSong,
  onClose,
  lyricsScale = 1,
  lyricsOfCurrentSong,
}: MiniLyricsEditorProps) => {
  const [text, setText] = useState('');
  const [initialText, setInitialText] = useState('');
  const [selectedStructureId, setSelectedStructureId] = useState(
    lyric.structure.id,
  );
  const [initialStructureId, setInitialStructureId] = useState(
    lyric.structure.id,
  );
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { mutate: mutateParseAndUpdate, status: statusParseAndUpdate } =
    parseAndUpdateSingleLyricService({
      params,
      lyricId: lyric.id,
    });

  const {
    mutate: mutateDeleteLyric,
    isPending: isPendingDeleteLyric,
    status: statusDeleteLyric,
  } = deleteLyricService({
    params,
    lyricId: lyric.id,
  });

  const {
    mutate: mutateUpdateLyricsPositions,
    status: statusUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });

  const {
    mutate: mutateUpdateLyric,
    status: statusUpdateLyric,
    isPending: isPendingUpdateLyric,
  } = updateLyricService({
    params,
    lyricId: lyric.id,
  });

  // Inicializar con el texto actual (acordes arriba, letra abajo)
  useEffect(() => {
    // Construir el texto inicial con acordes y letra
    let initialText = '';

    // Si hay acordes, crear la línea de acordes
    if (lyric.chords && lyric.chords.length > 0) {
      // Ordenar acordes por posición
      const sortedChords = [...lyric.chords].sort(
        (a, b) => a.position - b.position,
      );

      // Calcular el espaciado basado en el largo de la letra
      const lyricLength = lyric.lyrics.length;

      // Dividir la letra en 5 segmentos (posiciones 1-5)
      // Cada segmento representa 1/5 del ancho total de la letra
      const segmentSize = lyricLength / 5;

      const chordLine: string[] = [];

      sortedChords.forEach((chord, index) => {
        const chordText = `${chord.rootNote}${chord.chordQuality || ''}${chord.slashChord ? '/' + chord.slashChord : ''}`;

        // Calcular posición objetivo basada en el segmento (proporcional)
        // Posición 1 = 0, Posición 2 = 1/5, Posición 3 = 2/5, etc.
        const targetPos = Math.floor((chord.position - 1) * segmentSize);

        // Rellenar con espacios hasta la posición del acorde
        const currentLength = chordLine.join('').length;
        if (currentLength < targetPos) {
          chordLine.push(' '.repeat(targetPos - currentLength));
        } else if (index > 0) {
          // Si ya pasamos la posición, agregar al menos 2 espacios de separación
          chordLine.push('  ');
        }

        chordLine.push(chordText);
      });

      initialText = chordLine.join('').trimEnd() + '\n';
    }

    // Agregar la letra
    initialText += lyric.lyrics;

    setText(initialText);
    setInitialText(initialText); // Guardar el texto inicial para comparar

    // Auto-focus en el textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      // Mover cursor al final
      const length = textareaRef.current?.value.length || 0;
      textareaRef.current?.setSelectionRange(length, length);
    }, 0);
  }, [lyric]);

  // Verificar si hubo cambios
  const hasChanges =
    text.trim() !== initialText.trim() ||
    selectedStructureId !== initialStructureId;

  // Manejar click afuera del editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Si no hay cambios, cerrar inmediatamente (igual que ESC)
        if (!hasChanges) {
          onClose();
        } else {
          // Si hay cambios, mostrar advertencia en rojo
          setShowUnsavedWarning(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasChanges, onClose]);

  // Manejar submit
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Si no hubo cambios, solo cerrar
    if (!hasChanges) {
      onClose();
      return;
    }

    if (!text.trim()) {
      toast.error('El texto no puede estar vacío');
      return;
    }

    const structureChanged = selectedStructureId !== initialStructureId;
    const textChanged = text.trim() !== initialText.trim();

    if (structureChanged) {
      mutateUpdateLyric({
        structureId: selectedStructureId,
      });
    }

    if (textChanged) {
      mutateParseAndUpdate({
        textContent: text,
      });
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    setShowUnsavedWarning(false);
    onClose();
  };

  // Manejar eliminación
  const handleDeleteLyric = () => {
    mutateDeleteLyric(null);
  };

  // Efecto para manejar eliminación exitosa
  useEffect(() => {
    if (statusDeleteLyric === 'success') {
      const newLyrics = [...lyricsOfCurrentSong].sort(
        (a, b) => a.position - b.position,
      );
      const newPositionOfLyrics = newLyrics.map((lyrics) => {
        if (lyrics.position > lyric.position) {
          return { id: lyrics.id, position: lyrics.position - 1 };
        }
      });
      if (newPositionOfLyrics && newPositionOfLyrics.length > 0) {
        const filteredNewPositionOfLyrics = newPositionOfLyrics.filter(
          (lyric) => lyric !== undefined,
        ) as { id: number; position: number }[];
        mutateUpdateLyricsPositions(filteredNewPositionOfLyrics);
      }
    }
  }, [
    statusDeleteLyric,
    lyricsOfCurrentSong,
    lyric.position,
    mutateUpdateLyricsPositions,
  ]);

  // Efecto para cerrar después de actualizar posiciones
  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success') {
      toast.success('Letra eliminada');
      refetchLyricsOfCurrentSong();
      onClose();
    }
  }, [statusUpdateLyricsPositions, refetchLyricsOfCurrentSong, onClose]);

  // Refetch cuando termine actualización de parsing
  useEffect(() => {
    if (statusParseAndUpdate === 'success') {
      toast.success('Letra actualizada');

      // Si solo cambiamos texto (o ambas cosas y el parsing terminó último), cerramos
      if (
        selectedStructureId === initialStructureId ||
        statusUpdateLyric === 'success'
      ) {
        refetchLyricsOfCurrentSong();
        onClose();
      }
    } else if (statusParseAndUpdate === 'error') {
      toast.error('Error al actualizar la letra');
    }
  }, [
    statusParseAndUpdate,
    refetchLyricsOfCurrentSong,
    onClose,
    selectedStructureId,
    initialStructureId,
    statusUpdateLyric,
  ]);

  // Refetch cuando termine actualización de estructura
  useEffect(() => {
    if (statusUpdateLyric === 'success') {
      // Si solo cambiamos estructura, cerramos. Si también cambiamos texto, esperamos a parseAndUpdate
      if (
        text.trim() === initialText.trim() ||
        statusParseAndUpdate === 'success'
      ) {
        toast.success('Estructura actualizada');
        refetchLyricsOfCurrentSong();
        onClose();
      }
    } else if (statusUpdateLyric === 'error') {
      toast.error('Error al actualizar estructura');
    }
  }, [
    statusUpdateLyric,
    refetchLyricsOfCurrentSong,
    onClose,
    text,
    initialText,
    statusParseAndUpdate,
  ]);

  // Manejar teclas
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex w-full flex-col gap-2 rounded-lg border-2 p-2 transition-all ${showUnsavedWarning && hasChanges ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setShowUnsavedWarning(false); // Quitar advertencia al empezar a escribir
        }}
        onKeyDown={handleKeyDown}
        className="w-full resize-none rounded-md border-1 border-primary-300 bg-primary-50/50 p-2 font-mono leading-relaxed text-slate-800 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-200 dark:bg-black dark:text-white"
        placeholder={`       Em      D        Am
Mi Dios eres mi fortaleza`}
        spellCheck={false}
        style={{
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          fontSize: `${lyricsScale}rem`,
          minHeight: '3.5em',
          lineHeight: '1.5',
        }}
        rows={text.split('\n').length || 2}
      />

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
        {/* Selector de Estructura */}
        <div className="">
          <select
            value={selectedStructureId}
            onChange={(e) => setSelectedStructureId(Number(e.target.value))}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            {songStructure.map((s) => (
              <option key={s.id} value={s.id}>
                {structureLib[s.title as keyof typeof structureLib]?.es ||
                  s.title}
              </option>
            ))}
          </select>
        </div>
        {/* Lado izquierdo - Eliminar */}
        <div className="flex items-center gap-2">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-red-600">¿Eliminar?</p>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLyric();
                }}
                disabled={isPendingDeleteLyric}
                className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPendingDeleteLyric ? '...' : 'Sí'}
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 active:scale-95"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="rounded-md bg-red-100 p-1.5 transition-all hover:bg-red-200 active:scale-95"
                title="Eliminar letra"
              >
                <DeleteMusicIcon className="h-4 w-4 text-red-600" />
              </button>
              <p
                className={`text-xs ${showUnsavedWarning && hasChanges ? 'font-semibold text-red-600' : 'text-slate-500'}`}
              >
                {showUnsavedWarning && hasChanges
                  ? '⚠ Hay cambios sin guardar'
                  : hasChanges
                    ? '• Hay cambios'
                    : '• Sin cambios'}
              </p>
            </>
          )}
        </div>

        {/* Lado derecho - Cancelar/Guardar */}
        {!showDeleteConfirm && (
          <div className="flex gap-2">
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="rounded-md bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit();
              }}
              disabled={
                !hasChanges ||
                statusParseAndUpdate === 'pending' ||
                isPendingUpdateLyric
              }
              className="rounded-md bg-primary-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusParseAndUpdate === 'pending' || isPendingUpdateLyric
                ? 'Guardando...'
                : 'Guardar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
