import type { CategoryDTO, CategoryResponseDTO } from './entity.js';

export interface ICategoryRepository {
  findAll(): Promise<CategoryResponseDTO[]>;
  findById(id: number): Promise<CategoryResponseDTO | null>;
  findByName(name: string): Promise<CategoryResponseDTO | null>;
  create(data: CategoryDTO): Promise<CategoryResponseDTO>;
}
