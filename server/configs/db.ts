
import camelcaseKeys from 'camelcase-keys';
import {
    createPool,
    ClientConfiguration,
    DatabasePool,
    sql as slonikSql,
    ValueExpression
} from 'slonik';

type PoolOptions = Pick<ClientConfiguration, 'maximumPoolSize' | 'connectionTimeout' | 'connectionRetryLimit'>;

const poolOptions: PoolOptions = {
    maximumPoolSize: 10,
    connectionTimeout: 5000,
    connectionRetryLimit: 5,
};

let pgDBPool: DatabasePool | undefined;

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

const sqlFragment = slonikSql.fragment;

const initPGDBPool = async () => {
    try {
        console.log(`DB Connection URL: ${process.env.LOCAL_DB_URL}`);
        pgDBPool = await createPool(process.env.LOCAL_DB_URL + '', poolOptions);
        console.log('PostgreSQL connection pool initialized.');
    } catch (error) {
        console.error('Error initializing PostgreSQL connection pool:', error);
    }
};

initPGDBPool();

const pgDBPoolUtitlities = {
    getPGDBPool,
    endConnectionPool,
    sql,
    sqlFragment
};

export default pgDBPoolUtitlities;

