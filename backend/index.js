import config from './src/config/env.js';
import app from './src/app.js';

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
