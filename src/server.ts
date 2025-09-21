import express from 'express';
import dotenv from 'dotenv';

import connection from './infra/db/connect';
import router from './infra/routes/router';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

function createServer() {
  const app = express();

  app.use(express.json());

  connection();

  const routes = router();
  app.use('/api', routes);

  return app;
}

function startServer() {
  const app = createServer();

  const port = Number(process.env.PORT) || 8080;

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
