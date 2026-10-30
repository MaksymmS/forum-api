import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { UserRepository } from "../domain/user/repository.js";
import { UserAlreadyExistsError } from "../domain/user/errors.js";
import { isUniqueConstraintError } from "../lib/db-errors.js";
import type { Contract } from "../prisma/contract.js";

export function createUserRepository(db: PostgresClient<Contract>): UserRepository {
    return {
        async createUser(user) {
            try {
                return await db.orm.public.User.create(user);
            } catch (error) {
                if (isUniqueConstraintError(error)) {
                    throw new UserAlreadyExistsError();
                }
                throw error;
            }
        },
        async getUserByEmail(email) {
            return await db.orm.public.User.where({ email }).first();
        },
        async getUserById(id) {
            return await db.orm.public.User.where({ id }).first();
        },
        async saveRefreshToken(token) {
            return await db.orm.public.RefreshToken.create(token);
        },
        async findRefreshToken(tokenHash) {
            return await db.orm.public.RefreshToken.where({ tokenHash }).first();
        },
        async deleteRefreshToken(tokenHash) {
            const deleted = await db.orm.public.RefreshToken.where({ tokenHash }).deleteAndCount();
            return deleted > 0;
        },
    };
}
