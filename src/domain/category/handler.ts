import type { Request, Response } from 'express';
import { CategoryService } from './service.js';

export class CategoryHandler {
  constructor(private categoryService: CategoryService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const category = await this.categoryService.getCategoryById(id);
      res.json(category);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}