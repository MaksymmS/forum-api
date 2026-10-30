import type { Request, Response } from "express";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../domain/user/errors.js";
import type { UserInput, UserService } from "../services/user/user.types.js";

export interface IUserHandler {
    register(req: Request<{}, {}, UserInput>, res: Response): Promise<void>;
    login(req: Request<{}, {}, UserInput>, res: Response): Promise<void>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
                const id = await userService.login({ email, password });
                res.status(200).json({ id });
            } catch (error) {
                if (error instanceof InvalidCredentialsError) {
                    res.status(401).json({ message: error.message });
                    return;
                }

                console.error("Failed to log in user:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        },
    };
}
