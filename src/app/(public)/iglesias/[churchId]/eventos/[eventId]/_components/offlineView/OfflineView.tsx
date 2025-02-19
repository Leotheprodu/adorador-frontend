import { useEffect, useState, useRef } from 'react';
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
  const event = useStore($event);
  const eventConfig = useStore($eventConfig);
  const componentRef = useRef<HTMLDivElement>(null);
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
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, open]);

  return (
    <div>
      <button
        onClick={handleOpenOffLineView}
        className="rounded-full p-2 duration-200 hover:bg-slate-300"
      >
        <UnpluggedIcon className="text-primary-500" />
      </button>

      {open && (
        <div className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white p-3">
          <div className="absolute right-0 top-0 flex items-center justify-between bg-slate-100 px-2 py-1 text-3xl opacity-50 hover:opacity-100">
            <button onClick={() => handlePrint()} className="text-primary-500">
              <PrintIcon />
            </button>
            <button className="text-danger-500" onClick={handleOpenOffLineView}>
              <CloseIcon />
            </button>
          </div>

          <div className="flex h-full w-full flex-col items-center justify-start overflow-y-scroll">
            <div ref={componentRef} className="max-w-[40rem]">
              <div className="flex h-full w-full flex-col gap-2 p-2 text-slate-800">
                {event?.songs
                  .sort((a, b) => a.order - b.order)
                  .map((data) => (
                    <div key={data.song.id} className="mb-14 p-6">
                      <h2 className="text-center text-2xl text-primary-500">
                        {data.order}) {data.song.title}{' '}
                        {data.song.key !== null && eventConfig.showChords && (
                          <span className="text-lg">
                            ({handleTranspose(data.song.key, data.transpose)})
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
      )}
    </div>
  );
};
