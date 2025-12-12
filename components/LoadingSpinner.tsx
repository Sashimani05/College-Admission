
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
      <div className="w-16 h-16 border-4 border-blue-400 border-dashed rounded-full animate-spin border-t-transparent"></div>
      <p className="mt-4 text-lg font-semibold text-white">
        Consulting the AI Coach...
      </p>
      <p className="text-sm text-gray-300 mt-1">
        Gathering the latest admissions intelligence.
      </p>
    </div>
  );
};

export default LoadingSpinner;
