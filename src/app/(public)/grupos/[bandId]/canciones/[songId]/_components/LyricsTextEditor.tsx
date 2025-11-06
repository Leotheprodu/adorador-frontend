'use client';
import { useState, useEffect } from 'react';
import {
  saveTempLyrics,
  getTempLyrics,
  deleteTempLyrics,
} from '../_utils/lyricsStorage';
import {
  parseTextLyricsService,
  deleteAllLyricsService,
} from '../_services/songIdServices';
import { PrimaryButton } from '@global/components/buttons';
import toast from 'react-hot-toast';

interface LyricsTextEditorProps {
  params: { bandId: string; songId: string };
  songTitle?: string;
  refetchLyricsOfCurrentSong: () => void;
  initialText?: string;
  isEditMode?: boolean;
  onClose?: () => void;
}

export const LyricsTextEditor = ({
  params,
  songTitle,
  refetchLyricsOfCurrentSong,
  initialText,
  isEditMode = false,
  onClose,
}: LyricsTextEditorProps) => {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { mutate: mutateParseText, status: statusParseText } =
    parseTextLyricsService({ params });
  const { mutate: mutateDeleteAllLyrics } = deleteAllLyricsService({ params });

  // Load initial text (for edit mode) or saved lyrics (for new mode)
  useEffect(() => {
    // Always check localStorage first (in both modes)
    const saved = getTempLyrics(params.bandId, params.songId);
    if (saved) {
      // If there's something saved in localStorage, use that
      setText(saved.text);
      setLastSaved(new Date(saved.timestamp));
    } else if (isEditMode && initialText) {
      // Only if there's nothing in localStorage and we're in edit mode, use initialText
      setText(initialText);
    }
    // If neither exists, text stays empty
  }, [params.bandId, params.songId, initialText, isEditMode]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!text) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      saveTempLyrics(params.bandId, params.songId, text, songTitle);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [text, params.bandId, params.songId, songTitle]);

  // Refetch after successful parse
  useEffect(() => {
    if (statusParseText === 'success') {
      // Clear temp lyrics from localStorage after successful upload
      deleteTempLyrics(params.bandId, params.songId);
      toast.success('Letra cargada exitosamente');
      refetchLyricsOfCurrentSong();
      // Close the editor after successful save
      onClose?.();
    }
  }, [
    statusParseText,
    refetchLyricsOfCurrentSong,
    params.bandId,
    params.songId,
    onClose,
  ]);

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error('Por favor escribe la letra de la canción');
      return;
    }

    if (isEditMode) {
      // In edit mode, first delete all existing lyrics, then upload new ones
      mutateDeleteAllLyrics(undefined, {
        onSuccess: () => {
          // After successful deletion, parse the new text
          mutateParseText({ textContent: text });
        },
      });
    } else {
      // In new mode, just parse the text
      mutateParseText({ textContent: text });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <div>
          <h4 className="text-lg font-bold">Editor de Letras</h4>
          <p className="text-sm text-slate-600">
            Escribe la letra con los acordes sobre cada línea
          </p>
        </div>
        {lastSaved && (
          <div className="text-sm text-slate-500">
            {isSaving ? (
              <span className="text-primary-500">Guardando...</span>
            ) : (
              <span>Guardado: {lastSaved.toLocaleTimeString('es-ES')}</span>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl rounded-lg border-1 border-slate-200 bg-white p-4">
        <h5 className="mb-3 font-semibold text-slate-700">
          Instrucciones de formato:
        </h5>
        <ul className="mb-4 space-y-1 text-sm text-slate-600">
          <li>
            • Incluye etiquetas de estructura entre paréntesis: (verso), (coro),
            (intro), (puente)
          </li>
          <li>• Los acordes van sobre la letra (línea anterior)</li>
          <li>• Formato de acordes: Em, D, Gbm, C#, Bb/G, etc.</li>
          <li>• Puedes usar bemoles (b) y sostenidos (#)</li>
          <li>• Puedes dejar espacios en blanco entre secciones</li>
        </ul>

        <div className="mb-4 rounded-md bg-slate-50 p-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">Ejemplo:</p>
          <pre className="whitespace-pre-wrap text-xs text-slate-600">
            {`(verso)
Em
Mi Dios, eres mi fortaleza
          D/E
A ti me entrego yo



(coro)
       Em      Gbm
Senor, eres mi anhelo
           D
Eres todo para mi`}
          </pre>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Escribe aquí la letra con los acordes...

Ejemplo:
(verso)
Em
Mi Dios, eres mi fortaleza
          D/E
A ti me entrego yo



(coro)
       Em      Gbm
Senor, eres mi anhelo
           D
Eres todo para mi`}
          className="min-h-[300px] w-full rounded-md border-1 border-slate-300 p-4 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          spellCheck={false}
        />
      </div>

      <div className="flex w-full max-w-3xl justify-end gap-3">
        <PrimaryButton
          onClick={handleSubmit}
          disabled={!text.trim() || statusParseText === 'pending'}
          isLoading={statusParseText === 'pending'}
        >
          {statusParseText === 'pending' ? 'Procesando...' : 'Cargar Letra'}
        </PrimaryButton>
      </div>

      {statusParseText === 'error' && (
        <div className="rounded-md bg-danger-50 p-4 text-danger-800">
          <p className="font-semibold">Error al procesar la letra</p>
          <p className="text-sm">
            Verifica que el formato sea correcto y vuelve a intentarlo.
          </p>
        </div>
      )}
    </div>
  );
};
