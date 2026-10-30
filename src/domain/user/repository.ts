import type { User, RefreshToken } from "./entity.js";

export type NewUser = Omit<User, "id">;
export type NewRefreshToken = Omit<RefreshToken, "id" | "createdAt">;

export interface UserRepository {
    createUser(user: NewUser): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    saveRefreshToken(token: NewRefreshToken): Promise<RefreshToken>;
    findRefreshToken(tokenHash: string): Promise<RefreshToken | null>;
    deleteRefreshToken(tokenHash: string): Promise<boolean>;
}
