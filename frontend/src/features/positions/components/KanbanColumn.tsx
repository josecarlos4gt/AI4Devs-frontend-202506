import React from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { KanbanColumn as KanbanColumnType, Candidate } from '../types';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
}

const Column = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  min-width: 300px;
  height: fit-content;
  margin: 0.5rem;

  @media (max-width: 768px) {
    min-width: 100%;
    margin: 0.5rem 0;
  }
`;

const ColumnHeader = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const ColumnContent = styled.div`
  min-height: 100px;
`;

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { setNodeRef } = useDroppable({
    id: `column-${column.id}`,
    data: {
      columnId: column.id
    }
  });

  return (
    <Column>
      <ColumnHeader>{column.title}</ColumnHeader>
      <ColumnContent ref={setNodeRef}>
        {column.candidates.map((candidate: Candidate) => (
          <CandidateCard
            key={candidate.applicationId}
            candidate={candidate}
            columnId={column.id}
          />
        ))}
      </ColumnContent>
    </Column>
  );
};

export default KanbanColumn;
