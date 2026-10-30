import express from 'express';
import { db } from './prisma/db.js';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './handlers/post.js';
import { createPostRouter } from './routers/post.js';
import { createCategoryRepository } from './repositories/category.js';
import { createCategoryService } from './services/category.js';
import { createCategoryHandler } from './handlers/category.js';
import { createCategoryRouter } from './routers/category.js';
import { createUserRepository } from './repositories/user.js';
import { createUserService } from './services/user/user.js';
import { hashPassword, verify } from './domain/user/lib/password.js';
import { createUserHandler } from './handlers/user.js';
import { createUserRouter } from './routers/user.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  const postRepository = createPostRepository(db);
  const postService = createPostService(postRepository);
  const postHandler = createPostHandler(postService);
  const postRouter = createPostRouter(postHandler);

  const categoryRepository = createCategoryRepository(db);
  const categoryService = createCategoryService(categoryRepository);
  const categoryHandler = createCategoryHandler(categoryService);
  const categoryRouter = createCategoryRouter(categoryHandler);

  const userRepository = createUserRepository(db);
  const userService = createUserService(userRepository, {
    hashPassword,
    checkPassword: (hash, password) => verify(password, hash),
  });
  const userHandler = createUserHandler(userService);
  const userRouter = createUserRouter(userHandler);

  app.use('/posts', postRouter);
  app.use('/categories', categoryRouter);
  app.use('/', userRouter);

  return app;
}
