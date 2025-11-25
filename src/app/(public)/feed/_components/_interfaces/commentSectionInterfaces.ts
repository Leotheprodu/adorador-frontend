import { Comment, CreateCommentDto, Post } from '../../_interfaces/feedInterface';

export interface CommentSectionProps {
    comments: Comment[];
    onSubmitComment: (data: CreateCommentDto) => void;
    isLoadingComments: boolean;
    isSubmitting?: boolean;
    post?: Post;
    onViewSong?: (songId: number, bandId: number, commentId?: number) => void;
    onCopySong?: (
        postId: number,
        songId: number,
        bandId: number,
        commentId: number,
        title: string,
        key?: string | null,
        tempo?: number | null,
    ) => void;
}

export interface CommentItemProps {
    comment: Comment;
    onReply: (commentId: number) => void;
    onViewSong?: (songId: number, bandId: number, commentId?: number) => void;
    onCopySong?: (
        postId: number,
        songId: number,
        bandId: number,
        commentId: number,
        title: string,
        key?: string | null,
        tempo?: number | null,
    ) => void;
    postId?: number;
    isReply?: boolean;
    isRequest?: boolean;
    replyingTo: number | null;
    newComment: string;
    setNewComment: (value: string) => void;
    onSubmitReply: () => void;
    onCancelReply: () => void;
    isSubmitting?: boolean;
}
