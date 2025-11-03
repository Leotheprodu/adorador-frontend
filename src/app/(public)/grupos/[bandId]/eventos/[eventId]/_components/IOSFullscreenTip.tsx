'use client';

import { useState } from 'react';

export const IOSFullscreenTip = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-2 right-2 max-w-xs">
      <div className="relative rounded-lg bg-black/80 p-3 text-xs text-white">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-1 top-1 text-lg leading-none text-white/60 hover:text-white"
        >
          ×
        </button>
        <div className="mb-2">
          <strong>💡 Pantalla completa en iOS:</strong>
        </div>
        <ol className="list-inside list-decimal space-y-1">
          <li>
            Toca el botón de compartir <span className="text-blue-300">⎋</span>{' '}
            en Safari
          </li>
          <li>Selecciona &ldquo;Añadir a pantalla de inicio&rdquo;</li>
          <li>Abre desde la app instalada para pantalla completa</li>
        </ol>
        <div className="mt-2 text-xs text-gray-300">
          O rota tu dispositivo a horizontal
        </div>
      </div>
    </div>
  );
};
