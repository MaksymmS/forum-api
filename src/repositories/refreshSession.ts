import type { RefreshSessionRepository } from "../domain/refreshSession/repository.js";
import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.d.ts";

export function createRefreshSessionRepository(database: PostgresClient<Contract>): RefreshSessionRepository {
    return {
        async create(tokenHash, userId, expiresIn) {
            try {
                return await database.orm.public.RefreshSession.create({
                    tokenHash,
                    userId,
                    expiresIn,
                });
            } catch (error) {
                throw new Error("Session has not created", { cause: error });
            }
        },
        async rotation(oldtokenHash, newtokenHash, newExpiresIn) {
            return await database.orm.public.RefreshSession.where({ tokenHash: oldtokenHash }).update({
                tokenHash: newtokenHash,
                ...(newExpiresIn ? { expiresIn: newExpiresIn } : {}),
            });
        },
        async delete(tokenHash) {
            const deleted = await database.orm.public.RefreshSession.where({ tokenHash }).delete();
            return deleted !== null;
        },
        async getByHash(tokenHash) {
            return await database.orm.public.RefreshSession.where({ tokenHash }).first();
        },
    };
}
