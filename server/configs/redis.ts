

import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis(): Promise<ReturnType<typeof createClient>> {
    if (redisClient) {
        return redisClient;
    }

    const client = createClient({
        url: process.env.REDIS_URL ?? 'redis://redis:6379',
    });

    client.on('error', (err) => {
        console.error('[Redis] Client error:', err);
    });

    try {
        await client.connect();
        redisClient = client;
        console.log('Redis Connected');
        return redisClient;
    } catch (err) {
        console.error('Redis Failed to connect');
        throw err;
    }
}

export function getRedis(): ReturnType<typeof createClient> {
    if (!redisClient) {
        throw new Error('Redis not initialized. Call initRedis() first.');
    }
    return redisClient;
}

export async function endRedis(): Promise<void> {
    if (redisClient) {
        await redisClient.quit();
        console.log('Redis Disconnected');
    }
}
