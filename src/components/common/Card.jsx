import React from "react";

const Card = ({
  children,
  title,
  icon,
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
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-cerulean-500 text-xl">{icon}</span>}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
