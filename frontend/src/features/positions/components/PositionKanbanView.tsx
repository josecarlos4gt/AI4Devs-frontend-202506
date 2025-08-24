import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import styled from 'styled-components';
import { Position, Candidate, KanbanColumn as KanbanColumnType } from '../types';
import KanbanColumn from './KanbanColumn';
import { getPositionInterviewFlow, getPositionCandidates, updateCandidateStage } from '../api/positionApi';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  color: #333;
`;

const KanbanBoard = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 1rem;
  text-align: center;
  background: #ffebee;
  border-radius: 4px;
  margin: 1rem 0;
`;

const PositionKanbanView: React.FC = () => {
  console.log('PositionKanbanView rendering');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position | null>(null);
  const [columns, setColumns] = useState<KanbanColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('Current route params:', { id });

  useEffect(() => {
    const fetchData = async () => {
      console.log('Current ID:', id);
      if (!id) return;
      
      try {
        setLoading(true);
        const [positionData, candidates] = await Promise.all([
          getPositionInterviewFlow(id),
          getPositionCandidates(id)
        ]);

        setPosition(positionData);
        
        // Organize candidates into columns
        const columnData = positionData.interviewFlow.interviewSteps.map(step => ({
          id: step.id,
          title: step.name,
          candidates: candidates.filter(c => c.currentInterviewStep === step.name)
        }));
        
        setColumns(columnData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      
      if (!over) return;
      
      const candidateData = active.data.current as { columnId: number } & Candidate;
      const sourceColumnId = candidateData.columnId;
      const destinationColumnId = parseInt(over.id.toString().replace('column-', ''));
      
      if (!sourceColumnId || sourceColumnId === destinationColumnId) {
        console.log('Invalid drag operation:', { sourceColumnId, destinationColumnId });
        return;
      }

      console.log('Drag end:', {
        candidateId: candidateData.id,
        sourceColumnId,
        destinationColumnId,
        activeData: active.data.current
      });

      try {
        // Optimistic update
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          
          // Remove from source column
          const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumnId);
          if (sourceColumnIndex === -1) {
            console.error('Source column not found:', sourceColumnId);
            return prevColumns;
          }
          
          // Add to destination column
          const destinationColumnIndex = newColumns.findIndex(col => col.id === destinationColumnId);
          if (destinationColumnIndex === -1) {
            console.error('Destination column not found:', destinationColumnId);
            return prevColumns;
          }

          // Make sure the candidates array exists
          if (!newColumns[sourceColumnIndex].candidates) {
            newColumns[sourceColumnIndex].candidates = [];
          }
          if (!newColumns[destinationColumnIndex].candidates) {
            newColumns[destinationColumnIndex].candidates = [];
          }

          // Remove candidate from source
          newColumns[sourceColumnIndex].candidates = newColumns[sourceColumnIndex].candidates
            .filter(c => c.applicationId !== candidateData.applicationId);
          
          // Add candidate to destination
          newColumns[destinationColumnIndex].candidates.push({
            ...candidateData,
            currentInterviewStep: newColumns[destinationColumnIndex].title
          });
          
          return newColumns;
        });

        // Update in backend
        console.log('Updating backend with:', {
          candidateId: candidateData.id,
          currentInterviewStep: destinationColumnId,
          applicationId: candidateData.applicationId
        });
        
        await updateCandidateStage(
          candidateData.id,
          destinationColumnId,
          candidateData.applicationId
        );
      } catch (err) {
        console.error('Error in handleDragEnd:', err);
        setError('Failed to update candidate stage. Please try again.');
        // Re-fetch data to ensure UI is in sync with backend
        window.location.reload();
      }
    };  if (loading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/positions/list')}>&lt;</BackButton>
        <Title>{position?.positionName}</Title>
      </Header>
      
      <DndContext onDragEnd={handleDragEnd}>
        <KanbanBoard>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
            />
          ))}
        </KanbanBoard>
      </DndContext>
    </Container>
  );
};

export default PositionKanbanView;
