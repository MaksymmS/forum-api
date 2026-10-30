import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import type { CategoryRepository } from '../domain/category/repository.js';
import type { CategoryDTO, CategoryResponseDTO } from '../domain/category/entity.js';
import { CategoryAlreadyExistsError } from '../domain/category/errors.js';
import { isUniqueConstraintError } from '../lib/db-errors.js';
import type { Contract } from '../prisma/contract.js';

export function createCategoryRepository(db: PostgresClient<Contract>): CategoryRepository {
  return {
    async findAll(): Promise<CategoryResponseDTO[]> {
      const categories = await db.orm.public.Category.all();
      return categories.map((cat) => ({ id: cat.id, name: cat.name }));
    },

    async findById(id: number): Promise<CategoryResponseDTO | null> {
      const category = await db.orm.public.Category.where({ id }).first();
      return category ? { id: category.id, name: category.name } : null;
    },

    async findByName(name: string): Promise<CategoryResponseDTO | null> {
      const category = await db.orm.public.Category.where({ name }).first();
      return category ? { id: category.id, name: category.name } : null;
    },

    async create(data: CategoryDTO): Promise<CategoryResponseDTO> {
      try {
        const category = await db.orm.public.Category.create({ name: data.name });
        return { id: category.id, name: category.name };
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          throw new CategoryAlreadyExistsError();
        }
        throw error;
      }
    },
  };
}
