import { Router } from 'express';
import usersRoutes from '../../../modules/users/routes/user.routes.js';

const router = Router();

// Cadastro e login ficam em /api/auth/*
router.use('/auth', usersRoutes);

// Próxima etapa: router.use('/tarefas', tasksRoutes);

export default router;
