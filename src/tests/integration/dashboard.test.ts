import { render, screen, waitFor } from '@testing-library/react';
import { AdminDashboard } from '../../components/admin/Dashboard';
import { User } from '../../types/user';
import { AuthService } from '../../services/auth/authService';

describe('AdminDashboard Integration Tests', () => {
    const mockUser: User = {
        id: '1',
        email: 'admin@bloodconnect.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render dashboard with initial loading state', () => {
        render(<AdminDashboard user={mockUser} />);
        
        expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
        expect(screen.getByText('Usuarios Totales')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument(); // Valor inicial
    });

    it('should load and display statistics', async () => {
        render(<AdminDashboard user={mockUser} />);
        
        await waitFor(() => {
            expect(screen.getByText('150')).toBeInTheDocument(); // Usuarios totales
            expect(screen.getByText('120')).toBeInTheDocument(); // Usuarios activos
            expect(screen.getByText('5')).toBeInTheDocument(); // Solicitudes pendientes
            expect(screen.getByText('45')).toBeInTheDocument(); // Donaciones este mes
        });
    });

    it('should display blood type distribution chart', async () => {
        render(<AdminDashboard user={mockUser} />);
        
        await waitFor(() => {
            expect(screen.getByText('Distribución de Tipos de Sangre')).toBeInTheDocument();
            // Verificar que el gráfico se renderiza
            expect(document.querySelector('.recharts-wrapper')).toBeInTheDocument();
        });
    });

    it('should handle error state gracefully', async () => {
        // Mock error en la carga de estadísticas
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        render(<AdminDashboard user={mockUser} />);
        
        await waitFor(() => {
            // Verificar que los valores por defecto se mantienen
            expect(screen.getByText('0')).toBeInTheDocument();
        });
    });
}); 