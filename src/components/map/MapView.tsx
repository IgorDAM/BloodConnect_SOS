import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logError } from '../../utils/logger';
import { useTheme } from '@mui/material/styles';

// Solucionar problema de iconos en Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Hospital {
  id: string;
  name: string;
  location: [number, number]; // [lat, lng]
  address: string;
  city: string;
  emergency: boolean;
  bloodTypesNeeded: string[];
}

interface MapViewProps {
  initialPosition?: [number, number];
  zoom?: number;
}

const UserLocationMarker: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker 
      position={position}
      icon={new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}
    >
      <Popup>Tú estás aquí</Popup>
    </Marker>
  );
};

export const MapView: React.FC<MapViewProps> = ({ 
  initialPosition = [40.4168, -3.7038], // Madrid por defecto
  zoom = 13 
}) => {
  const theme = useTheme();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    loadHospitals();
    getCurrentLocation();
  }, []);

  const loadHospitals = async () => {
    try {
      // TODO: Implementar llamada a API real
      // Datos de ejemplo
      setHospitals([
        {
          id: '1',
          name: 'Hospital Universitario La Paz',
          location: [40.4817, -3.6865],
          address: 'Paseo de la Castellana, 261',
          city: 'Madrid',
          emergency: true,
          bloodTypesNeeded: ['O+', 'A-']
        },
        {
          id: '2',
          name: 'Hospital Clínico San Carlos',
          location: [40.4409, -3.7173],
          address: 'Calle del Prof Martín Lagos, s/n',
          city: 'Madrid',
          emergency: false,
          bloodTypesNeeded: []
        },
        {
          id: '3',
          name: 'Hospital Universitario 12 de Octubre',
          location: [40.3751, -3.6987],
          address: 'Av. de Córdoba, s/n',
          city: 'Madrid',
          emergency: true,
          bloodTypesNeeded: ['AB-']
        }
      ]);
    } catch (error) {
      logError(error as Error, { context: 'MapView.loadHospitals' });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          logError(new Error(`Error getting location: ${error.message}`), { context: 'MapView.getCurrentLocation' });
        }
      );
    }
  };

  const findClosestHospital = () => {
    if (!userLocation) {
      alert('Necesitamos tu ubicación para encontrar el hospital más cercano');
      getCurrentLocation();
      return;
    }

    // Implementar lógica para encontrar el hospital más cercano
    // ...
    alert('Función en desarrollo: encontrando el hospital más cercano...');
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="volver" 
            sx={{ mr: 2 }}
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🩸 BloodConnect SOS - Mapa
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Mapa de Emergencias
        </Typography>
        <Typography variant="body1" paragraph align="center">
          Ubicaciones de emergencias y hospitales disponibles en tiempo real.
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            height: '70vh', 
            width: '100%', 
            overflow: 'hidden',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <MapContainer 
            center={initialPosition} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <UserLocationMarker />
            
            {hospitals.map(hospital => (
              <Marker 
                key={hospital.id} 
                position={hospital.location}
                icon={new L.Icon({
                  iconUrl: hospital.emergency 
                    ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                    : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <div>
                    <h3>{hospital.name}</h3>
                    <p>{hospital.address}</p>
                    <p>{hospital.city}</p>
                    {hospital.emergency && (
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        ¡EMERGENCIA! Se necesitan tipos: {hospital.bloodTypesNeeded.join(', ')}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={findClosestHospital}
            size="large"
          >
            Buscar Hospital Cercano
          </Button>
        </Box>
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