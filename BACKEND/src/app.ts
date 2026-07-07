import express, { Application } from 'express';
import { corsOptions } from './shared/infra/http/cors.js';
import routes from './shared/infra/http/routes.js';
import { errorMiddleware } from './shared/middlewares/error.middleware.js';

export function criarApp(): Application {
  const app = express();

  app.use(corsOptions);         // CORS configurado — substitui o cors() genérico
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', routes);

  app.use(errorMiddleware);

  return app;
}

