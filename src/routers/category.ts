import { Router } from 'express';
import type { ICategoryHandler } from '../handlers/category.js';

export function createCategoryRouter(categoryHandler: ICategoryHandler): Router {
  const router = Router();

  router.get('/', categoryHandler.getAll);
  router.get('/:id', categoryHandler.getById);
  router.post('/', categoryHandler.create);

  return router;
}
