import { Router } from "express";
import type { IUserHandler } from "../handlers/user.js";

export function createUserRouter(userHandler: IUserHandler): Router {
    const router = Router();

    router.post("/register", userHandler.register);
    router.post("/login", userHandler.login);

    return router;
}