import { Router } from 'express';
import usersRoutes from '../../../modules/users/routes/user.routes.js';
import tasksRoutes from '../../../modules/tasks/routes/tasks.routes.js';

const router = Router();

router.use('/auth', usersRoutes);
router.use('/tarefas', tasksRoutes);

export default router;
