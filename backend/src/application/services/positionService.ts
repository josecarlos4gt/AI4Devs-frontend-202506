import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

const calculateAverageScore = (interviews: any[]) => {
    if (interviews.length === 0) return 0;
    const totalScore = interviews.reduce((acc, interview) => acc + (interview.score || 0), 0);
    return totalScore / interviews.length;
};

export const getAllPositionsService = async () => {
    try {
        console.log('getAllPositionsService - Starting database query');
        const positions = await prisma.position.findMany({
            include: {
                interviewFlow: true,
                applications: {
                    include: {
                        candidate: true,
                        interviews: true,
                        interviewStep: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });
        console.log('getAllPositionsService - Query completed, found', positions.length, 'positions');
        return positions;
    } catch (error) {
        console.error('Error getting all positions:', error);
        throw new Error(`Error retrieving positions: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const getPositionByIdService = async (id: number) => {
    try {
        return await prisma.position.findUnique({
            where: { id },
            include: {
                interviewFlow: true,
                applications: {
                    include: {
                        candidate: true,
                        interviews: true,
                        interviewStep: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error getting position by id:', error);
        throw new Error('Error retrieving position');
    }
};

export const createPositionService = async (position: Position) => {
    try {
        const data = {
            companyId: position.companyId,
            interviewFlowId: position.interviewFlowId,
            title: position.title,
            description: position.description,
            status: position.status,
            isVisible: position.isVisible,
            location: position.location,
            jobDescription: position.jobDescription,
            requirements: position.requirements,
            responsibilities: position.responsibilities,
            salaryMin: position.salaryMin,
            salaryMax: position.salaryMax,
            employmentType: position.employmentType,
            benefits: position.benefits,
            companyDescription: position.companyDescription,
            applicationDeadline: position.applicationDeadline,
            contactInfo: position.contactInfo
        };

        return await prisma.position.create({ data });
    } catch (error) {
        console.error('Error creating position:', error);
        throw new Error('Error creating position');
    }
};

export const updatePositionService = async (position: Position) => {
    try {
        if (!position.id) {
            throw new Error('Position ID is required for update');
        }

        const data = {
            companyId: position.companyId,
            interviewFlowId: position.interviewFlowId,
            title: position.title,
            description: position.description,
            status: position.status,
            isVisible: position.isVisible,
            location: position.location,
            jobDescription: position.jobDescription,
            requirements: position.requirements,
            responsibilities: position.responsibilities,
            salaryMin: position.salaryMin,
            salaryMax: position.salaryMax,
            employmentType: position.employmentType,
            benefits: position.benefits,
            companyDescription: position.companyDescription,
            applicationDeadline: position.applicationDeadline,
            contactInfo: position.contactInfo
        };

        return await prisma.position.update({
            where: { id: position.id },
            data
        });
    } catch (error) {
        console.error('Error updating position:', error);
        throw new Error('Error updating position');
    }
};

export const deletePositionService = async (id: number) => {
    try {
        await prisma.position.delete({
            where: { id }
        });
    } catch (error) {
        console.error('Error deleting position:', error);
        throw new Error('Error deleting position');
    }
};

export const getCandidatesByPositionService = async (positionId: number) => {
    try {
        const applications = await prisma.application.findMany({
            where: { positionId },
            include: {
                candidate: true,
                interviews: true,
                interviewStep: true
            }
        });

        return applications.map(app => ({
            fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
            currentInterviewStep: app.interviewStep.name,
            averageScore: calculateAverageScore(app.interviews),
            id: app.candidate.id,
            applicationId: app.id,
            positionId: app.positionId
        }));
    } catch (error) {
        console.error('Error retrieving candidates by position:', error);
        throw new Error('Error retrieving candidates by position');
    }
};

export const getInterviewFlowByPositionService = async (positionId: number) => {
    try {
        const positionWithInterviewFlow = await prisma.position.findUnique({
            where: { id: positionId },
            include: {
                interviewFlow: {
                    include: {
                        interviewSteps: true
                    }
                }
            }
        });

        if (!positionWithInterviewFlow) {
            throw new Error('Position not found');
        }

        return {
            positionName: positionWithInterviewFlow.title,
            interviewFlow: {
                id: positionWithInterviewFlow.interviewFlow.id,
                description: positionWithInterviewFlow.interviewFlow.description,
                interviewSteps: positionWithInterviewFlow.interviewFlow.interviewSteps.map(step => ({
                    id: step.id,
                    interviewFlowId: step.interviewFlowId,
                    interviewTypeId: step.interviewTypeId,
                    name: step.name,
                    orderIndex: step.orderIndex
                }))
            }
        };
    } catch (error) {
        console.error('Error retrieving interview flow:', error);
        throw new Error('Error retrieving interview flow');
    }
};
