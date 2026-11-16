import type { User } from "./entity.js";

export interface UserRepository {
    createUser(user: Omit<User, "id">): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
}
