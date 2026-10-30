export class UserAlreadyExistsError extends Error {
    constructor() {
        super("A user with this email already exists");
        this.name = "UserAlreadyExistsError";
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid email or password");
        this.name = "InvalidCredentialsError";
    }
}

export function isUniqueConstraintError(error: unknown): boolean {
    if (typeof error !== "object" || error === null || !("code" in error)) {
        return false;
    }

    const code = error.code;
    return code === "23505" || code === "P2002";
}