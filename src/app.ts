import express from 'express';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './handlers/post.js';
import { createPostRouter } from './routers/post.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  const postRepository = createPostRepository();
  const postService = createPostService(postRepository);
  const postHandler = createPostHandler(postService);
  const postRouter = createPostRouter(postHandler);

  app.use('/posts', postRouter);

  return app;
}