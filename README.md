

### ** This repo is currently work in progress state. **
----------------------

It is a full stack application developed in:

1. React + React Query + TypeScript + Zod + Material UI
2. Node + Postgresql + Slonik + TypeScript + Zod + db-migrate ( migrations )
3. Containerzation ( Docker ) + Github Actions ( CI/CD )
4. Playwright


How to run e2e tests locally ( from root directory ):
1. npm run e2e
2. Once tests are done, run: npm run e2e:infra:down

How to run other tests locally ( from root directory ):
1. Run: npm run test:server
2. Run: npm run test:client
3. To run both server and client tests in one go, run: npm run test
4. Similarly lint command variants are: lint:server, lint:client and lint

     
