import type { Request, Response } from "express";
import { InvalidCredentialsError, InvalidTokenError, UserAlreadyExistsError } from "../domain/user/errors.js";
import type { UserInput, UserService } from "../services/user/user.types.js";
import { ACCESS_TOKEN_MAX_AGE_MS, REFRESH_TOKEN_MAX_AGE_MS } from "../lib/jwt.js";

export interface IUserHandler {
    register(req: Request<{}, {}, UserInput>, res: Response): Promise<void>;
    login(req: Request<{}, {}, UserInput>, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: ACCESS_TOKEN_MAX_AGE_MS,
        path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
        path: "/",
    });
}

function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
}

export function createUserHandler(userService: UserService): IUserHandler {
    return {
        async register(req, res): Promise<void> {
            const { email, password } = req.body ?? {};

            if (
                !email ||
                typeof email !== "string" ||
                !EMAIL_REGEX.test(email.trim()) ||
                !password ||
                typeof password !== "string" ||
                password.length < 8
            ) {
                res.status(422).json({ message: "A valid email and a password of at least 8 characters are required" });
                return;
            }

            try {
                const user = await userService.register({ email, password });
                res.status(201).json(user);
            } catch (error) {
                if (error instanceof UserAlreadyExistsError) {
                    res.status(409).json({ message: error.message });
                    return;
                }

                console.error("Failed to register user:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        },

        async login(req, res): Promise<void> {
            const { email, password } = req.body ?? {};

            if (
                !email ||
                typeof email !== "string" ||
                !EMAIL_REGEX.test(email.trim()) ||
                !password ||
                typeof password !== "string" ||
                password.length === 0
            ) {
                res.status(422).json({ message: "A valid email and password are required" });
                return;
            }

            try {
                const tokens = await userService.login({ email, password });
                setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
                res.status(200).json({ message: "OK" });
            } catch (error) {
                if (error instanceof InvalidCredentialsError) {
                    res.status(401).json({ message: error.message });
                    return;
                }

                console.error("Failed to log in user:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        },

        async refresh(req, res): Promise<void> {
            try {
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken || typeof refreshToken !== "string") {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const tokens = await userService.refresh(refreshToken);
                setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
                res.status(200).json({ message: "OK" });
            } catch (error) {
                if (error instanceof InvalidTokenError || error instanceof InvalidCredentialsError) {
                    clearAuthCookies(res);
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                console.error("Failed to refresh token:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        },

        async me(req, res): Promise<void> {
            try {
                const userId = res.locals.userId;
                if (typeof userId !== "number") {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const user = await userService.me(userId);
                res.status(200).json({ id: user.id, email: user.email });
            } catch (error) {
                if (error instanceof InvalidCredentialsError) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                console.error("Failed to get me:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        },
    };
}
