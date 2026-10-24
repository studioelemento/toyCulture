import { createClient } from 'redis';

// Configure the Redis client (host/port can be customized via env vars if needed)
const client = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
});

client.on('error', (error) => console.error('Redis client error:', error));

/**
 * Proxy that ensures the client is connected before any method is invoked.
 * This allows existing code that imports the default client to keep working
 * without having to `await client.connect()` manually.
 */
const readyClient = new Proxy(client, {
  get(target, prop) {
    const value = target[prop];
    if (typeof value === 'function') {
      return async (...args) => {
        if (!target.isReady) {
          await target.connect();
        }
        return value.apply(target, args);
      };
    }
    return value;
  },
});

export default readyClient;
