import configs from './configs';
import app from './app';
import { endConnectionPool, initPGDBPool } from './configs/db';

const PORT = configs.ENV_VARIABLES.PORT;

const start = async () => {
    await initPGDBPool();
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
            await endConnectionPool();
            process.exit(0);
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start();