import * as PostRepository from '../repositories/post.js';
import type { PostDTO, PostResponseDTO } from '../dtos/dto.js';

export async function getPosts(category?: string, take?: number): Promise<PostResponseDTO[]> {
    return PostRepository.getAll(category, take);
}

export async function getPostById(id: string): Promise<PostResponseDTO | undefined> {
    return PostRepository.getById(id);
}

export async function createPost(postData: PostDTO): Promise<PostResponseDTO> {
    return PostRepository.addPost(postData);
}