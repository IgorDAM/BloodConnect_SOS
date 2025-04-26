import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';

export const NotFound: React.FC = () => {
  return (
    <MainLayout title="Página no encontrada">
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '4rem', md: '6rem' } }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            size="large"
          >
            Volver al inicio
          </Button>
        </Box>
        <Box
          component="img"
          src="/assets/illustrations/404.svg"
          alt="Página no encontrada"
          sx={{
            mt: 6,
            maxWidth: '100%',
            height: 'auto',
            maxHeight: 400,
            opacity: 0.8
          }}
        />
      </Container>
    </MainLayout>
  );
}; 