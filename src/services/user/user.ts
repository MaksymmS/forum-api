import { Temporal } from "temporal-polyfill";
import type { UserRepository } from "../../domain/user/repository.js";
import { InvalidCredentialsError, InvalidTokenError, UserAlreadyExistsError } from "../../domain/user/errors.js";
import type { PasswordHasher, TokenService, UserService } from "./user.types.js";

const REFRESH_TOKEN_DURATION_HOURS = 24 * 7; // 7 days

export function createUserService(
    repository: UserRepository,
    passwordHasher: PasswordHasher,
    tokenService: TokenService
): UserService {
    return {
        async register(input) {
            const email = input.email.trim().toLowerCase();
            const existingUser = await repository.getUserByEmail(email);
            if (existingUser) {
                throw new UserAlreadyExistsError();
            }

            const hashPassword = await passwordHasher.hashPassword(input.password);
            const newUser = await repository.createUser({ email, hashPassword });

            return { id: newUser.id, email: newUser.email };
        },

        async login(input) {
            const email = input.email.trim().toLowerCase();
            const user = await repository.getUserByEmail(email);
            if (!user) {
                throw new InvalidCredentialsError();
            }

            const isPasswordValid = await passwordHasher.checkPassword(user.hashPassword, input.password);
            if (!isPasswordValid) {
                throw new InvalidCredentialsError();
            }

            const accessToken = tokenService.signAccessToken(user.id);
            const refreshToken = tokenService.signRefreshToken(user.id);

            const tokenHash = tokenService.hashToken(refreshToken);
            const expiresAt = Temporal.Now.instant().add({ hours: REFRESH_TOKEN_DURATION_HOURS });
            await repository.saveRefreshToken({ tokenHash, userId: user.id, expiresAt });

            return { accessToken, refreshToken };
        },

        async refresh(refreshToken) {
            const userId = tokenService.verifyRefreshToken(refreshToken);
            const tokenHash = tokenService.hashToken(refreshToken);

            const record = await repository.findRefreshToken(tokenHash);
            if (!record) {
                throw new InvalidTokenError("Refresh token has been revoked or is invalid");
            }

            // Check expiration against database record
            const now = Temporal.Now.instant();
            if (Temporal.Instant.compare(record.expiresAt, now) <= 0) {
                await repository.deleteRefreshToken(tokenHash);
                throw new InvalidTokenError("Refresh token has expired");
            }

            const user = await repository.getUserById(userId);
            if (!user) {
                await repository.deleteRefreshToken(tokenHash);
                throw new InvalidCredentialsError();
            }

            // Rotate token: only one request can consume the current token
            const deleted = await repository.deleteRefreshToken(tokenHash);
            if (!deleted) {
                throw new InvalidTokenError("Refresh token has already been used");
            }

            const accessToken = tokenService.signAccessToken(user.id);
            const newRefreshToken = tokenService.signRefreshToken(user.id);
            const newTokenHash = tokenService.hashToken(newRefreshToken);
            const newExpiresAt = now.add({ hours: REFRESH_TOKEN_DURATION_HOURS });

            await repository.saveRefreshToken({
                tokenHash: newTokenHash,
                userId: user.id,
                expiresAt: newExpiresAt,
            });

            return { accessToken, refreshToken: newRefreshToken };
        },

        async me(userId) {
            const user = await repository.getUserById(userId);
            if (!user) {
                throw new InvalidCredentialsError();
            }
            return { id: user.id, email: user.email };
        },
    };
}
