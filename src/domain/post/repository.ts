import type { PostDTO, PostResponseDTO } from '../../dtos/dto.js';

export interface IPostRepository {
  getAll(category?: string, take?: number): Promise<PostResponseDTO[]>;
  getById(id: string): Promise<PostResponseDTO | null>;
  addPost(postData: PostDTO): Promise<PostResponseDTO>;
}