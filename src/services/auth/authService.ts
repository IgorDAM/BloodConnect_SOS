import jwt from 'jsonwebtoken';
import { User } from '../../types/user';
import config from '../../config/config';
import logger from '../../utils/logger';
import { logError } from '../../utils/logger';

export class AuthService {
    private static instance: AuthService;
    private currentUser: User | null = null;

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async login(email: string, password: string): Promise<User> {
        try {
            // TODO: Implementar llamada real a la API
            const mockUser: User = {
                id: '1',
                email,
                name: 'Admin User',
                role: 'admin',
                isActive: true,
                createdAt: new Date(),
                lastLogin: new Date()
            };
            this.currentUser = mockUser;
            return mockUser;
        } catch (error) {
            logError(error as Error, { context: 'AuthService.login' });
            throw error;
        }
    }

    public async logout(): Promise<void> {
        this.currentUser = null;
    }

    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    public isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    static generateToken(user: User): string {
        try {
            return jwt.sign(
                { id: user.id, role: user.role },
                config.security.jwtSecret,
                { expiresIn: config.security.jwtExpiration }
            );
        } catch (error) {
            logger.error('Error generando token:', error);
            throw new Error('Error de autenticación');
        }
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, config.security.jwtSecret);
        } catch (error) {
            logger.error('Error verificando token:', error);
            throw new Error('Token inválido');
        }
    }
} 