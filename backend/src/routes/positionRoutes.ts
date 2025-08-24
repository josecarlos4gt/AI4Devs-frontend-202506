import { 
    getCandidatesByPosition, 
    getInterviewFlowByPosition,
    getAllPositions,
    getPositionById,
    createPosition,
    updatePosition,
    deletePosition
} from '../presentation/controllers/positionController';

const router = require('express').Router();

// Rutas para el CRUD básico de posiciones
router.get('/', getAllPositions);
router.get('/:id', getPositionById);
router.post('/', createPosition);
router.put('/:id', updatePosition);
router.delete('/:id', deletePosition);

// Rutas específicas para candidatos y flujo de entrevistas
router.get('/:id/candidates', getCandidatesByPosition);
router.get('/:id/interviewflow', getInterviewFlowByPosition);

export default router;
