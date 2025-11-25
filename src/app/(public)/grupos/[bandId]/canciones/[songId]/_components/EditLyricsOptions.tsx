'use client';
import { useState, useEffect } from 'react';
import { LyricsTextEditor } from './LyricsTextEditor';
import { convertLyricsToPlainText } from '../_utils/lyricsConverter';
import { deleteAllLyricsService } from '../_services/songIdServices';
import { EditLyricsOptionsProps } from '../_interfaces/lyricsInterfaces';
import { useFileUpload } from '../_hooks/useFileUpload';
import { FileDropZone } from './lyrics/FileDropZone';

export const EditLyricsOptions = ({
  params,
  songTitle,
  refetchLyricsOfCurrentSong,
  mutateUploadLyricsByFile,
  existingLyrics,
  isExpanded: controlledIsExpanded,
  onClose: controlledOnClose,
}: EditLyricsOptionsProps) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'upload'>('editor');
  const [initialText, setInitialText] = useState<string>('');

  // Use controlled prop if provided, otherwise use internal state
  const isExpanded = controlledIsExpanded ?? internalIsExpanded;

  const { mutate: mutateDeleteAllLyrics, status: statusDeleteAllLyrics } =
    deleteAllLyricsService({ params });

  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
  } = useFileUpload();

  // Check URL hash on mount to auto-expand if coming from alert
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash === '#edit-lyrics' &&
      !controlledIsExpanded
    ) {
      setInternalIsExpanded(true);
      // Remove the hash after using it
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert existing lyrics to plain text when component mounts or lyrics change
  useEffect(() => {
    if (existingLyrics && existingLyrics.length > 0) {
      const plainText = convertLyricsToPlainText(existingLyrics);
      setInitialText(plainText);
    }
  }, [existingLyrics]);

  // Refetch after successful deletion
  useEffect(() => {
    if (statusDeleteAllLyrics === 'success') {
      refetchLyricsOfCurrentSong();
    }
  }, [statusDeleteAllLyrics, refetchLyricsOfCurrentSong]);

  const handleFileUploadWithDelete = async (file: File) => {
    // First delete all existing lyrics
    mutateDeleteAllLyrics(undefined, {
      onSuccess: () => {
        // Then upload the new file
        const formData = new FormData();
        formData.append('file', file);
        mutateUploadLyricsByFile(formData);
      },
    });
  };

  return (
    <div className="w-full max-w-5xl space-y-4">
      {/* Collapsed Button */}
      {!isExpanded && (
        <button
          onClick={() => setInternalIsExpanded(true)}
          className="group w-full rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 p-4 transition-all hover:border-primary-500 hover:bg-primary-100 dark:border-primary-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">✏️</span>
            <div className="text-left">
              <p className="font-semibold text-primary-700">
                Editar o Reemplazar Letras
              </p>
              <p className="text-sm text-primary-600">
                Usa el editor de texto o sube un nuevo archivo
              </p>
            </div>
            <svg
              className="ml-auto h-6 w-6 text-primary-600 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border-2 border-primary-200 bg-white p-6 shadow-md dark:bg-gray-900 dark:border-primary-800 dark:shadow-none">
          {/* Close Button */}
          <button
            onClick={() =>
              controlledOnClose
                ? controlledOnClose()
                : setInternalIsExpanded(false)
            }
            className="ml-auto flex items-center gap-2 rounded-md px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-gray-800 dark:hover:text-slate-100"
          >
            <span>Cerrar</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="w-full text-center">
            <h3 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
              Editar o Reemplazar Letras
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Elige cómo quieres actualizar la letra de la canción
            </p>
          </div>

          {/* Tabs */}
          <div className="flex w-full max-w-4xl justify-center gap-2 border-b-2 border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-3 font-semibold transition-all ${activeTab === 'editor'
                  ? 'border-b-4 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
            >
              ✍️ Editor de Texto
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-semibold transition-all ${activeTab === 'upload'
                  ? 'border-b-4 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
            >
              📁 Subir Archivo
            </button>
          </div>

          {/* Content */}
          <div className="w-full rounded-lg bg-slate-50 p-6 dark:bg-gray-950">
            {activeTab === 'editor' ? (
              <div className="flex flex-col items-center">
                <LyricsTextEditor
                  params={params}
                  songTitle={songTitle}
                  refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                  initialText={initialText}
                  isEditMode={true}
                  onClose={() =>
                    controlledOnClose
                      ? controlledOnClose()
                      : setInternalIsExpanded(false)
                  }
                />
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-4">
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Subir Archivo .txt
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Al subir un archivo txt con la letra y acordes, ten en cuenta
                  lo siguiente:
                </p>
                <ul className="list-inside list-disc space-y-2 text-slate-700 dark:text-slate-200">
                  <li>
                    Incluye etiquetas de estructura entre paréntesis: (verso),
                    (coro), (intro), (puente)
                  </li>
                  <li>
                    Los acordes deben estar sobre la letra (línea anterior)
                  </li>
                  <li>Formato de acordes: Em, D, Gbm, C#, Bb/G, etc.</li>
                  <li>Puedes usar bemoles (b) y sostenidos (#)</li>
                  <li>Puedes dejar espacios en blanco entre secciones</li>
                  <li>El archivo txt debe estar codificado en UTF-8</li>
                </ul>

                <FileDropZone
                  isDragging={isDragging}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, handleFileUploadWithDelete)}
                  onFileSelect={(e) =>
                    handleFileInput(e, handleFileUploadWithDelete)
                  }
                />

                <div className="rounded-md bg-warning-50 p-4 dark:bg-warning-900">
                  <p className="text-sm font-semibold text-warning-800 dark:text-warning-200">
                    ⚠️ Advertencia
                  </p>
                  <p className="text-sm text-warning-700 dark:text-warning-100">
                    Al subir un nuevo archivo o usar el editor, se reemplazarán
                    todas las letras existentes de esta canción.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
