import React from 'react';
import { useParams } from 'react-router-dom';

const TestRoute: React.FC = () => {
  const { id } = useParams();
  return <div>Test Route with ID: {id}</div>;
};

export default TestRoute;
