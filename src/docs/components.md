# Componentes de BloodConnect SOS

## Componentes Comunes

### StatCard

Componente reutilizable para mostrar estadísticas en tarjetas.

#### Props

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
| title | string | Título de la estadística | Sí |
| value | number \| string | Valor de la estadística | Sí |
| icon | React.ReactNode | Icono opcional | No |
| color | 'primary' \| 'secondary' \| 'error' \| 'info' \| 'success' | Color del valor | No |

#### Ejemplo de uso

```tsx
import { StatCard } from '../components/common/StatCard';

<StatCard
    title="Usuarios Totales"
    value={150}
    icon={<PeopleIcon />}
    color="primary"
/>
```

## Componentes de Dashboard

### AdminDashboard

Panel de administración principal que muestra estadísticas y gráficos.

#### Props

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
| user | User | Información del usuario administrador | Sí |

#### Características

- Muestra estadísticas en tiempo real
- Gráfico de distribución de tipos de sangre
- Actualización automática de datos
- Diseño responsivo

## Componentes de Autenticación

### LoginForm

Formulario de inicio de sesión con validación.

#### Props

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
| onLogin | (credentials: { email: string, password: string }) => void | Callback al iniciar sesión | Sí |
| error | string | Mensaje de error | No |

## Guías de Estilo

### Colores

- Primary: #d32f2f (Rojo sangre)
- Secondary: #1976d2 (Azul)
- Error: #f44336 (Rojo)
- Background: #f5f5f5 (Gris claro)

### Tipografía

- Familia: Roboto
- Tamaños:
  - h1: 2.5rem
  - h2: 2rem
  - h3: 1.75rem
  - h4: 1.5rem
  - h5: 1.25rem
  - h6: 1rem

### Espaciado

- Padding base: 16px
- Margen entre elementos: 24px
- Radio de borde: 8px 