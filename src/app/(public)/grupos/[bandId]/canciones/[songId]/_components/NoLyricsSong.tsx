'use client';
import React, { useState } from 'react';
import { AddOrUpdateLyricForm } from './AddOrUpdateLyricForm';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { LyricsTextEditor } from './LyricsTextEditor';

export const NoLyricsSong = ({
  mutateUploadLyricsByFile,
  refetchLyricsOfCurrentSong,
  LyricsOfCurrentSong,
  params,
  songTitle,
}: {
  mutateUploadLyricsByFile: (formData: FormData) => void;
  refetchLyricsOfCurrentSong: () => void;
  LyricsOfCurrentSong: LyricsProps[];
  params: { bandId: string; songId: string };
  songTitle?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'upload'>('editor');

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
      const formData = new FormData();
      formData.append('file', file);
      mutateUploadLyricsByFile(formData);
    } else {
      alert('Por favor, arrastra un archivo .txt');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      mutateUploadLyricsByFile(formData);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="text-center">
        <h3 className="mb-2 text-2xl font-bold text-slate-800">
          Esta canción aún no tiene letra
        </h3>
        <p className="text-slate-600">
          Elige cómo quieres agregar la letra de la canción
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
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-sm">
        {activeTab === 'editor' ? (
          <div className="flex flex-col items-center space-y-6">
            <LyricsTextEditor
              params={params}
              songTitle={songTitle}
              refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            />
            <div className="w-full max-w-3xl border-t-2 border-slate-200 pt-4">
              <AddOrUpdateLyricForm
                refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                LyricsOfCurrentSong={LyricsOfCurrentSong}
                params={params}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            <h4 className="text-xl font-bold text-slate-800">
              Subir Archivo .txt
            </h4>
            <p className="text-slate-600">
              Al subir un archivo txt con la letra y acordes, ten en cuenta lo
              siguiente:
            </p>
            <ul className="list-inside list-disc space-y-2 text-slate-700">
              <li>
                Incluye etiquetas de estructura entre paréntesis: (verso),
                (coro), (intro), (puente)
              </li>
              <li>Los acordes deben estar sobre la letra (línea anterior)</li>
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
                  : 'border-slate-300 bg-slate-50 hover:border-primary-400 hover:bg-slate-100'
              }`}
            >
              <input
                type="file"
                accept=".txt"
                onChange={handleFileInput}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
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
          </div>
        )}
      </div>
    </div>
  );
};
