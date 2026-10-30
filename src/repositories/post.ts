import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { PostRepository } from "../domain/post/repository.js";
import type { Contract } from "../prisma/contract.js";
import type { PostDTO, PostResponseDTO } from "../dtos/dto.js";

export function createPostRepository(db: PostgresClient<Contract>): PostRepository {
  function mapPost(post: {
    id: string;
    title: string;
    content: string;
    authorId?: number | null;
    categoryId?: number | null;
    createdAt?: unknown;
  }): PostResponseDTO {
    const res: PostResponseDTO = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId ?? null,
      categoryId: post.categoryId ?? null,
    };
    if (post.createdAt) {
      res.createdAt = String(post.createdAt);
    }
    return res;
  }

  async function getAllPosts(category?: string, take?: number): Promise<PostResponseDTO[]> {
    let resolvedCategoryId: number | null = null;

    if (category) {
      const parsedId = Number(category);
      if (Number.isInteger(parsedId)) {
        resolvedCategoryId = parsedId;
      } else {
        const cat = await db.orm.public.Category.where({ name: category }).first();
        if (!cat) {
          return [];
        }
        resolvedCategoryId = cat.id;
      }
    }

    const query = resolvedCategoryId !== null
      ? db.orm.public.Post.where({ categoryId: resolvedCategoryId })
      : db.orm.public.Post;

    const orderedQuery = query.orderBy((post) => post.createdAt.desc());

    const posts = take !== undefined ? await orderedQuery.limit(take).all() : await orderedQuery.all();
    return posts.map(mapPost);
  }

  async function createPost(postData: PostDTO): Promise<PostResponseDTO> {
    const post = await db.orm.public.Post.create({
      title: postData.title,
      content: postData.content,
      authorId: postData.authorId ?? null,
      categoryId: postData.categoryId ?? null,
    });
    return mapPost(post);
  }

  async function findPostById(id: string): Promise<PostResponseDTO | null> {
    const post = await db.orm.public.Post.where({ id }).first();
    return post ? mapPost(post) : null;
  }

  return { getAllPosts, createPost, findPostById };
}
