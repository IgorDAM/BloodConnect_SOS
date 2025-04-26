import React, { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../styles/theme';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'BloodConnect SOS',
  showBackButton = false,
  onBack
}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const auth = useAuth();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logout();
    handleClose();
  };

  const drawerItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Panel', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Mapa', icon: <MapIcon />, path: '/mapa' },
    { text: 'Mi Perfil', icon: <PersonIcon />, path: '/perfil' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/configuracion' },
    { text: 'Acerca de', icon: <InfoIcon />, path: '/acerca-de' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            {auth.isAuthenticated && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🩸 {title}
            </Typography>
            
            {auth.isAuthenticated ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="notifications"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <NotificationsIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="user account"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={menuOpen}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} component={Link} to="/perfil">Mi Perfil</MenuItem>
                  <MenuItem onClick={handleClose} component={Link} to="/configuracion">Configuración</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Acceder
              </Button>
            )}
          </Toolbar>
        </AppBar>
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h6">BloodConnect SOS</Typography>
              {auth.user && (
                <Typography variant="body2">{auth.user.name}</Typography>
              )}
            </Box>
            <List>
              {drawerItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  component={Link}
                  to={item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
              <Divider />
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            </List>
          </Box>
        </Drawer>
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © 2025 BloodConnect SOS | <Button component={Link} to="/politica-privacidad" sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }} color="inherit">Política de Privacidad</Button> | España 🇪🇸
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}; 