export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'donor' | 'hospital' | 'staff';
    isActive: boolean;
    createdAt: Date;
    lastLogin?: Date;
    bloodType?: 'A' | 'B' | 'AB' | 'O';
    rhFactor?: '+' | '-';
    lastDonation?: Date;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export enum UserRole {
    ADMIN = 'admin',
    JEFE = 'jefe',
    OPERARIO = 'operario',
    CLIENTE = 'cliente'
} 