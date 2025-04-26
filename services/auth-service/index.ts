import express from 'express';
import { config } from './config';
import { authRoutes } from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from '../utils/rateLimiter';

const app = express();

app.use(express.json());
app.use(rateLimiter);

app.use('/auth', authRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Auth service running on port ${config.port}`);
}); 