import axios from 'axios';

const API_URL = 'http://localhost:3010';

export interface Position {
    id: number;
    title: string;
    description: string;
    status: string;
    location: string;
    applicationDeadline: string;
    isVisible: boolean;
    jobDescription: string;
    requirements?: string;
    responsibilities?: string;
    salaryMin?: number;
    salaryMax?: number;
    employmentType?: string;
    benefits?: string;
    companyDescription?: string;
    contactInfo?: string;
}

interface Candidate {
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
    id: number;
    applicationId: number;
}

interface InterviewFlow {
    positionName: string;
    interviewFlow: {
        id: number;
        description: string;
        interviewSteps: Array<{
            id: number;
            interviewFlowId: number;
            interviewTypeId: number;
            name: string;
            orderIndex: number;
        }>;
    };
}

export const getAllPositions = async (): Promise<Position[]> => {
    try {
        const response = await axios.get<Position[]>(`${API_URL}/positions`);
        return response.data;
    } catch (error) {
        throw new Error('Error retrieving positions');
    }
};

export const getPositionById = async (id: number): Promise<Position> => {
    try {
        const response = await axios.get<Position>(`${API_URL}/positions/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error retrieving position details');
    }
};

export const getPositionCandidates = async (id: number): Promise<Candidate[]> => {
    try {
        const response = await axios.get<Candidate[]>(`${API_URL}/positions/${id}/candidates`);
        return response.data;
    } catch (error) {
        throw new Error('Error retrieving position candidates');
    }
};

export const getPositionInterviewFlow = async (id: number): Promise<InterviewFlow> => {
    try {
        const response = await axios.get<InterviewFlow>(`${API_URL}/positions/${id}/interviewflow`);
        return response.data;
    } catch (error) {
        throw new Error('Error retrieving position interview flow');
    }
};
