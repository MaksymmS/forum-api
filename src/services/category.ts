import type { CategoryRepository } from '../domain/category/repository.js';
import type { CategoryService } from '../domain/category/service.js';
import type { CategoryDTO, CategoryResponseDTO } from '../domain/category/entity.js';
import { CategoryAlreadyExistsError } from '../domain/category/errors.js';

export function createCategoryService(categoryRepository: CategoryRepository): CategoryService {
  return {
    async getAllCategories(): Promise<CategoryResponseDTO[]> {
      return categoryRepository.findAll();
    },

    async getCategoryById(id: number): Promise<CategoryResponseDTO | null> {
      return categoryRepository.findById(id);
    },

    async createCategory(dto: CategoryDTO): Promise<CategoryResponseDTO> {
      const existing = await categoryRepository.findByName(dto.name);
      if (existing) {
        throw new CategoryAlreadyExistsError();
      }

      return categoryRepository.create(dto);
    },
  };
}
