import type { PublicUser } from "../../domain/user/entity.js";

export interface UserInput {
    email: string;
    password: string;
}

export interface TokenService {
    signAccessToken(userId: number): string;
    signRefreshToken(userId: number): string;
    verifyAccessToken(token: string): number;
    verifyRefreshToken(token: string): number;
    hashRefreshToken(token: string): string;
    hashToken(token: string): string;
}

export interface AuthService {
    register(input: UserInput): Promise<PublicUser>;
    login(input: UserInput): Promise<{ accessToken: string; refreshToken: string }>;
    refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
    logout(refreshToken: string): Promise<void>;
    me(userId: number): Promise<{ id: number; email: string }>;
}

export type UserService = AuthService;

export interface PasswordHasher {
    hashPassword(password: string): Promise<string>;
    checkPassword(hashPassword: string, password: string): Promise<boolean>;
}
