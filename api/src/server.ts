import express from 'express';

import connection from './infra/db/connect';
import router from './infra/routes/router';

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

  app.listen(8080, () => console.log('Listening on port 8080'));
}

startServer();
