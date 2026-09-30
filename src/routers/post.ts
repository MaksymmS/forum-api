import { Router } from 'express';
import type { IPostHandler } from '../handlers/post.js';

export function createPostRouter(postHandler: IPostHandler): Router {
  const router = Router();

  router.get('/', postHandler.getPosts);
  router.get('/:id', postHandler.getPostsById);
  router.post('/', postHandler.createPost);

  return router;
}
