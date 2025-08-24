import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Position {
  id: number;
  title: string;
  department: string;
}

const PositionList: React.FC = () => {
  const [positions] = useState<Position[]>([
    {
      id: 1,
      title: 'Senior Backend Engineer',
      department: 'Engineering'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      department: 'Engineering'
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product'
    }
  ]);

  return (
    <div className="position-list">
      <h1>Open Positions</h1>
      <div className="positions-grid">
        {positions.map(position => (
          <Link 
            key={position.id} 
            to={`/positions/${position.id}`}
            className="position-card"
          >
            <h3>{position.title}</h3>
            <p>{position.department}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PositionList;