
import camelcaseKeys from 'camelcase-keys';
import {
    createPool,
    ClientConfiguration,
    DatabasePool,
    sql as slonikSql,
    ValueExpression
} from 'slonik';
import { isTestEnvironment } from './config';

type PoolOptions = Pick<ClientConfiguration, 'maximumPoolSize' | 'connectionTimeout' | 'connectionRetryLimit'>;

const poolOptions: PoolOptions = {
    maximumPoolSize: 10,
    connectionTimeout: 5000,
    connectionRetryLimit: 5,
};

let pgDBPool: DatabasePool | undefined;

const DB_URL = (() => {
    if (isTestEnvironment()) {
        return process.env.LOCAL_TEST_DB_URL;
    }
    return process.env.LOCAL_DB_URL;
})();

const getPGDBPool = () => {
    return pgDBPool;
};

const endConnectionPool = async () => {
    await pgDBPool?.end();
    pgDBPool = undefined;
};

const sql = async (template: TemplateStringsArray, ...values: ValueExpression[]) => {
    const result = await pgDBPool!.any(slonikSql.unsafe(template, ...values));
    return result.map((row) => camelcaseKeys(row, { deep: true }));
};

const sqlOne = async (template: TemplateStringsArray, ...values: ValueExpression[]) => {
    const result = await pgDBPool!.one(slonikSql.unsafe(template, ...values));
    return camelcaseKeys(result, { deep: true });
};

const sqlFragment = slonikSql.fragment;

const initPGDBPool = async () => {
    try {
        console.log(`NODE_ENV: ${process.env.NODE_ENV}\nDB Connection URL: ${DB_URL}`);
        pgDBPool = await createPool(DB_URL + '', poolOptions);
        console.log('PostgreSQL connection pool initialized.');
    } catch (error) {
        console.error('Error initializing PostgreSQL connection pool:', error);
    }
};

const queryVariants = {
    sql,
    sqlOne,
    sqlFragment
};

const pgDBPoolUtitlities = {
    getPGDBPool,
    endConnectionPool,
    queryVariants,
    initPGDBPool
};

export default pgDBPoolUtitlities;

