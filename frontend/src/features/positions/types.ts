export interface InterviewStep {
  id: number;
  name: string;
}

export interface InterviewFlow {
  interviewSteps: InterviewStep[];
}

export interface Position {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface Candidate {
  id: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  applicationId: number;
  positionId: number;
}

export interface KanbanColumn {
  id: number;
  title: string;
  candidates: Candidate[];
}

export interface DragEndResult {
  source: {
    index: number;
    droppableId: string;
  };
  destination?: {
    index: number;
    droppableId: string;
  };
  draggableId: string;
}
