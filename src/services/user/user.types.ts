import type { PublicUser } from "../../domain/user/entity.js";


export interface UserInput{
    email: string;
    password: string;
}

export interface UserService{
    register(input: UserInput): Promise<PublicUser>;
    login(input: UserInput): Promise<string>;
}

export interface PasswordHasher {
    hashPassword(password: string): Promise<string>;
    checkPassword(hashPassword: string, password: string): Promise<boolean>;
}