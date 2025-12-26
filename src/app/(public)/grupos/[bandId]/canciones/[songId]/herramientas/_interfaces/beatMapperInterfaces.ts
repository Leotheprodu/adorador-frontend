export interface BeatMarker {
  time: number; // Time in seconds
  label: number; // Beat number (1, 2, 3, 4)
  measure: number; // Measure number
  id: string; // Unique ID
  isProjected?: boolean; // If true, it's a predicted beat, not manually tapped
}

export interface SavedSongData {
  startTime: number;
  beats: BeatMarker[];
  tempo?: number;
}

export interface BeatMapperProps {
  youtubeLink?: string;
  songId: string;
}
