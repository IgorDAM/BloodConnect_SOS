import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { DatabaseConnection } from './services/database/connection';
import authMiddleware from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/api/auth', require('./routes/auth'));

// Rutas protegidas
app.use('/api', authMiddleware);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/jefe', require('./routes/jefe'));
app.use('/api/operario', require('./routes/operario'));
app.use('/api/cliente', require('./routes/cliente'));

// Inicialización de la base de datos
DatabaseConnection.initialize()
    .then(() => {
        app.listen(port, () => {
            logger.info(`Servidor iniciado en puerto ${port}`);
        });
    })
    .catch((error) => {
        logger.error('Error iniciando la aplicación:', error);
        process.exit(1);
    }); 