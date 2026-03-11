import type { Post, PostTranslation, Project, ProjectTranslation, Book, BookTranslation, Comment, Tag } from "@prisma/client";

export type PostWithTranslation = Post & {
  translations: PostTranslation[];
  tags: Tag[];
  _count?: { comments: number };
};

export type ProjectWithTranslation = Project & {
  translations: ProjectTranslation[];
  tags: Tag[];
};

export type BookWithTranslation = Book & {
  translations: BookTranslation[];
};

export type CommentWithReplies = Comment & {
  replies: Comment[];
  user: { name: string; image: string | null } | null;
  _count?: { reactions: number };
};

export type Locale = "es" | "en" | "pt";
