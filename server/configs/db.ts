
import {
    createPool,
    ClientConfiguration,
    DatabasePool
} from 'slonik';


type PoolOptions = Pick<ClientConfiguration, 'maximumPoolSize' | 'connectionTimeout' | 'connectionRetryLimit'>;

const poolOptions: PoolOptions = {
    maximumPoolSize: 10,
    connectionTimeout: 5000,
    connectionRetryLimit: 5
};

let pgDBPool: DatabasePool;
let isPoolActive = false;

const getDBUrl = (): string => {
    const {
        DB_ADMIN,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME
    } = process.env;
    
    return `postgresql://${DB_ADMIN}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
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