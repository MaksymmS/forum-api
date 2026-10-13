import express from 'express';
import { db } from './prisma/db.js';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './handlers/post.js';
import { createPostRouter } from './routers/post.js';
import { CategoryHandler } from './domain/category/handler.js';
import { CategoryService } from './domain/category/service.js';
import { CategoryRepository } from './domain/category/repository.js';
import { createCategoryRouter } from './domain/category/router.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  const postRepository = createPostRepository(db);
  const postService = createPostService(postRepository);
  const postHandler = createPostHandler(postService);
  const postRouter = createPostRouter(postHandler);
  const categoryRepo = new CategoryRepository();
  const categoryService = new CategoryService(categoryRepo);
  const categoryHandler = new CategoryHandler(categoryService);

  app.use('/posts', postRouter);
  app.use('/categories', createCategoryRouter(categoryHandler));

  return app;
}