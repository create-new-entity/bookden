

import { execSync } from "child_process";

function sh(cmd: string) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

export default async function globalSetup() {

    // The name should match the name in the docker-compose.dev.yml file.
    const DB_CONTAINER_NAME = 'local-postgres-database';

    /*
        Check if database is ready using pg_isready.
        Try for 30 seconds. If not ready, exit with code 1.
     */
    const CHECK_IS_DB_READY = `bash -c "for i in {1..30}; do pg_isready -U admin && exit 0; sleep 1; done; exit 1"`
    
    sh(`docker exec -i ${DB_CONTAINER_NAME} ${CHECK_IS_DB_READY}`);

    const DROP_TEST_DB_IF_EXISTS = `psql -U admin -d postgres -c "DROP DATABASE IF EXISTS bookden_test;"`;
    // Drop existing test db. Migration will re run and populate with seed data from scratch.
    sh(`docker exec -i ${DB_CONTAINER_NAME} ${DROP_TEST_DB_IF_EXISTS}`);


    // Name should match the name in the docker-compose.dev.yml file.
    const SERVER_CONTAINER_NAME = 'bookden-dev-server';
    sh(`docker exec -i ${SERVER_CONTAINER_NAME} npm run migrate:up:test`);
    
    console.log('e2e global setup commands ran.');
}
