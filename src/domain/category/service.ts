import type { CategoryDTO, CategoryResponseDTO } from './entity.js';

export interface CategoryService {
  getAllCategories(): Promise<CategoryResponseDTO[]>;
  getCategoryById(id: number): Promise<CategoryResponseDTO | null>;
  createCategory(dto: CategoryDTO): Promise<CategoryResponseDTO>;
}

export type ICategoryService = CategoryService;
