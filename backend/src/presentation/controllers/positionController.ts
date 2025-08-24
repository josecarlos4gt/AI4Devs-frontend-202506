import { Request, Response } from 'express';
import { 
    getCandidatesByPositionService, 
    getInterviewFlowByPositionService,
    getAllPositionsService,
    getPositionByIdService,
    createPositionService,
    updatePositionService,
    deletePositionService
} from '../../application/services/positionService';
import { Position } from '../../domain/models/Position';

export const getAllPositions = async (_req: Request, res: Response) => {
    console.log('GET /positions - getAllPositions controller called');
    try {
        console.log('Getting positions from service...');
        const positions = await getAllPositionsService();
        console.log('Positions retrieved:', positions);
        res.status(200).json(positions);
    } catch (error) {
        console.error('Error in getAllPositions:', error);
        res.status(500).json({ 
            message: 'Error retrieving positions', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const getPositionById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const position = await getPositionByIdService(id);
        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.status(200).json(position);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving position', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const createPosition = async (req: Request, res: Response) => {
    try {
        const position = new Position(req.body);
        const newPosition = await createPositionService(position);
        res.status(201).json(newPosition);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating position', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const updatePosition = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const position = new Position({ ...req.body, id });
        const updatedPosition = await updatePositionService(position);
        if (!updatedPosition) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.status(200).json(updatedPosition);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating position', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const deletePosition = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await deletePositionService(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting position', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const getCandidatesByPosition = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        const candidates = await getCandidatesByPositionService(positionId);
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving candidates', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
};

export const getInterviewFlowByPosition = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        const interviewFlow = await getInterviewFlowByPositionService(positionId);
        res.status(200).json(interviewFlow);
    } catch (error) {
        if (error instanceof Error && error.message === 'Position not found') {
            res.status(404).json({ message: 'Position not found' });
        } else {
            res.status(500).json({ 
                message: 'Error retrieving interview flow', 
                error: error instanceof Error ? error.message : String(error) 
            });
        }
    }
};