import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'primary' }) => {
    return (
        <Card>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" color={color}>
                    {value}
                </Typography>
                {icon && (
                    <div style={{ position: 'absolute', right: 16, top: 16 }}>
                        {icon}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 