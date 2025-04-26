import { useState, useEffect, useContext, createContext } from 'react';
import { User } from '../types/user';
import { AuthService } from '../services/auth/authService';
import { logError } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        logError(error as Error, { context: 'useAuth.checkAuth' });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      logError(error as Error, { context: 'useAuth.login' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      logError(error as Error, { context: 'useAuth.logout' });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      // TODO: Implementar lógica de registro real
      // Por ahora, simulamos un registro básico
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: userData.email || '',
        name: userData.name || '',
        role: userData.role || 'donor',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        bloodType: userData.bloodType,
        rhFactor: userData.rhFactor,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      logError(error as Error, { context: 'useAuth.register' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 