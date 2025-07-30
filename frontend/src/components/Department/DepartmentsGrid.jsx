import React from 'react';
import DepartmentCard from './DepartmentCard';

const DepartmentsGrid = ({ departments, hoveredCard, setHoveredCard, onCardClick }) => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              isHovered={hoveredCard === dept.id}
              onMouseEnter={() => setHoveredCard(dept.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onCardClick(dept)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsGrid;