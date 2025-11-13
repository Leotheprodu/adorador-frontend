/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import type React from 'react';

export const handleOnChange = <T extends Record<string, any>>(
  setForm: (updater: (prevState: T) => T) => void,
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const { name, value } = mapEventToNameAndValue(e);
  setForm((prev) => ({ ...prev, [name]: value }));
};

// Esta función de mapeo toma el evento y la función setForm y devuelve { name, value } con los tipos correctos.
const mapEventToNameAndValue = <
  T extends Record<string, any>,
  K extends keyof T,
>(
  e: React.ChangeEvent<HTMLInputElement>,
): { name: K; value: T[K] } => {
  const { name, value } = e.target;
  return { name: name as K, value: value as T[K] };
};

export const handleOnClear = (
  name: string,
  setForm: (prev: (prevState: any) => any) => void,
) => {
  setForm((prev) => ({ ...prev, [name]: '' }));
};

export const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  // Selecciona automáticamente el contenido del input cuando se enfoca en él
  e.target.select();
};

/**
 * Extract YouTube video ID from different URL formats
 * Supports:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - Direct VIDEO_ID
 * @param url - YouTube URL or video ID
 * @returns Extracted video ID (11 characters) or the original input if no pattern matches
 */
export const extractYouTubeId = (url: string): string => {
  if (!url) return '';

  // Remove whitespace
  url = url.trim();

  // If it's already just an ID (no URL format), return it
  if (url.length === 11 && !url.includes('/') && !url.includes('=')) {
    return url;
  }

  // Pattern for youtube.com/watch?v=VIDEO_ID
  const standardPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  // Pattern for youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  // Pattern for youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;

  const standardMatch = url.match(standardPattern);
  if (standardMatch) return standardMatch[1];

  const shortMatch = url.match(shortPattern);
  if (shortMatch) return shortMatch[1];

  const embedMatch = url.match(embedPattern);
  if (embedMatch) return embedMatch[1];

  return url; // Return original if no pattern matches
};

/**
 * Check if a string is a valid YouTube video ID
 * @param id - String to validate
 * @returns true if it's a valid 11-character YouTube ID
 */
export const isValidYouTubeId = (id: string): boolean => {
  if (!id) return false;
  return id.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(id);
};

/**
 * YouTube thumbnail quality options
 */
export type YouTubeThumbnailQuality =
  | 'default' // 120x90
  | 'mqdefault' // 320x180 (medium quality)
  | 'hqdefault' // 480x360 (high quality)
  | 'sddefault' // 640x480 (standard definition)
  | 'maxresdefault'; // 1280x720 (maximum resolution)

/**
 * Get YouTube video thumbnail URL
 * @param videoId - YouTube video ID (11 characters)
 * @param quality - Thumbnail quality (default: 'mqdefault')
 * @returns YouTube thumbnail URL or empty string if videoId is invalid
 */
export const getYouTubeThumbnail = (
  videoId: string | null | undefined,
  quality: YouTubeThumbnailQuality = 'mqdefault',
): string => {
  if (!videoId || !isValidYouTubeId(videoId)) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};
