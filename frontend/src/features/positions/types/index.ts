export interface Position {
    id: number;
    title: string;
    description: string;
    status: string;
    positionName?: string;
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
    interviewFlow?: InterviewFlow;
}

export interface Candidate {
    id: number;
    applicationId: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
}

export interface InterviewStep {
    id: number;
    name: string;
    orderIndex: number;
    interviewFlowId: number;
    interviewTypeId: number;
}

export interface InterviewFlow {
    id: number;
    description: string;
    interviewSteps: InterviewStep[];
}

export interface KanbanColumn {
    id: number;
    title: string;
    candidates: Candidate[];
}
