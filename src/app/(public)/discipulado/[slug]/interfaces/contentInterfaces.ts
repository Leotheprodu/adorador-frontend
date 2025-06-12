export interface ContentRendered {
  id: number;
  slug: string;
  category: string;
  title: string;
  authorId: number;
  date: string;
  image: string;
  content: ContentBlock[];
}

export type ContentBlock =
  | { type: 'paragraph'; title?: string; text: string }
  | { type: 'image'; title?: string; image: string }
  | { type: 'verse'; title: string; text: string }
  | { type: 'combined'; title?: string; text: string; image: string };
