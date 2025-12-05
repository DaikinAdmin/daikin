import React from "react";

interface DaikinIconProps {
  name: string;
  className?: string;
}

const DaikinIcon: React.FC<DaikinIconProps> = ({ name, className }) => {
  if (!name) return null;
  
  const src = name.endsWith(".svg") ? `/icons/${name}` : `/icons/${name}.png`;

  return (

      <img
        src={src}
        alt={name}
        className={`w-full h-full object-cover rounded-full select-none pointer-events-none ${className}`}
      />
  );
};

export default DaikinIcon;
