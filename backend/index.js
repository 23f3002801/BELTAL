import config from './src/config/env.js';
import app from './src/app.js';

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

// Keep the HTTP listener referenced so the Node process remains alive in
// development (and can continue serving the frontend API requests).
server.ref();
