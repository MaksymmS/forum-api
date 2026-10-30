import { Router } from "express";
import type { IUserHandler } from "../handlers/user.js";
import { requireAuth } from "../middleware/requireAuth.js";

export function createUserRouter(userHandler: IUserHandler): Router {
    const router = Router();

    router.post("/register", userHandler.register);
    router.post("/login", userHandler.login);
    router.post("/auth/refresh", userHandler.refresh);
    router.get("/auth/me", requireAuth, userHandler.me);

    return router;
}
