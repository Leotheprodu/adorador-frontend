import { LyricsSectionProps } from '../_interfaces/songIdInterfaces';
import { EditLyricsOptions } from './EditLyricsOptions';
import { LyricsGroupedCard } from './LyricsGroupedCard';
import { NoLyricsSong } from './NoLyricsSong';

export const LyricsSection = ({
    params,
    songTitle,
    lyrics,
    lyricsGrouped,
    isEditMode,
    isPracticeMode,
    transpose,
    showChords,
    lyricsScale,
    chordPreferences,
    refetchLyricsOfCurrentSong,
    mutateUploadLyricsByFile,
    onEditModeChange,
}: LyricsSectionProps) => {
    return (
        <section className="px-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
                {lyrics && lyrics.length > 0 ? (
                    <>
                        {isEditMode ? (
                            <EditLyricsOptions
                                params={params}
                                songTitle={songTitle}
                                refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                                mutateUploadLyricsByFile={mutateUploadLyricsByFile}
                                existingLyrics={lyrics}
                                isExpanded={true}
                                onClose={() => onEditModeChange(false)}
                            />
                        ) : (
                            lyricsGrouped?.map(([structure, groupLyrics], groupIndex) => (
                                <LyricsGroupedCard
                                    key={groupIndex}
                                    structure={structure}
                                    lyrics={groupLyrics}
                                    refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                                    params={params}
                                    chordPreferences={chordPreferences}
                                    lyricsOfCurrentSong={lyrics}
                                    transpose={transpose}
                                    showChords={showChords}
                                    lyricsScale={lyricsScale}
                                    isPracticeMode={isPracticeMode}
                                />
                            ))
                        )}
                    </>
                ) : (
                    <NoLyricsSong
                        mutateUploadLyricsByFile={mutateUploadLyricsByFile}
                        refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                        LyricsOfCurrentSong={lyrics ?? []}
                        params={params}
                        songTitle={songTitle}
                    />
                )}
            </div>
        </section>
    );
};
