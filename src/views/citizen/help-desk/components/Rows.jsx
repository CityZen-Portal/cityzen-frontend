import Row from './Row';
import React from 'react';

const Rows = ({ complaints, userRole }) => {
  return (
    <>
      {complaints.map((complaint) => (
        <Row
          key={complaint.id}
          userRole={userRole}
          complaint={complaint}
        />
      ))}
    </>
  );
};

export default Rows;
