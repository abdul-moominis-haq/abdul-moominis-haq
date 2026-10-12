import './loadEnv.js';
import app from './app.js';

const DEFAULT_PORT = Number(process.env.PORT) || 4000;
const MAX_TRIES = 10;

function startServer(port = DEFAULT_PORT, attemptsLeft = MAX_TRIES) {
  const server = app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use.`);
      if (attemptsLeft > 1) {
        const nextPort = port + 1;
        console.log(`Trying port ${nextPort} (${attemptsLeft - 1} attempts left)...`);
        setTimeout(() => startServer(nextPort, attemptsLeft - 1), 200);
      } else {
        console.error(`Unable to bind to a port after ${MAX_TRIES} attempts. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
}

startServer();
