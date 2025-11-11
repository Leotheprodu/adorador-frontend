import { useStore } from '@nanostores/react';
import {
  $eventConfig,
  $selectedSongData,
  $chordPreferences,
} from '@stores/event';
import { structureColors, structureLib } from '@global/config/constants';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/getNoteByType';
import type { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

interface NextLinePreviewProps {
  nextLine: LyricsProps;
}

export const NextLinePreview = ({ nextLine }: NextLinePreviewProps) => {
  const selectedSongData = useStore($selectedSongData);
  const eventConfig = useStore($eventConfig);
  const chordPreferences = useStore($chordPreferences);

  return (
    <div className="mt-8 border-t-2 border-dashed border-slate-500/30 pt-4">
      <div className="flex flex-col items-center gap-3 opacity-50">
        <p className="text-sm uppercase tracking-wider text-slate-400">
          Siguiente:
        </p>
        {/* Layout de dos columnas */}
        <div className="flex items-center justify-center gap-4 px-4">
          {/* Columna izquierda: Nombre de la estructura */}
          <div className="flex items-center justify-center">
            <span
              style={{
                color:
                  structureColors[nextLine.structure.title] ||
                  structureColors.verse,
                filter: 'brightness(1.3)',
              }}
              className="text-base font-semibold uppercase"
            >
              {structureLib[nextLine.structure.title]?.es ||
                nextLine.structure.title}
              :
            </span>
          </div>
          {/* Columna derecha: Acordes y Letra */}
          <div className="flex flex-1 flex-col items-start gap-1">
            {/* Acordes de la siguiente línea */}
            {eventConfig.showChords && nextLine.chords.length > 0 && (
              <div className="grid w-full grid-cols-5 gap-1">
                {nextLine.chords
                  .sort((a, b) => a.position - b.position)
                  .map((chord) => (
                    <div
                      key={chord.id}
                      style={{
                        gridColumnStart: chord.position,
                        gridColumnEnd: chord.position + 1,
                      }}
                      className="col-span-1 flex items-center justify-center gap-1"
                    >
                      <div className="flex items-end justify-center">
                        <p className="text-center text-sm text-slate-300">
                          {getNoteByType(
                            chord.rootNote,
                            selectedSongData?.transpose,
                            chordPreferences,
                          )}
                        </p>
                        <p className="text-center text-sm text-slate-400">
                          {chord.chordQuality}
                        </p>
                      </div>
                      {chord.slashChord && (
                        <div className="flex items-end justify-center rounded-sm bg-slate-700 px-2 text-slate-300">
                          <p className="text-center text-sm">
                            {getNoteByType(
                              chord.slashChord,
                              selectedSongData?.transpose,
                              chordPreferences,
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {/* Letra de la siguiente línea */}
            <span className="w-full text-center text-base text-slate-300">
              {nextLine.lyrics}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
