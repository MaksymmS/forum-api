export function isUniqueConstraintError(error: unknown): boolean {
    if (typeof error !== "object" || error === null || !("code" in error)) {
        return false;
    }

    const code = error.code;
    return code === "23505" || code === "P2002";
}
