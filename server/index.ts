import app from './app';
import configs from './configs';

const PORT = configs.ENV_VARIABLES.PORT;

const server = app.listen(PORT, (error) => {
    if(error) {
        console.log('App failed to start.');
    }
    else {
        console.log(`Server listening on ${PORT}`);
    }
});



/**
 * Graceful shutdown on process termination signals.
 */
const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down server.`);
    server.close(async () => {
        await configs.pgDBPoolUtitlities.endConnectionPool();
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));