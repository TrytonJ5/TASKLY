import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import routes from './shared/infra/http/routes.js';
import { errorMiddleware } from './shared/middlewares/error.middleware.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Conecta o hub central de rotas: tudo que estiver em routes.ts
// (incluindo /auth/registrar e /auth/login) fica acessível em /api/...
app.use('/api', routes);

// Sempre por último: captura erros do Zod, ApiError e erros inesperados
app.use(errorMiddleware);

export default app;