export interface Post {
  id: string;
  title: string;
  content: string;
  author?: string;
  categoryId?: number | null;
}