import express from 'express';
import cookieParser from 'cookie-parser';
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
import { createRefreshSessionRepository } from './repositories/refreshSession.js';
import { createAuthService } from './services/user/user.js';
import { hashPassword, verify } from './domain/user/lib/password.js';
import { createUserHandler } from './handlers/user.js';
import { createUserRouter } from './routers/user.js';
import * as jwtLib from './lib/jwt.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json());
  app.use(cookieParser());

  const categoryRepository = createCategoryRepository(db);
  const categoryService = createCategoryService(categoryRepository);
  const categoryHandler = createCategoryHandler(categoryService);
  const categoryRouter = createCategoryRouter(categoryHandler);

  const postRepository = createPostRepository(db);
  const postService = createPostService(postRepository, categoryRepository);
  const postHandler = createPostHandler(postService);
  const postRouter = createPostRouter(postHandler);

  const userRepository = createUserRepository(db);
  const refreshSessionRepository = createRefreshSessionRepository(db);
  const authService = createAuthService(
    userRepository,
    refreshSessionRepository,
    {
      hashPassword,
      checkPassword: (hash, password) => verify(password, hash),
    },
    jwtLib
  );
  const userHandler = createUserHandler(authService);
  const userRouter = createUserRouter(userHandler);

  app.use('/posts', postRouter);
  app.use('/categories', categoryRouter);
  app.use('/auth', userRouter);
  app.use('/', userRouter);

  return app;
}
