

### ** This repo is currently work in progress state. **
----------------------

It is a full stack application developed in:

1. React + React Query + TypeScript + Zod + Material UI
2. Node + Postgresql + Slonik + TypeScript + Zod + db-migrate ( migrations )
3. Containerzation ( Docker ) + Github Actions ( CI/CD )
4. Playwright


To run the e2e tests locally, do the followings in the root director:
    1. docker compose -f docker-compose.dev.yml -f docker-compose.e2e.yml up --build
    2. npm run e2e
     
