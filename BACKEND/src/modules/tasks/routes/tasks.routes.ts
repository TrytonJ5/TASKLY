import { Router } from 'express';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware.js';
import {
  listar,
  dashboard,
  historico,
  criar,
  atualizar,
  remover,
} from '../controllers/tasks.controllers.js';

const router = Router();

// Todas as rotas de tarefas exigem autenticação
router.use(authMiddleware);

router.get('/dashboard', dashboard);       // contadores: pendentes, concluídas, atrasadas
router.get('/', listar);                   // listagem com filtros e busca
router.get('/:id/historico', historico);   // histórico de alterações de uma tarefa
router.post('/', criar);                   // criar nova tarefa
router.put('/:id', atualizar);             // editar tarefa existente
router.delete('/:id', remover);            // excluir tarefa

export default router;
