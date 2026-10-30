import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { UserRepository } from "../domain/user/repository.js";
import { isUniqueConstraintError, UserAlreadyExistsError } from "../domain/user/errors.js";
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
    };
}
