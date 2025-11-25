import { Avatar, Button, Textarea } from '@nextui-org/react';
import { SendIcon } from '@global/icons';

interface CommentReplyFormProps {
    newComment: string;
    setNewComment: (value: string) => void;
    handleSubmit: () => void;
    handleKeyPress: (e: React.KeyboardEvent) => void;
    isSubmitting?: boolean;
    onCancel: () => void;
    onShareSong: () => void;
}

/**
 * Formulario para responder a un comentario
 */
export const CommentReplyForm = ({
    newComment,
    setNewComment,
    handleSubmit,
    handleKeyPress,
    isSubmitting,
    onCancel,
    onShareSong,
}: CommentReplyFormProps) => {
    return (
        <div className="mt-3 flex gap-3">
            <Avatar size="sm" name="You" className="flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe una respuesta..."
                    minRows={1}
                    maxRows={4}
                    size="sm"
                    variant="bordered"
                    autoFocus
                />
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button size="sm" variant="light" onPress={onCancel}>
                            Cancelar respuesta
                        </Button>
                        <Button
                            size="sm"
                            variant="light"
                            color="success"
                            onPress={onShareSong}
                            isDisabled={isSubmitting}
                        >
                            🎵 Compartir Canción
                        </Button>
                    </div>
                    <Button
                        size="sm"
                        color="primary"
                        onPress={handleSubmit}
                        isDisabled={!newComment.trim()}
                        isLoading={isSubmitting}
                        startContent={!isSubmitting && <SendIcon className="h-4 w-4" />}
                    >
                        Responder
                    </Button>
                </div>
            </div>
        </div>
    );
};
