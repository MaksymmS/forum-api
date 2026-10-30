import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken || typeof accessToken !== "string") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    res.locals.userId = verifyAccessToken(accessToken);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
