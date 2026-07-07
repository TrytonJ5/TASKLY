import cors from 'cors';

// Origens permitidas: localhost em dev, domínio real em produção
const origensPermitidas = [
  'http://localhost:4200',  // Angular em desenvolvimento
  process.env['FRONTEND_URL'], // URL do frontend em produção (ex: https://taskly.vercel.app)
].filter(Boolean) as string[];

export const corsOptions = cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (ex: Postman, curl)
    if (!origin) return callback(null, true);

    if (origensPermitidas.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem bloqueada pelo CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
