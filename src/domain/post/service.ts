import type { PostDTO, PostResponseDTO } from '../../dtos/dto.js';

export interface IPostService {
  getPosts(category?: string, take?: number): Promise<PostResponseDTO[]>;
  getPostById(id: string): Promise<PostResponseDTO | null>;
  createPost(postData: PostDTO): Promise<PostResponseDTO>;
}