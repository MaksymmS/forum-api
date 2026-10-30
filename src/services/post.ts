import type { PostRepository } from '../domain/post/repository.js';
import type { PostService } from '../domain/post/service.js';
import type { CategoryRepository } from '../domain/category/repository.js';
import { CategoryNotFoundError } from '../domain/category/errors.js';
import type { PostDTO, PostResponseDTO } from '../dtos/dto.js';

export function createPostService(
  postRepository: PostRepository,
  categoryRepository: CategoryRepository
): PostService {
  return {
    async getPosts(category?: string, take?: number): Promise<PostResponseDTO[]> {
      return postRepository.getAllPosts(category, take);
    },

    async getPostById(id: string): Promise<PostResponseDTO | null> {
      return postRepository.findPostById(id);
    },

    async createPost(postData: PostDTO): Promise<PostResponseDTO> {
      if (postData.categoryId !== undefined && postData.categoryId !== null) {
        const category = await categoryRepository.findById(postData.categoryId);
        if (!category) {
          throw new CategoryNotFoundError();
        }
      }

      return postRepository.createPost(postData);
    },
  };
}
