
import {
    createPool,
    ClientConfiguration,
    DatabasePool
} from 'slonik';

import { isProductionEnvironment, isTestEnvironment } from './config';
import { AppError, errorMessages, errorNames } from '../errors';


type PoolOptions = Pick<ClientConfiguration, 'maximumPoolSize' | 'connectionTimeout' | 'connectionRetryLimit'>;

const poolOptions: PoolOptions = {
    maximumPoolSize: 10,
    connectionTimeout: 5000,
    connectionRetryLimit: 5,
};

let pgDBPool: DatabasePool;
let isPoolActive = false;

const getDBUrl = (): string => {
    const {
        DB_ADMIN,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_URL,
        TEST_DB_URL
    } = process.env;

    if(isProductionEnvironment()) {
        return `postgresql://${DB_ADMIN}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    }
    else if(isTestEnvironment()) {
        if(TEST_DB_URL) {
            return TEST_DB_URL;
        }
        const internalServerError = new AppError(errorMessages[errorNames.envVarUndefined], 500, false);
        throw internalServerError; // TEST_DB_URL is not defined.
    }
    else {
        if(DB_URL) {
            return DB_URL; // development environment
        }
        const internalServerError = new AppError(errorMessages[errorNames.envVarUndefined], 500, false);
        throw internalServerError; // DB_URL is not defined.
    }
};

export const initPGDBPool = async (): Promise<DatabasePool> => {
    const DB_URL = getDBUrl();
    console.log(`NODE_ENV: ${process.env.NODE_ENV}\nDB Connection URL: ${DB_URL}`);
    pgDBPool = await createPool(DB_URL + '', poolOptions);
    console.log('PostgreSQL connection pool initialized.');
    isPoolActive = true;
    return pgDBPool;
};

export const getPGDBPool = async (): Promise<DatabasePool> => {
    if(isPoolActive && pgDBPool) {
        return pgDBPool;
    }
    return initPGDBPool();
};

export const endConnectionPool = async () => {
    if(isPoolActive && pgDBPool) {
        await pgDBPool.end();
        isPoolActive = false;
    }
};