# BloodConnect SOS 🩸

Sistema de gestión de donaciones de sangre en tiempo real

## 🚀 Características Principales
- Gestión de donaciones en tiempo real
- Sistema de geolocalización de hospitales
- Panel de administración
- Notificaciones de emergencias
- Seguimiento de donantes
- Autenticación segura con 2FA
- Rate limiting para protección contra ataques
- Sistema de logging centralizado

## 📋 Requisitos
- Node.js >= 14
- Oracle Database
- Docker
- Redis (para caché y rate limiting)

## 🛠️ Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/bloodconnect-sos.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Compilar TypeScript
npm run build

# Iniciar la aplicación
npm start
```

## 🏗️ Estructura del Proyecto
```
src/
├── components/     # Componentes de la interfaz
├── utils/         # Utilidades y helpers
├── services/      # Microservicios
│   ├── auth/      # Servicio de autenticación
│   ├── donor/     # Servicio de donantes
│   ├── hospital/  # Servicio de hospitales
│   └── api-gateway/ # Gateway principal
└── types/         # Definiciones de tipos
```

## 🔒 Seguridad
- Autenticación JWT
- Rate limiting
- Protección contra XSS
- Validación de datos
- Cifrado de contraseñas

## 📊 Monitoreo
- Logs centralizados
- Métricas de rendimiento
- Alertas de errores

## 🧪 Tests
```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests de integración
npm run test:integration

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🐳 Docker
```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up

# Detener servicios
docker-compose down
```

## 📝 Licencia
MIT

## 🤝 Contribución
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request