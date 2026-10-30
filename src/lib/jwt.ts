import "dotenv/config";
import crypto from "node:crypto";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { InvalidTokenError } from "../domain/user/errors.js";

const accessSecretValue = process.env.JWT_ACCESS_SECRET;
const refreshSecretValue = process.env.JWT_REFRESH_SECRET;

if (!accessSecretValue || accessSecretValue.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must be set and contain at least 32 characters");
}

if (!refreshSecretValue || refreshSecretValue.length < 32) {
  throw new Error("JWT_REFRESH_SECRET must be set and contain at least 32 characters");
}

if (accessSecretValue === refreshSecretValue) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different");
}

const accessSecret: Secret = accessSecretValue;
const refreshSecret: Secret = refreshSecretValue;

export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(userId: number): string {
  const options: SignOptions = {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  };
  return jwt.sign({}, accessSecret, options);
}

export function signRefreshToken(userId: number): string {
  const options: SignOptions = {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  };
  return jwt.sign({}, refreshSecret, options);
}

export function verifyAccessToken(token: string): number {
  try {
    const payload = jwt.verify(token, accessSecret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    if (!payload.sub) {
      throw new InvalidTokenError("Token subject is missing");
    }
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) {
      throw new InvalidTokenError("Invalid token subject");
    }
    return userId;
  } catch (error) {
    if (error instanceof InvalidTokenError) throw error;
    throw new InvalidTokenError(error instanceof Error ? error.message : "Invalid token");
  }
}

export function verifyRefreshToken(token: string): number {
  try {
    const payload = jwt.verify(token, refreshSecret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    if (!payload.sub) {
      throw new InvalidTokenError("Token subject is missing");
    }
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) {
      throw new InvalidTokenError("Invalid token subject");
    }
    return userId;
  } catch (error) {
    if (error instanceof InvalidTokenError) throw error;
    throw new InvalidTokenError(error instanceof Error ? error.message : "Invalid token");
  }
}
