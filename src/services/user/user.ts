import type { UserRepository } from "../../domain/user/repository.js";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../../domain/user/errors.js";
import type { PasswordHasher, UserService } from "./user.types.js";


export function createUserService(repository: UserRepository, passwordHasher: PasswordHasher): UserService{
    return {
        async register(input){
            const email = input.email.trim().toLowerCase();
            const existingUser = await repository.getUserByEmail(email);
            if (existingUser) {
                throw new UserAlreadyExistsError();
            }

            const hashPassword = await passwordHasher.hashPassword(input.password);
            const newUser = await repository.createUser({ email, hashPassword });

            return {id: newUser.id, email: newUser.email}
        },
        async login(input){
            const email = input.email.trim().toLowerCase();
            const user = await repository.getUserByEmail(email);
            if(!user){
                throw new InvalidCredentialsError();
            }
            
            const isPasswordValid = await passwordHasher.checkPassword(user.hashPassword, input.password)
            
            if (!isPasswordValid) {
                throw new InvalidCredentialsError();
            }

            return user.id.toString();
        }
    }
}