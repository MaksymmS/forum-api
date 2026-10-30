export interface PostDTO {
  title: string;
  content: string;
  categoryId?: number | null;
  authorId?: number | null;
}

export interface PostResponseDTO {
  id: string;
  title: string;
  content: string;
  authorId: number | null;
  categoryId: number | null;
  createdAt?: string | undefined;
}
