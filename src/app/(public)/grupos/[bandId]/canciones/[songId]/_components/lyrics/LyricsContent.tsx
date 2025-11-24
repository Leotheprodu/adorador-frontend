import { ChordDisplay } from '../ChordDisplay';
import { LyricsContentProps } from '../../_interfaces/lyricsInterfaces';

export const LyricsContent = ({
    lyric,
    transpose,
    showChords,
    lyricsScale,
    chordPreferences,
    isEditMode = false,
}: LyricsContentProps) => {
    return (
        <div
            className={isEditMode ? 'w-full' : ''}
            style={isEditMode ? undefined : { width: 'fit-content' }}
        >
            {/* Chords Section */}
            {!isEditMode && showChords && lyric.chords && lyric.chords.length > 0 && (
                <ChordDisplay
                    chords={lyric.chords}
                    transpose={transpose}
                    chordPreferences={chordPreferences}
                    lyricsScale={lyricsScale}
                />
            )}

            {/* Lyrics Text */}
            <div
                style={{ fontSize: `${lyricsScale}rem` }}
                className="font-medium leading-relaxed text-slate-800 dark:text-slate-100"
            >
                {lyric.lyrics}
            </div>
        </div>
    );
};
