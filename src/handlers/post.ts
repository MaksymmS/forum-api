import type { Request, Response } from 'express';
import type { PostDTO } from '../dtos/dto.ts';
import * as PostService from '../services/post.js'
import type { IPostService } from '../domain/post/service.js';


export interface IPostHandler {
  getPosts(req: Request, res: Response): Promise<void>;
  getPostsById(req: Request<{ id: string }>, res: Response): Promise<void>;
  createPost(req: Request<{}, {}, PostDTO>, res: Response): Promise<void>;
}

export function createPostHandler(postService: IPostService): IPostHandler {
  return {
    async getPosts(req: Request, res: Response): Promise<void> {
      try {
        const category = req.query.category as string | undefined;
        const take = req.query.take ? Number(req.query.take) : undefined;
        const posts = await postService.getPosts(category, take);
        res.status(200).json(posts);
      } catch (error) {
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
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async createPost(req: Request<{}, {}, PostDTO>, res: Response): Promise<void> {
      try {
        const { title, content, author, category } = req.body;
        if (!title || !content) {
          res.status(422).json({ message: 'Title and content are required' })
          return;
        }
        const newPost = await postService.createPost({ title, content, author, category })
        res.status(201).json(newPost);
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }
}