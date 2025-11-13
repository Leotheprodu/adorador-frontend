import { atom } from 'nanostores';

interface FeedNavigationState {
  targetCommentId: number | null;
  targetPostId: number | null;
  isNavigating: boolean;
}

export const $feedNavigation = atom<FeedNavigationState>({
  targetCommentId: null,
  targetPostId: null,
  isNavigating: false,
});

// Funciones helper para manejar el store
export const setNavigationToComment = (postId: number, commentId: number) => {
  $feedNavigation.set({
    targetPostId: postId,
    targetCommentId: commentId,
    isNavigating: true,
  });
};

export const setNavigationToPost = (postId: number) => {
  $feedNavigation.set({
    targetPostId: postId,
    targetCommentId: null,
    isNavigating: true,
  });
};

export const clearFeedNavigation = () => {
  $feedNavigation.set({
    targetCommentId: null,
    targetPostId: null,
    isNavigating: false,
  });
};
