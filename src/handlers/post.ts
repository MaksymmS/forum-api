import type { Request, Response } from 'express';
import type { PostDTO } from '../dtos/dto.js';
import type { PostService } from '../domain/post/service.js';
import { CategoryNotFoundError } from '../domain/category/errors.js';

export interface IPostHandler {
  getPosts(req: Request, res: Response): Promise<void>;
  getPostsById(req: Request<{ id: string }>, res: Response): Promise<void>;
  createPost(req: Request<{}, {}, PostDTO>, res: Response): Promise<void>;
}

export function createPostHandler(postService: PostService): IPostHandler {
  return {
    async getPosts(req: Request, res: Response): Promise<void> {
      try {
        const category = typeof req.query.category === 'string' ? req.query.category : undefined;
        const takeParam = req.query.take;
        let take: number | undefined;

        if (takeParam !== undefined) {
          if (typeof takeParam !== 'string' || !/^\d+$/.test(takeParam) || Number(takeParam) < 1) {
            res.status(422).json({ message: 'take must be a positive integer' });
            return;
          }
          take = Number(takeParam);
        }

        const posts = await postService.getPosts(category, take);
        res.status(200).json(posts);
      } catch (error) {
        console.error('Failed to get posts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async getPostsById(req: Request<{ id: string }>, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        const post = await postService.getPostById(id);
        if (!post) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }
        res.status(200).json(post);
      } catch (error) {
        console.error('Failed to get post by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async createPost(req: Request<{}, {}, PostDTO>, res: Response): Promise<void> {
      try {
        const { title, content, categoryId } = req.body ?? {};
        const trimmedTitle = typeof title === 'string' ? title.trim() : '';
        const trimmedContent = typeof content === 'string' ? content.trim() : '';

        if (!trimmedTitle || !trimmedContent) {
          res.status(422).json({ message: 'Title and content are required' });
          return;
        }
        if (
          categoryId !== undefined &&
          categoryId !== null &&
          (!Number.isInteger(categoryId) || categoryId <= 0)
        ) {
          res.status(422).json({ message: 'categoryId must be a positive integer' });
          return;
        }

        const userId = res.locals.userId;
        if (typeof userId !== 'number') {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }

        const payload: PostDTO = {
          title: trimmedTitle,
          content: trimmedContent,
          authorId: userId,
          categoryId: categoryId ?? null,
        };

        const newPost = await postService.createPost(payload);
        res.status(201).json(newPost);
      } catch (error) {
        if (error instanceof CategoryNotFoundError) {
          res.status(422).json({ message: error.message });
          return;
        }

        console.error('Failed to create post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}
