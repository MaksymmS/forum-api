import { Router } from "express";
import type { IUserHandler } from "../handlers/user.js";
import { requireAuth } from "../middleware/requireAuth.js";

export function createUserRouter(userHandler: IUserHandler): Router {
    const router = Router();

    router.post("/register", userHandler.register);
    router.post("/login", userHandler.login);
    router.post("/refresh", userHandler.refresh);
    router.post("/auth/refresh", userHandler.refresh);
    router.post("/logout", userHandler.logout);
    router.post("/auth/logout", userHandler.logout);
    router.get("/me", requireAuth, userHandler.me);
    router.get("/auth/me", requireAuth, userHandler.me);

    return router;
}
