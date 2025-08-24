import React from 'react';
import { useParams } from 'react-router-dom';

const SimpleTest: React.FC = () => {
  const params = useParams();
  
  return (
    <div>
      <h1>Simple Test</h1>
      <p>Current Route Params: {JSON.stringify(params)}</p>
    </div>
  );
};

export default SimpleTest;
