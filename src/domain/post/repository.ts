import type { PostDTO, PostResponseDTO } from '../../dtos/dto.js';

export interface IPostRepository {
  getAllPosts(category?: string, take?: number): Promise<PostResponseDTO[]>;
  findPostById(id: string): Promise<PostResponseDTO | null>;
  createPost(postData: PostDTO): Promise<PostResponseDTO>;
}