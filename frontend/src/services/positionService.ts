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

export const getAllPositions = async (): Promise<Position[]> => {
    try {
        console.log('Fetching all positions from:', `${API_URL}/positions`);
        const response = await axios.get<Position[]>(`${API_URL}/positions`);
        console.log('Response received:', response);
        return response.data;
    } catch (error: any) {
        console.error('Error in getAllPositions:', error);
        if (error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(`Server error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`);
        } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('No response received from server. Please check if the server is running.');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Error retrieving positions: Network configuration error');
        }
    }
};

export const getPositionById = async (id: number): Promise<Position> => {
    try {
        console.log(`Fetching position details for id: ${id}`);
        const response = await axios.get<Position>(`${API_URL}/positions/${id}`);
        console.log('Position details received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error in getPositionById for id ${id}:`, error);
        if (error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(`Server error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`);
        } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('No response received from server. Please check if the server is running.');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Error retrieving position details: Network configuration error');
        }
    }
};

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

export const getPositionCandidates = async (id: number): Promise<Candidate[]> => {
    try {
        console.log(`Fetching candidates for position id: ${id}`);
        const response = await axios.get<Candidate[]>(`${API_URL}/positions/${id}/candidates`);
        console.log('Candidates received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error in getPositionCandidates for position ${id}:`, error);
        if (error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(`Server error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`);
        } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('No response received from server. Please check if the server is running.');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Error retrieving position candidates: Network configuration error');
        }
    }
};

export const getPositionInterviewFlow = async (id: number): Promise<InterviewFlow> => {
    try {
        console.log(`Fetching interview flow for position id: ${id}`);
        const response = await axios.get<InterviewFlow>(`${API_URL}/positions/${id}/interviewflow`);
        console.log('Interview flow received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error(`Error in getPositionInterviewFlow for position ${id}:`, error);
        if (error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(`Server error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`);
        } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('No response received from server. Please check if the server is running.');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Error retrieving position interview flow: Network configuration error');
        }
    }
};
