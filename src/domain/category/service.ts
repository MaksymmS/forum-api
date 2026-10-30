import type { CategoryDTO, CategoryResponseDTO } from './entity.js';

export interface ICategoryService {
  getAllCategories(): Promise<CategoryResponseDTO[]>;
  getCategoryById(id: number): Promise<CategoryResponseDTO | null>;
  createCategory(dto: CategoryDTO): Promise<CategoryResponseDTO>;
}
