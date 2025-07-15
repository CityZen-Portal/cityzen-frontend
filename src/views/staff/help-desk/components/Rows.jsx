import React from 'react';
import Row from './Row';

const Rows = ({ complaints, getStatusColor, getStatusText}) => {
  return (
    <>
      {complaints.map((complaint) => (
        <Row 
          key={complaint.id}
          complaint={complaint}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      ))}
    </>
  );
};

export default Rows;
