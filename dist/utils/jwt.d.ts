interface JwtPayload {
    id: string;
    email: string;
    fullName: string;
}
/**
 * Generate JWT token
 */
export declare const generateToken: (payload: JwtPayload) => string;
/**
 * Verify JWT token
 */
export declare const verifyToken: (token: string) => JwtPayload;
/**
 * Extract token from Authorization header
 */
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
export {};
//# sourceMappingURL=jwt.d.ts.map