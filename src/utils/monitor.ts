import { logInfo, logError } from './logger';
import os from 'os';

export class SystemMonitor {
    private static instance: SystemMonitor;
    private metrics: {
        cpu: number;
        memory: number;
        uptime: number;
    };

    private constructor() {
        this.metrics = {
            cpu: 0,
            memory: 0,
            uptime: 0
        };
        this.startMonitoring();
    }

    public static getInstance(): SystemMonitor {
        if (!SystemMonitor.instance) {
            SystemMonitor.instance = new SystemMonitor();
        }
        return SystemMonitor.instance;
    }

    private startMonitoring() {
        setInterval(() => {
            this.updateMetrics();
            this.logMetrics();
        }, 60000); // Actualizar cada minuto
    }

    private updateMetrics() {
        try {
            this.metrics = {
                cpu: os.loadavg()[0],
                memory: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
                uptime: os.uptime()
            };
        } catch (error) {
            logError(error as Error, { context: 'SystemMonitor.updateMetrics' });
        }
    }

    private logMetrics() {
        logInfo('System Metrics', {
            cpu: `${this.metrics.cpu.toFixed(2)}%`,
            memory: `${this.metrics.memory.toFixed(2)}%`,
            uptime: `${(this.metrics.uptime / 3600).toFixed(2)} hours`
        });
    }

    public getMetrics() {
        return this.metrics;
    }
}

export const monitor = SystemMonitor.getInstance(); 