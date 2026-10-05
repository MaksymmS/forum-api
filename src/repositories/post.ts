import type { IPostRepository } from "../domain/post/repository.js";
import type { PostDTO, PostResponseDTO } from "../dtos/dto.js";

type Database = typeof import("../prisma/db.js").db;

export function createPostRepository(db: Database): IPostRepository {
  async function getAllPosts(category?: string, take?: number): Promise<PostResponseDTO[]> {
    const query = db.orm.public.Post.orderBy((post) => {
      return post.createdAt.desc();
    });

    const mapPost = (post: unknown): PostResponseDTO => post as PostResponseDTO;

    if (!take) {
      const posts = await query.all();
      return posts.map(mapPost);
    }

    const posts = await query.limit(take).all();
    return posts.map(mapPost);
  }

  async function createPost(postData: PostDTO): Promise<PostResponseDTO> {
    return db.orm.public.Post.create(postData) as unknown as Promise<PostResponseDTO>;
  }

  async function findPostById(id: string): Promise<PostResponseDTO | null> {
    return db.orm.public.Post.where({ id }).first() as Promise<PostResponseDTO | null>;
  }

  return { getAllPosts, createPost, findPostById };
}