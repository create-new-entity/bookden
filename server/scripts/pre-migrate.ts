
import { Client } from 'pg';
import { isTestEnvironment } from '../configs';

const env = process.env.NODE_ENV || 'development';
const dbName = isTestEnvironment() ? 'bookden_test' : 'bookden_dev';

const config = {
    user: process.env.DB_ADMIN,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'local-postgres-database',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: 'postgres', // connect to default DB first
};

async function createDatabaseIfNotExists() {
    const client = new Client(config);
    try {
        await client.connect();

        await client.query(`CREATE DATABASE ${dbName};`);
        console.log(`Database "${dbName}" created successfully.`);
    } catch (err) {
        if(err instanceof Error) {
            if ('code' in err && err.code === '42P04') {
                console.log(`Database "${dbName}" already exists, skipping creation.`);
            } else {
                console.error('Error creating database:', err);
                process.exit(1);
            }
        }
    } finally {
        await client.end();
    }
}

// Execute immediately if run directly
(async () => {
    console.log(`NODE_ENV=${env}`);
    console.log(`Ensuring database "${dbName}" exists...`);
    await createDatabaseIfNotExists();
    console.log('Pre-migration step complete.');
})();
