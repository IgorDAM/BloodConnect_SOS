import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // límite de 5 intentos por ventana
    message: {
        error: 'Demasiados intentos de autenticación',
        message: 'Por favor, intente de nuevo más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
}); 