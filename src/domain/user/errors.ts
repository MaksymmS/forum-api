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

export class InvalidTokenError extends Error {
    constructor(message: string = "Invalid or expired token") {
        super(message);
        this.name = "InvalidTokenError";
    }
}
