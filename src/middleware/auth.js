const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const decoded = jwt.verify(token, config.security.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Error de autenticación:', error);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware; 