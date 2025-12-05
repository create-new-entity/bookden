

### How to run locally
<ol>
    <li>To start, from root folder run: docker-compose -f docker-compose.dev.yml up --build</li>
    <li>To stop, from root folder run: docker-compose -f docker-compose.dev.yml down</li>
</ol>

### How to run e2e tests locally
<ol>
    <li>add server.env in env/e2e/server.env  . Follow the server.env.example to set some initial values.</li>
    <li>Run the command from the root of the project: docker compose -f docker-compose.dev.yml -f docker-compose.e2e.yml up -d --build --remove-orphans
    </li>
    <li>Run the command: npm run e2e </li>
    <li>Once done, clean up: docker compose -f docker-compose.dev.yml -f docker-compose.e2e.yml down --remove-orphans </li>
</ol>

### Deployment Guide
Deployment guide is [here](https://docs.google.com/document/d/1ZN868VBt_zZo9B5MfOksoQzUjQshc6yQfqguknNmye8/edit?usp=sharing).