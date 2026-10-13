import { db } from '../../prisma/db.js';
import type { CategoryDTO, CategoryResponseDTO } from './entity.js';

export class CategoryRepository {
  async findAll(): Promise<CategoryResponseDTO[]> {
    const categories = await db.orm.public.Category.all();
    return categories as CategoryResponseDTO[];
  }

  async findById(id: number): Promise<CategoryResponseDTO | null> {
    return await db.orm.public.Category.where({ id }).first() as CategoryResponseDTO | null;
  }

  async findByName(name: string): Promise<CategoryResponseDTO | null> {
    return await db.orm.public.Category.where({ name }).first() as CategoryResponseDTO | null;
  }

  async create(data: CategoryDTO): Promise<CategoryResponseDTO> {
    return await db.orm.public.Category.create(data) as CategoryResponseDTO;
  }
}