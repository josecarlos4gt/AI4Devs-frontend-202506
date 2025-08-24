import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  columnId: number;
}

const Card = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  cursor: grab;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Name = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
`;

const ScoreContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const ScoreDot = styled.span`
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
`;

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, columnId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `candidate-${candidate.applicationId}`,
    data: {
      ...candidate,
      columnId
    },
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
  } : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
            <Name>{candidate.fullName}</Name>
      {candidate.averageScore > 0 && (
        <ScoreContainer>
          {[...Array(candidate.averageScore)].map((_, index) => (
            <ScoreDot key={index} />
          ))}
        </ScoreContainer>
      )}
    </Card>
  );
};

export default CandidateCard;
