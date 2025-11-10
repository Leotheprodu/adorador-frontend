'use client';
import { useState, useEffect } from 'react';
import { LyricsTextEditor } from './LyricsTextEditor';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { convertLyricsToPlainText } from '../_utils/lyricsConverter';
import { deleteAllLyricsService } from '../_services/songIdServices';

interface EditLyricsOptionsProps {
  params: { bandId: string; songId: string };
  songTitle?: string;
  refetchLyricsOfCurrentSong: () => void;
  mutateUploadLyricsByFile: (formData: FormData) => void;
  existingLyrics: LyricsProps[];
}

export const EditLyricsOptions = ({
  params,
  songTitle,
  refetchLyricsOfCurrentSong,
  mutateUploadLyricsByFile,
  existingLyrics,
}: EditLyricsOptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'upload'>('editor');
  const [isDragging, setIsDragging] = useState(false);
  const [initialText, setInitialText] = useState<string>('');

  const { mutate: mutateDeleteAllLyrics, status: statusDeleteAllLyrics } =
    deleteAllLyricsService({ params });

  // Check URL hash on mount to auto-expand if coming from alert
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash === '#edit-lyrics'
    ) {
      setIsExpanded(true);
      // Remove the hash after using it
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/plain') {
      handleFileUploadWithDelete(file);
    } else {
      alert('Por favor, arrastra un archivo .txt');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUploadWithDelete(file);
    }
  };

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
          onClick={() => setIsExpanded(true)}
          className="group w-full rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 p-4 transition-all hover:border-primary-500 hover:bg-primary-100"
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
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border-2 border-primary-200 bg-white p-6 shadow-md">
          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="ml-auto flex items-center gap-2 rounded-md px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
            <h3 className="mb-2 text-2xl font-bold text-slate-800">
              Editar o Reemplazar Letras
            </h3>
            <p className="text-slate-600">
              Elige cómo quieres actualizar la letra de la canción
            </p>
          </div>

          {/* Tabs */}
          <div className="flex w-full max-w-4xl justify-center gap-2 border-b-2 border-slate-200">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'border-b-4 border-primary-500 text-primary-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ✍️ Editor de Texto
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'border-b-4 border-primary-500 text-primary-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              📁 Subir Archivo
            </button>
          </div>

          {/* Content */}
          <div className="w-full rounded-lg bg-slate-50 p-6">
            {activeTab === 'editor' ? (
              <div className="flex flex-col items-center">
                <LyricsTextEditor
                  params={params}
                  songTitle={songTitle}
                  refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                  initialText={initialText}
                  isEditMode={true}
                  onClose={() => setIsExpanded(false)}
                />
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-4">
                <h4 className="text-xl font-bold text-slate-800">
                  Subir Archivo .txt
                </h4>
                <p className="text-slate-600">
                  Al subir un archivo txt con la letra y acordes, ten en cuenta
                  lo siguiente:
                </p>
                <ul className="list-inside list-disc space-y-2 text-slate-700">
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

                {/* Modern Drag & Drop Area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative mt-6 rounded-lg border-2 border-dashed p-8 transition-all ${
                    isDragging
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileInput}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    id="file-upload-edit"
                  />
                  <label
                    htmlFor="file-upload-edit"
                    className="flex cursor-pointer flex-col items-center justify-center space-y-3"
                  >
                    <div
                      className={`rounded-full p-4 ${
                        isDragging ? 'bg-primary-200' : 'bg-slate-200'
                      }`}
                    >
                      <svg
                        className={`h-12 w-12 ${
                          isDragging ? 'text-primary-600' : 'text-slate-500'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-slate-700">
                        {isDragging
                          ? 'Suelta el archivo aquí'
                          : 'Arrastra tu archivo .txt aquí'}
                      </p>
                      <p className="text-sm text-slate-500">
                        o haz clic para seleccionar
                      </p>
                    </div>
                    <div className="rounded-full bg-primary-100 px-4 py-2">
                      <span className="text-sm font-medium text-primary-700">
                        Solo archivos .txt
                      </span>
                    </div>
                  </label>
                </div>

                <div className="rounded-md bg-warning-50 p-4">
                  <p className="text-sm font-semibold text-warning-800">
                    ⚠️ Advertencia
                  </p>
                  <p className="text-sm text-warning-700">
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
