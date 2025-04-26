import React, { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { AuthService } from '../../services/auth/authService';
import { logError } from '../../utils/logger';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    user: User;
}

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    pendingRequests: number;
    donationsThisMonth: number;
    bloodTypes: {
        A: number;
        B: number;
        AB: number;
        O: number;
    };
}

export const AdminDashboard: React.FC<DashboardProps> = ({ user }) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        pendingRequests: 0,
        donationsThisMonth: 0,
        bloodTypes: {
            A: 0,
            B: 0,
            AB: 0,
            O: 0
        }
    });

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const mockStats: DashboardStats = {
                totalUsers: 150,
                activeUsers: 120,
                pendingRequests: 5,
                donationsThisMonth: 45,
                bloodTypes: {
                    A: 40,
                    B: 35,
                    AB: 15,
                    O: 60
                }
            };
            setStats(mockStats);
        } catch (error) {
            logError(error as Error, { context: 'AdminDashboard.loadDashboardStats' });
        }
    };

    const bloodTypeData = [
        { name: 'A', value: stats.bloodTypes.A },
        { name: 'B', value: stats.bloodTypes.B },
        { name: 'AB', value: stats.bloodTypes.AB },
        { name: 'O', value: stats.bloodTypes.O }
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Panel de Administración
            </Typography>
            
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Usuarios Totales
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Usuarios Activos
                            </Typography>
                            <Typography variant="h4">
                                {stats.activeUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Solicitudes Pendientes
                            </Typography>
                            <Typography variant="h4">
                                {stats.pendingRequests}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Donaciones Este Mes
                            </Typography>
                            <Typography variant="h4">
                                {stats.donationsThisMonth}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Distribución de Tipos de Sangre
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={bloodTypeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}; 