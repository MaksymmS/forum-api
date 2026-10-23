import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import type { ICategoryRepository } from '../domain/category/repository.js';
import type { CategoryDTO, CategoryResponseDTO } from '../domain/category/entity.js';
import type { Contract } from '../prisma/contract.js';

export function createCategoryRepository(db: PostgresClient<Contract>): ICategoryRepository {
  return {
    async findAll(): Promise<CategoryResponseDTO[]> {
      const categories = await db.orm.public.Category.all();
      return categories as CategoryResponseDTO[];
    },

    async findById(id: number): Promise<CategoryResponseDTO | null> {
      return (await db.orm.public.Category.where({ id }).first()) as CategoryResponseDTO | null;
    },

    async findByName(name: string): Promise<CategoryResponseDTO | null> {
      return (await db.orm.public.Category.where({ name }).first()) as CategoryResponseDTO | null;
    },

    async create(data: CategoryDTO): Promise<CategoryResponseDTO> {
      return (await db.orm.public.Category.create(data)) as CategoryResponseDTO;
    },
  };
}
