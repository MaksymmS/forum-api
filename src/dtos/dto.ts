export interface PostDTO {
    title: string;
    content: string;
    categoryId?: number | null;
    author?: string;
}

export interface PostResponseDTO {
    id: string;
    title: string;
    content: string;
    categoryId: number | null;
}

