import React, { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { logError } from '../../utils/logger';
import { AuthService } from '../../services/auth/authService';

type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType | '';
  password: string;
  confirmPassword: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const theme = useTheme();
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<{
    register?: string;
    login?: string;
  }>({});

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name as string]: value
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validaciones
      if (registerData.password !== registerData.confirmPassword) {
        setErrors({ ...errors, register: 'Las contraseñas no coinciden' });
        return;
      }
      
      // TODO: Implementar lógica de registro
      console.log('Datos de registro:', registerData);
      
      // Limpiar formulario y errores
      setRegisterData({
        name: '',
        email: '',
        phone: '',
        bloodType: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      logError(error as Error, { context: 'Login.handleRegisterSubmit' });
      setErrors({ ...errors, register: 'Error al registrarse. Inténtelo de nuevo.' });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implementar lógica de login
      const authService = AuthService.getInstance();
      await authService.login(loginData.email, loginData.password);
      
      // Redirigir a dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      logError(error as Error, { context: 'Login.handleLoginSubmit' });
      setErrors({ ...errors, login: 'Credenciales incorrectas' });
    }
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🩸 BloodConnect SOS
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Grid container spacing={4}>
          {/* Formulario de registro */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Registrarse como Donante
              </Typography>
              
              <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Número de teléfono"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                />
                
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Tipo de sangre</InputLabel>
                  <Select
                    name="bloodType"
                    value={registerData.bloodType}
                    onChange={handleRegisterChange}
                    label="Tipo de sangre"
                  >
                    <MenuItem value=""><em>Seleccione...</em></MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  margin="normal"
                  required
                  error={!!errors.register}
                  helperText={errors.register}
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registrarse
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Formulario de login */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Acceder
              </Typography>
              
              <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  margin="normal"
                  required
                  error={!!errors.login}
                  helperText={errors.login}
                />
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar sesión
                </Button>
                
                <Box textAlign="center" mt={2}>
                  <Link href="#" variant="body2">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 BloodConnect SOS | <Link href="/politica">Política de Privacidad</Link> | España 🇪🇸
          </Typography>
        </Container>
      </Box>
    </>
  );
}; 