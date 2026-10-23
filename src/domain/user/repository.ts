import type { User } from "./entity.js"

export type NewUser = Omit<User, "id">

export interface UserRepository {
    createUser(user: NewUser): Promise<User>
    getUserByEmail(email: string): Promise<User | null>
}