import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.AUTH_SERVICE_PORT || 3001,
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 1521,
        service: process.env.DB_SERVICE || 'ORCLPDB',
        user: process.env.DB_USER || 'bloodconnect',
        password: process.env.DB_PASSWORD || 'bloodconnect123'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
}; 