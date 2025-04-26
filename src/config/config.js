require('dotenv').config();

module.exports = {
    database: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECTION_STRING,
        poolMin: parseInt(process.env.DB_POOL_MIN) || 2,
        poolMax: parseInt(process.env.DB_POOL_MAX) || 5,
        poolIncrement: parseInt(process.env.DB_POOL_INCREMENT) || 1
    },
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/app.log'
    },
    security: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiration: process.env.JWT_EXPIRATION || '1h',
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
    }
}; 