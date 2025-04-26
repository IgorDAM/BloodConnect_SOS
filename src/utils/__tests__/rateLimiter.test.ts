import { rateLimiter } from '../rateLimiter';
import { Request, Response, NextFunction } from 'express';

describe('Rate Limiter', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            ip: '127.0.0.1'
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    it('should allow requests within limit', () => {
        rateLimiter(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });

    it('should block requests exceeding limit', () => {
        // Simular múltiples solicitudes
        for (let i = 0; i < 6; i++) {
            rateLimiter(mockRequest as Request, mockResponse as Response, nextFunction);
        }
        
        expect(mockResponse.status).toHaveBeenCalledWith(429);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Demasiadas solicitudes',
            message: 'Por favor, intente de nuevo más tarde'
        });
    });
}); 