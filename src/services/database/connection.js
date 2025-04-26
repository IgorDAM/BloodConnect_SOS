const oracledb = require('oracledb');
const logger = require('../../utils/logger');
require('dotenv').config();

class DatabaseConnection {
    static instance = null;
    #pool = null;

    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        DatabaseConnection.instance = this;
    }

    async initialize() {
        if (this.#pool) return;

        try {
            const dbConfig = {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectString: process.env.DB_CONNECTION_STRING,
                poolMin: parseInt(process.env.DB_POOL_MIN),
                poolMax: parseInt(process.env.DB_POOL_MAX),
                poolIncrement: parseInt(process.env.DB_POOL_INCREMENT)
            };

            this.#pool = await oracledb.createPool(dbConfig);
            logger.info('Pool de base de datos inicializado correctamente');
        } catch (error) {
            logger.error('Error al inicializar el pool de base de datos:', error);
            throw new Error('Falló la inicialización de la base de datos');
        }
    }

    async getConnection() {
        try {
            if (!this.#pool) await this.initialize();
            const connection = await this.#pool.getConnection();
            logger.debug('Nueva conexión de base de datos adquirida');
            return connection;
        } catch (error) {
            logger.error('Error al obtener conexión de base de datos:', error);
            throw new Error('Falló la conexión a la base de datos');
        }
    }

    async closePool() {
        try {
            if (this.#pool) {
                await this.#pool.close();
                this.#pool = null;
                logger.info('Pool de base de datos cerrado correctamente');
            }
        } catch (error) {
            logger.error('Error al cerrar el pool de base de datos:', error);
            throw error;
        }
    }
}

module.exports = new DatabaseConnection(); 