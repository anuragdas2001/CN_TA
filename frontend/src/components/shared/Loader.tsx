import React from "react";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="h-10 w-10 mb-3 rounded-full border-4 border-t-transparent border-primary animate-spin" />
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  );
};

export default Loader;
