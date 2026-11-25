import { createApp } from './app';
import { env } from './config/env';

const app = createApp({ corsOrigins: env.corsOrigins });

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
});
