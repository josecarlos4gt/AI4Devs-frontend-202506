import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { getPositionCandidates, getPositionInterviewFlow } from '../services/positionService';

interface Candidate {
    id: number;
    applicationId: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
}

interface InterviewStep {
    id: number;
    name: string;
    orderIndex: number;
}

interface Column {
    id: string;
    title: string;
    candidates: Candidate[];
}

const PositionKanbanView: React.FC = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [positionName, setPositionName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            try {
                console.log('Current ID:', id);
                const [candidatesData, interviewFlowData] = await Promise.all([
                    getPositionCandidates(Number(id)),
                    getPositionInterviewFlow(Number(id))
                ]);

                setPositionName(interviewFlowData.positionName);
                setCandidates(candidatesData);

                // Crear columnas basadas en los pasos de la entrevista
                const steps = interviewFlowData.interviewFlow.interviewSteps;
                const newColumns = steps.sort((a, b) => a.orderIndex - b.orderIndex).map(step => ({
                    id: String(step.id),
                    title: step.name,
                    candidates: candidatesData.filter(c => c.currentInterviewStep === step.name)
                }));

                setColumns(newColumns);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch position interview flow');
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) return;

        const candidateId = active.id;
        const newColumnId = over.id;

        // Actualizar el estado
        setColumns(prevColumns => {
            const candidateToMove = candidates.find(c => c.id === candidateId);
            if (!candidateToMove) return prevColumns;

            // Remover el candidato de su columna actual
            const updatedColumns = prevColumns.map(col => ({
                ...col,
                candidates: col.candidates.filter(c => c.id !== candidateId)
            }));

            // Agregar el candidato a la nueva columna
            return updatedColumns.map(col => {
                if (col.id === newColumnId) {
                    return {
                        ...col,
                        candidates: [...col.candidates, candidateToMove]
                    };
                }
                return col;
            });
        });

        // Aquí podrías agregar la llamada a la API para persistir el cambio
        // updateCandidateStatus(candidateId, newColumnId);
    };

    if (loading) return <Container className="mt-4"><Alert variant="info">Cargando...</Alert></Container>;
    if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Proceso de Selección - {positionName}</h2>
            <div className="d-flex gap-4" style={{ overflowX: 'auto' }}>
                {columns.map(column => (
                    <div 
                        key={column.id}
                        className="bg-light p-3 rounded"
                        style={{ minWidth: '300px' }}
                    >
                        <h5 className="mb-3">{column.title} ({column.candidates.length})</h5>
                        <div className="d-flex flex-column gap-2">
                            {column.candidates.map(candidate => (
                                <div
                                    key={candidate.id}
                                    className="bg-white p-3 rounded shadow-sm"
                                >
                                    <div className="fw-bold">{candidate.fullName}</div>
                                    <div className="small text-muted">
                                        Score: {candidate.averageScore.toFixed(1)}/5
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default PositionKanbanView;
