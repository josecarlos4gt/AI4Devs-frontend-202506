import { Position, Candidate } from '../types';

const BASE_URL = 'http://localhost:3010';

export const getPositionInterviewFlow = async (id: string): Promise<Position> => {
  const response = await fetch(`${BASE_URL}/positions/${id}/interviewflow`);
  if (!response.ok) {
    throw new Error('Failed to fetch position interview flow');
  }
  return response.json();
};

export const getPositionCandidates = async (id: string): Promise<Candidate[]> => {
  const response = await fetch(`${BASE_URL}/positions/${id}/candidates`);
  if (!response.ok) {
    throw new Error('Failed to fetch position candidates');
  }
  return response.json();
};

export const updateCandidateStage = async (
  candidateId: number, 
  currentInterviewStep: number,
  applicationId: number,
): Promise<void> => {
  console.log('Updating candidate stage:', { candidateId, currentInterviewStep, applicationId });
  
  try {
    const response = await fetch(`${BASE_URL}/candidates/${candidateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        currentInterviewStep,
        applicationId
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server response:', errorData);
      throw new Error(errorData?.message || 'Failed to update candidate stage');
    }

    const result = await response.json();
    console.log('Update successful:', result);
  } catch (error) {
    console.error('Error in updateCandidateStage:', error);
    throw error;
  }
};
