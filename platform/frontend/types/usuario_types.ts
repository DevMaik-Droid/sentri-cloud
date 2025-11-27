export interface JwtPayload {
    id: number | null
    nombre?: string 
    exp: number
}