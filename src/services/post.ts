import type { IPostRepository } from '../domain/post/repository.js';
import type { IPostService } from '../domain/post/service.js';
import type { PostDTO, PostResponseDTO } from '../dtos/dto.js';

export function createPostService(postRepository: IPostRepository): IPostService {
  return {
    async getPosts(category?: string, take?: number): Promise<PostResponseDTO[]> {
      return postRepository.getAllPosts(category, take);
    },

    async getPostById(id: string): Promise<PostResponseDTO | null> {
      return postRepository.findPostById(id);
    },

    async createPost(postData: PostDTO): Promise<PostResponseDTO> {
      return postRepository.createPost(postData);
    }
  };
}