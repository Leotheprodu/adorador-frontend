'use client';
import { useState, useEffect, useRef } from 'react';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import {
  addNewLyricService,
  updateLyricsPositionsService,
  parseAndUpdateSingleLyricService,
} from '../_services/songIdServices';
import toast from 'react-hot-toast';

interface MiniLyricsCreatorProps {
  params: { bandId: string; songId: string };
  refetchLyricsOfCurrentSong: () => void;
  onClose: () => void;
  lyricsScale?: number;
  lyricsOfCurrentSong: LyricsProps[];
  newPosition: number;
  structureId: number;
}

export const MiniLyricsCreator = ({
  params,
  refetchLyricsOfCurrentSong,
  onClose,
  lyricsScale = 1,
  lyricsOfCurrentSong,
  newPosition,
  structureId,
}: MiniLyricsCreatorProps) => {
  const [text, setText] = useState('');
  const [newLyricId, setNewLyricId] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    mutate: mutateAddNewLyric,
    status: statusAddNewLyric,
    isPending: isPendingAddNewLyric,
    data: dataAddNewLyric,
  } = addNewLyricService({ params });

  const {
    mutate: mutateUpdateLyricsPositions,
    status: statusUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });

  // Hook de parseo que se inicializa con el lyricId dinámico
  const {
    mutate: mutateParseAndUpdate,
    status: statusParseAndUpdate,
    isPending: isPendingParseAndUpdate,
  } = parseAndUpdateSingleLyricService({
    params,
    lyricId: newLyricId || 0,
  });

  // Focus automático al abrir
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Paso 1: Actualizar posiciones si es necesario
  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success') {
      // Después de actualizar posiciones, crear la nueva letra (sin acordes aún)
      mutateAddNewLyric({
        structureId,
        lyrics: text,
        position: newPosition,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateLyricsPositions]);

  // Paso 2: Después de crear la letra, parsear acordes
  useEffect(() => {
    if (statusAddNewLyric === 'success' && dataAddNewLyric) {
      const lyricId = dataAddNewLyric.id;
      if (lyricId) {
        setNewLyricId(lyricId);
        // Esperar un tick para que el hook se actualice con el nuevo lyricId
        setTimeout(() => {
          mutateParseAndUpdate({ textContent: text });
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddNewLyric, dataAddNewLyric]);

  // Paso 3: Finalizar después del parsing
  useEffect(() => {
    if (statusParseAndUpdate === 'success') {
      toast.success('Letra agregada');
      refetchLyricsOfCurrentSong();
      onClose();
    }
  }, [statusParseAndUpdate, refetchLyricsOfCurrentSong, onClose]);

  // Detectar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Si no hay texto, cerrar sin confirmar
        if (!text.trim()) {
          onClose();
        }
        // Si hay texto, mostrar advertencia visual (borde rojo)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [text, onClose]);

  const handleSave = () => {
    if (!text.trim()) {
      toast.error('La letra no puede estar vacía');
      return;
    }

    // Verificar si necesitamos actualizar posiciones
    if (newPosition <= lyricsOfCurrentSong.length) {
      // Hay letras que necesitan moverse
      const lyricsToUpdate = lyricsOfCurrentSong
        .filter((lyric) => lyric.position >= newPosition)
        .map((lyric) => ({
          id: lyric.id,
          position: lyric.position + 1,
        }));

      if (lyricsToUpdate.length > 0) {
        mutateUpdateLyricsPositions(lyricsToUpdate);
      } else {
        // No hay letras que mover, crear directamente
        mutateAddNewLyric({
          structureId,
          lyrics: text,
          position: newPosition,
        });
      }
    } else {
      // Es la última posición, crear directamente
      mutateAddNewLyric({
        structureId,
        lyrics: text,
        position: newPosition,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (!text.trim()) {
        onClose();
      }
    }
    // Ctrl/Cmd + Enter para guardar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`group/editor relative rounded-md border-2 bg-white p-2 shadow-sm transition-all ${
        hasText
          ? 'border-primary-300 bg-primary-50/50'
          : 'border-slate-200 bg-slate-50'
      }`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Textarea para escribir */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe la letra aquí (acordes arriba, letra abajo)&#10;Ej:&#10;    C       Am&#10;Gloria a Dios"
        className={`w-full resize-none overflow-hidden rounded border-none bg-transparent px-2 py-1 font-mono outline-none transition-all`}
        style={{
          fontSize: `${lyricsScale}rem`,
          minHeight: '4rem',
          lineHeight: '1.5',
        }}
        rows={3}
      />

      {/* Botones de acción */}
      <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-200 pt-2">
        <button
          onClick={onClose}
          disabled={isPendingAddNewLyric || isPendingParseAndUpdate}
          className="rounded px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!hasText || isPendingAddNewLyric || isPendingParseAndUpdate}
          className="rounded bg-primary-500 px-3 py-1 text-sm text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPendingAddNewLyric || isPendingParseAndUpdate
            ? 'Guardando...'
            : 'Guardar'}
        </button>
      </div>

      {/* Ayuda de teclado */}
      <div className="mt-1 text-xs text-slate-400">
        <kbd className="rounded bg-slate-100 px-1">ESC</kbd> para cancelar •{' '}
        <kbd className="rounded bg-slate-100 px-1">Ctrl+Enter</kbd> para guardar
      </div>
    </div>
  );
};
