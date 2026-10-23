import type { Request, Response } from 'express';
import type { ICategoryService } from '../domain/category/service.js';
import type { CategoryDTO } from '../domain/category/entity.js';
import { CategoryAlreadyExistsError } from '../domain/category/errors.js';

export interface ICategoryHandler {
  getAll(req: Request, res: Response): Promise<void>;
  getById(req: Request<{ id: string }>, res: Response): Promise<void>;
  create(req: Request<{}, {}, CategoryDTO>, res: Response): Promise<void>;
}

export function createCategoryHandler(categoryService: ICategoryService): ICategoryHandler {
  return {
    async getAll(req: Request, res: Response): Promise<void> {
      try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
      } catch (error) {
        console.error('Failed to get categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
          res.status(400).json({ message: 'Invalid category ID' });
          return;
        }

        const category = await categoryService.getCategoryById(id);
        if (!category) {
          res.status(404).json({ message: 'Category not found' });
          return;
        }

        res.status(200).json(category);
      } catch (error) {
        console.error('Failed to get category by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    async create(req: Request<{}, {}, CategoryDTO>, res: Response): Promise<void> {
      try {
        const { name } = req.body ?? {};
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
          res.status(422).json({ message: 'Category name is required' });
          return;
        }

        const category = await categoryService.createCategory({ name: name.trim() });
        res.status(201).json(category);
      } catch (error) {
        if (error instanceof CategoryAlreadyExistsError) {
          res.status(409).json({ message: error.message });
          return;
        }

        console.error('Failed to create category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}
