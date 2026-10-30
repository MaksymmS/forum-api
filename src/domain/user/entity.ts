import type { Temporal } from "temporal-polyfill";

export interface User {
    id: number;
    email: string;
    hashPassword: string;
}

export type PublicUser = Omit<User, "hashPassword">;

export interface RefreshToken {
    id: string;
    tokenHash: string;
    userId: number;
    expiresAt: Temporal.Instant;
    createdAt: Temporal.Instant;
}
