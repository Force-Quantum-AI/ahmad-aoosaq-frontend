import React, { ReactNode } from "react";

// Define the props interface
interface CommonWrapperProps {
  children: ReactNode;
  className?: string;
}

// Define the component
const CommonWrapper: React.FC<CommonWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`max-w-[1400px] px-2 md:px-4 py-2 md:py-4 mx-auto my-auto ${className}`}>
      {children}
    </div>
  );
};

export default CommonWrapper;
