import React from "react";

const Card = ({
  children,
  title,
  className = "",
  padding = true,
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 
        ${hover ? "hover:shadow-md transition-shadow cursor-pointer" : ""}
        ${padding ? "p-6" : ""}
        ${className}
      `}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
