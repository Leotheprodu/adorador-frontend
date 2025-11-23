'use client';

import { useState } from 'react';
import { Avatar, Button } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import { Comment as FeedComment } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { BlessingButton } from './BlessingButton';
import { SharedSongInComment } from './SharedSongInComment';
import { CommentReplyForm } from './CommentReplyForm';
import { toggleCommentBlessingService } from '../_services/feedService';

interface CommentItemProps {
    comment: FeedComment;
    postId: number;
    onReply: (commentId: number | null) => void;
    replyingTo: number | null;
    newComment: string;
    setNewComment: (value: string) => void;
    handleSubmit: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    isSubmitting?: boolean;
    onShareSongInReply: () => void;
    onViewSong?: (songId: number, bandId: number) => void;
    onCopySong?: (songId: number, key?: string, tempo?: number) => void;
    handleCopySongFromComment: (
        songId: number,
        title: string,
        key?: string | null,
        tempo?: number | null,
        commentId?: number,
    ) => void;
}

/**
 * Componente para mostrar un comentario individual con sus respuestas
 */
export const CommentItem = ({
    comment,
    postId,
    onReply,
    replyingTo,
    newComment,
    setNewComment,
    handleSubmit,
    handleKeyPress,
    isSubmitting,
    onShareSongInReply,
    onViewSong,
    onCopySong,
    handleCopySongFromComment,
}: CommentItemProps) => {
    const queryClient = useQueryClient();
    const [blessingCommentId, setBlessingCommentId] = useState<number | null>(
        null,
    );

    const toggleBlessing = toggleCommentBlessingService({
        commentId: blessingCommentId || 0,
    });

    const isBlessed = comment.userBlessing && comment.userBlessing.length > 0;

    const handleToggleBlessing = () => {
        setBlessingCommentId(comment.id);
        toggleBlessing.mutate(null, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['comments', postId.toString()],
                });
                queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
                setBlessingCommentId(null);
            },
        });
    };

    return (
        <div className="flex gap-3" id={`comment-${comment.id}`}>
            <Avatar
                size="sm"
                name={comment.author.name}
                className="mt-1 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
                <div className="rounded-lg bg-content2 p-3 dark:bg-content3">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author.name}</span>
                        <span className="text-xs text-foreground-500">
                            {formatRelativeTime(comment.createdAt)}
                        </span>
                    </div>

                    {/* Contenido del comentario */}
                    {comment.content && <p className="mb-2 text-sm">{comment.content}</p>}

                    {/* Canción compartida en el comentario */}
                    <SharedSongInComment
                        comment={comment}
                        onViewSong={onViewSong}
                        onCopySong={handleCopySongFromComment}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <BlessingButton
                        size="sm"
                        isBlessed={isBlessed || false}
                        count={comment._count?.blessings || 0}
                        onPress={handleToggleBlessing}
                        isLoading={
                            toggleBlessing.isPending && blessingCommentId === comment.id
                        }
                    />

                    <Button
                        size="sm"
                        variant="light"
                        onPress={() => onReply(comment.id)}
                        className={replyingTo === comment.id ? 'text-primary' : ''}
                    >
                        Responder
                    </Button>
                </div>

                {/* Formulario de respuesta */}
                {replyingTo === comment.id && (
                    <CommentReplyForm
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleSubmit={handleSubmit}
                        handleKeyPress={handleKeyPress}
                        isSubmitting={isSubmitting}
                        onCancel={() => {
                            onReply(null);
                            setNewComment('');
                        }}
                        onShareSong={onShareSongInReply}
                    />
                )}

                {/* Respuestas anidadas */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2 border-l-2 border-divider pl-4">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                onReply={onReply}
                                replyingTo={replyingTo}
                                newComment={newComment}
                                setNewComment={setNewComment}
                                handleSubmit={handleSubmit}
                                handleKeyPress={handleKeyPress}
                                isSubmitting={isSubmitting}
                                onShareSongInReply={onShareSongInReply}
                                onViewSong={onViewSong}
                                onCopySong={onCopySong}
                                handleCopySongFromComment={handleCopySongFromComment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
