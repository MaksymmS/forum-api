import { Router } from 'express';
import { CategoryHandler } from './handler.js';

export function createCategoryRouter(handler: CategoryHandler): Router {
  const router = Router();

  router.get('/', handler.getAll);
  router.get('/:id', handler.getById);
  router.post('/', handler.create);

  return router;
}