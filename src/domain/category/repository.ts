import type { CategoryDTO, CategoryResponseDTO } from './entity.js';

export interface CategoryRepository {
  findAll(): Promise<CategoryResponseDTO[]>;
  findById(id: number): Promise<CategoryResponseDTO | null>;
  findByName(name: string): Promise<CategoryResponseDTO | null>;
  create(data: CategoryDTO): Promise<CategoryResponseDTO>;
}
