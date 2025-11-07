import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UnpluggedIcon } from '@global/icons/UnpluggedIcon';
import { useStore } from '@nanostores/react';
import { $event, $eventConfig } from '@stores/event';
import { handleTranspose } from '../../_utils/handleTranspose';
import { SongLyricsWithChords } from './SongLyricsWithChords';
import { useReactToPrint } from 'react-to-print';
import { formatDate } from '@global/utils/dataFormat';
import { PrintIcon } from '@global/icons/PrintIcon';
import { CloseIcon } from '@global/icons/CloseIcon';

export const OfflineView = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const event = useStore($event);
  const eventConfig = useStore($eventConfig);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenOffLineView = () => {
    setOpen(!open);
  };
  const handlePrint = useReactToPrint({
    documentTitle: `${event?.title} - ${formatDate(event?.date)}`,
    contentRef: componentRef,
    pageStyle: `
      @page {
        margin: 20mm;
        scale: 130;
      }
      @media print {
        body::before {
          content: "${event?.title} - ${formatDate(event?.date)}";
          display: block;
          text-align: center;
          font-size: 20px;
          margin-bottom: 20px;
        }
      }
    `,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    if (event && open) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [event, open]);

  return (
    <>
      <button
        onClick={handleOpenOffLineView}
        className="rounded-full p-2 transition-all duration-200 hover:bg-gradient-icon hover:shadow-md"
        aria-label={open ? 'Cerrar vista offline' : 'Abrir vista offline'}
      >
        <UnpluggedIcon className="text-brand-purple-600" />
      </button>

      {open &&
        mounted &&
        createPortal(
          <>
            {/* Overlay backdrop */}
            <div
              className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
              onClick={handleOpenOffLineView}
            />

            {/* Modal full screen */}
            <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col bg-white">
              {/* Header de controles */}
              <div className="sticky top-0 z-50 flex items-center justify-between border-b border-brand-purple-200 bg-gradient-light px-4 py-3 shadow-md backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <UnpluggedIcon className="h-6 w-6 text-brand-purple-600" />
                  <h2 className="text-lg font-semibold text-gradient-primary">
                    Vista Offline - {event?.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-2 rounded-lg bg-gradient-icon px-4 py-2 text-brand-purple-600 transition-all duration-300 hover:bg-gradient-light hover:shadow-md"
                    aria-label="Imprimir"
                  >
                    <PrintIcon />
                    <span className="hidden sm:inline">Imprimir</span>
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={handleOpenOffLineView}
                    aria-label="Cerrar"
                  >
                    <CloseIcon />
                    <span className="hidden sm:inline">Cerrar</span>
                  </button>
                </div>
              </div>

              {/* Contenido scrollable */}
              <div className="flex flex-1 flex-col items-center overflow-y-auto bg-gradient-subtle px-4 py-6">
                <div ref={componentRef} className="max-w-[50rem]">
                  <div className="flex flex-col gap-2 text-slate-800">
                    {event?.songs
                      .sort((a, b) => a.order - b.order)
                      .map((data) => (
                        <div
                          key={data.song.id}
                          className="mb-10 rounded-xl border border-brand-purple-200 bg-white p-6 shadow-md transition-all hover:shadow-lg"
                        >
                          <h2 className="mb-4 text-center text-2xl font-bold text-brand-purple-600">
                            {data.order}) {data.song.title}{' '}
                            {data.song.key !== null &&
                              eventConfig.showChords && (
                                <span className="text-lg font-normal text-brand-blue-600">
                                  (
                                  {handleTranspose(
                                    data.song.key,
                                    data.transpose,
                                  )}
                                  )
                                </span>
                              )}
                          </h2>

                          <div className="flex gap-2">
                            <SongLyricsWithChords data={data} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
};
