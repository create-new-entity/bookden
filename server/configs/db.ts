
import {
    createPool,
    ClientConfiguration,
    DatabasePool
} from 'slonik';
import { isTestEnvironment } from './config';

const DB_URL = (() => {
    if (isTestEnvironment()) {
        return process.env.LOCAL_TEST_DB_URL;
    }
    return process.env.LOCAL_DB_URL;
})();

type PoolOptions = Pick<ClientConfiguration, 'maximumPoolSize' | 'connectionTimeout' | 'connectionRetryLimit'>;

const poolOptions: PoolOptions = {
    maximumPoolSize: 10,
    connectionTimeout: 5000,
    connectionRetryLimit: 5,
};

let pgDBPool: DatabasePool;
let isPoolActive = false;

export const initPGDBPool = async (): Promise<DatabasePool> => {
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