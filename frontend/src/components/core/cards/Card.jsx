import React from "react";

const Card = ({ title, actions, children, className = "" }) => {
  return (
    <div className={`bg-white rounded shadow p-4 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-2">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card; 