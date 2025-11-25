'use client';

import { Card, CardBody } from '@nextui-org/react';
import { CreatePostDto, PostType } from '../_interfaces/feedInterface';
import { useCreatePostForm } from '../_hooks/useCreatePostForm';
import { useBandSongsWebSocket } from '@global/hooks/useBandSongsWebSocket';
import { CreatePostCollapsedView } from './CreatePostCollapsedView';
import { CreatePostExpandedForm } from './CreatePostExpandedForm';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';

interface CreatePostInlineProps {
  onSubmit: (data: CreatePostDto) => void;
  isLoading?: boolean;
  userBands: Array<{ id: number; name: string }>;
  bandSongs?: Array<{ id: number; title: string; artist: string | null }>;
  selectedBandId?: number;
  onBandChange?: (bandId: number) => void;
}

export const CreatePostInline = ({
  onSubmit,
  isLoading,
  userBands,
  bandSongs = [],
  selectedBandId,
  onBandChange,
}: CreatePostInlineProps) => {
  const user = useStore($user);

  const {
    textareaRef,
    isExpanded,
    postType,
    bandId,
    content,
    sharedSongId,
    requestedSongTitle,
    requestedSongArtist,
    requestedYoutubeUrl,
    setPostType,
    setSharedSongId,
    setRequestedSongTitle,
    setRequestedSongArtist,
    handleExpand,
    handleCollapse,
    handleSubmit,
    handleYouTubeChange,
    handleBandChange,
    handleContentChange,
    isValid,
    getSelectedBandName,
    getSelectedSongInfo,
  } = useCreatePostForm({
    onSubmit,
    isLoading,
    userBands,
    bandSongs,
    selectedBandId,
    onBandChange,
  });

  // Conectar al WebSocket para actualizaciones en tiempo real de canciones
  useBandSongsWebSocket({
    bandId: selectedBandId,
    enabled: isExpanded && !!selectedBandId,
  });

  const handleExpandWithType = (type: PostType) => {
    setPostType(type);
    handleExpand();
  };

  return (
    <Card className="w-full border border-divider bg-gradient-to-br from-white to-gray-50/50 shadow-md dark:from-default-100 dark:to-default-50">
      <CardBody className="p-0">
        {!isExpanded ? (
          <CreatePostCollapsedView
            userName={user?.name || 'Usuario'}
            onExpand={handleExpand}
            onExpandWithType={handleExpandWithType}
          />
        ) : (
          <CreatePostExpandedForm
            userName={user?.name || 'Usuario'}
            postType={postType}
            bandId={bandId}
            content={content}
            sharedSongId={sharedSongId}
            requestedSongTitle={requestedSongTitle}
            requestedSongArtist={requestedSongArtist}
            requestedYoutubeUrl={requestedYoutubeUrl}
            userBands={userBands}
            bandSongs={bandSongs}
            selectedBandName={getSelectedBandName()}
            selectedSongInfo={getSelectedSongInfo() || null}
            isValid={isValid()}
            isLoading={isLoading}
            textareaRef={textareaRef}
            onPostTypeChange={setPostType}
            onBandChange={handleBandChange}
            onContentChange={handleContentChange}
            onSongChange={setSharedSongId}
            onTitleChange={setRequestedSongTitle}
            onArtistChange={setRequestedSongArtist}
            onYoutubeChange={handleYouTubeChange}
            onYoutubeClear={() => handleYouTubeChange('')}
            onSubmit={handleSubmit}
            onCancel={handleCollapse}
          />
        )}
      </CardBody>
    </Card>
  );
};
