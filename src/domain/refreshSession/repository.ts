import type { RefreshSession } from "./entity.js"

export interface RefreshSessionRepository{
    create(tokenHash: string, userId: number,expiresIn: Date):Promise<RefreshSession>
    rotation(oldtokenHash: string, newtokenHash: string, newExpiresIn?: Date):Promise<RefreshSession | null>
    delete(tokenHash: string,):Promise<boolean>
    getByHash(tokenHash: string):Promise<RefreshSession | null>
}