import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import { Person as PersonIcon, Notifications as NotificationsIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { User } from '../../types/user';
import { logError } from '../../utils/logger';

interface Donation {
  id: string;
  date: Date;
  hospital: string;
  city: string;
}

interface Alert {
  id: string;
  message: string;
  bloodType: string;
  hospital: string;
  city: string;
  urgent: boolean;
}

export const DonorDashboard: React.FC<{ user?: User }> = ({ user }) => {
  const theme = useTheme();
  const [isAvailable, setIsAvailable] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Cargar datos del donante
    loadDonorData();
  }, []);

  const loadDonorData = async () => {
    try {
      // TODO: Implementar llamada a API real
      // Datos de ejemplo
      setDonations([
        {
          id: '1',
          date: new Date('2025-03-12'),
          hospital: 'Hospital de La Paz',
          city: 'Madrid'
        },
        {
          id: '2',
          date: new Date('2025-01-08'),
          hospital: 'Hospital Vall d\'Hebron',
          city: 'Barcelona'
        }
      ]);

      setAlerts([
        {
          id: '1',
          message: 'Se necesita sangre O+ urgentemente',
          bloodType: 'O+',
          hospital: 'Hospital Clínico San Carlos',
          city: 'Madrid',
          urgent: true
        },
        {
          id: '2',
          message: 'Emergencia en Hospital Virgen del Rocío',
          bloodType: 'AB-',
          hospital: 'Hospital Virgen del Rocío',
          city: 'Sevilla',
          urgent: true
        }
      ]);
    } catch (error) {
      logError(error as Error, { context: 'DonorDashboard.loadDonorData' });
    }
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🩸 BloodConnect SOS
          </Typography>
          <IconButton color="inherit" aria-label="perfil">
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="notificaciones">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="salir">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Panel del Donante
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Estado de disponibilidad */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              borderRadius: 2
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Estado Actual
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h5" component="p" align="center">
                    {isAvailable ? 'Disponible ' : 'No Disponible '}
                    <Box component="span" 
                      sx={{ 
                        display: 'inline-block', 
                        width: 15, 
                        height: 15, 
                        borderRadius: '50%', 
                        bgcolor: isAvailable ? 'success.main' : 'error.main',
                        ml: 1
                      }} 
                    />
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color={isAvailable ? "error" : "success"} 
                  onClick={toggleAvailability}
                  fullWidth
                >
                  Cambiar Estado
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Historial de donaciones */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Historial de Donaciones
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' } }}>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Hospital</TableCell>
                        <TableCell>Ciudad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>{donation.date.toLocaleDateString()}</TableCell>
                          <TableCell>{donation.hospital}</TableCell>
                          <TableCell>{donation.city}</TableCell>
                        </TableRow>
                      ))}
                      {donations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">No hay donaciones registradas</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertas Activas */}
        <Card sx={{ mt: 4, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alertas Activas
            </Typography>
            <List>
              {alerts.map((alert) => (
                <ListItem key={alert.id} divider sx={{ 
                  bgcolor: alert.urgent ? 'error.lighter' : 'transparent',
                  borderRadius: 1,
                  mb: 1
                }}>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {alert.message}
                        <Chip 
                          label={alert.bloodType} 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    secondary={`${alert.hospital} (${alert.city})`}
                  />
                  <Button variant="contained" size="small">
                    Responder
                  </Button>
                </ListItem>
              ))}
              {alerts.length === 0 && (
                <ListItem>
                  <ListItemText primary="No hay alertas activas en este momento" />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 BloodConnect SOS | <Button sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }} color="inherit">Política de Privacidad</Button> | España 🇪🇸
          </Typography>
        </Container>
      </Box>
    </>
  );
}; 