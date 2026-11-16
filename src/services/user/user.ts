import type { UserRepository } from "../../domain/user/repository.js";
import type { RefreshSessionRepository } from "../../domain/refreshSession/repository.js";
import { InvalidCredentialsError, InvalidTokenError, UserAlreadyExistsError } from "../../domain/user/errors.js";
import type { PasswordHasher, TokenService, AuthService, UserService } from "./user.types.js";

const REFRESH_TOKEN_DURATION_HOURS = 24 * 7; 

export function createAuthService(
    userRepository: UserRepository,
    refreshSessionRepository: RefreshSessionRepository,
    passwordHasher: PasswordHasher,
    tokenService: TokenService
): AuthService {
    return {
        async register(input) {
            const email = input.email.trim().toLowerCase();
            const existingUser = await userRepository.getUserByEmail(email);
            if (existingUser) {
                throw new UserAlreadyExistsError();
            }

            const hashPassword = await passwordHasher.hashPassword(input.password);
            const newUser = await userRepository.createUser({ email, hashPassword });

            return { id: newUser.id, email: newUser.email };
        },

        async login(input) {
            const email = input.email.trim().toLowerCase();
            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                throw new InvalidCredentialsError();
            }

            const isPasswordValid = await passwordHasher.checkPassword(user.hashPassword, input.password);
            if (!isPasswordValid) {
                throw new InvalidCredentialsError();
            }

            const accessToken = tokenService.signAccessToken(user.id);
            const refreshToken = tokenService.signRefreshToken(user.id);

            const tokenHash = tokenService.hashRefreshToken(refreshToken);
            const expiresIn = new Date(Date.now() + REFRESH_TOKEN_DURATION_HOURS * 60 * 60 * 1000);
            await refreshSessionRepository.create(tokenHash, user.id, expiresIn);

            return { accessToken, refreshToken };
        },

        async refresh(refreshToken) {
            const userId = tokenService.verifyRefreshToken(refreshToken);
            const tokenHash = tokenService.hashRefreshToken(refreshToken);

            const session = await refreshSessionRepository.getByHash(tokenHash);
            if (!session) {
                throw new InvalidTokenError("Refresh token has been revoked or already used");
            }


            const now = new Date();
            if (session.expiresIn.getTime() <= now.getTime()) {
                await refreshSessionRepository.delete(tokenHash);
                throw new InvalidTokenError("Refresh token has expired");
            }

            const user = await userRepository.getUserById(userId);
            if (!user) {
                await refreshSessionRepository.delete(tokenHash);
                throw new InvalidCredentialsError();
            }

            const accessToken = tokenService.signAccessToken(user.id);
            const newRefreshToken = tokenService.signRefreshToken(user.id);
            const newTokenHash = tokenService.hashRefreshToken(newRefreshToken);
            const newExpiresIn = new Date(now.getTime() + REFRESH_TOKEN_DURATION_HOURS * 60 * 60 * 1000);

            const rotated = await refreshSessionRepository.rotation(tokenHash, newTokenHash, newExpiresIn);
            if (!rotated) {
                throw new InvalidTokenError("Refresh token has already been used");
            }

            return { accessToken, refreshToken: newRefreshToken };
        },

        async logout(refreshToken) {
            try {
                const tokenHash = tokenService.hashRefreshToken(refreshToken);
                await refreshSessionRepository.delete(tokenHash);
            } catch {
            }
        },

        async me(userId) {
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new InvalidCredentialsError();
            }
            return { id: user.id, email: user.email };
        },
    };
}

export const createUserService = createAuthService;
