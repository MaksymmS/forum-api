import { CategoryRepository } from './repository.js';
import type { CategoryDTO, CategoryResponseDTO } from './entity.js';

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<CategoryResponseDTO[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<CategoryResponseDTO> {
    const categoryId = Number(id);
    if (!Number.isInteger(categoryId)) {
      const error: any = new Error('Invalid category ID');
      error.statusCode = 400;
      throw error;
    }

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      const error: any = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async createCategory(dto: CategoryDTO): Promise<CategoryResponseDTO> {
    if (!dto.name || typeof dto.name !== 'string') {
      const error: any = new Error('Invalid category name');
      error.statusCode = 422;
      throw error;
    }

    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) {
      const error: any = new Error('Category with this name already exists');
      error.statusCode = 409; 
      throw error;
    }

    return this.categoryRepository.create(dto);
  }
}