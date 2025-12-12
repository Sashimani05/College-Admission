
import React, { useState } from 'react';

interface CollegeInputFormProps {
  onSearch: (collegeName: string, major: string) => void;
  isLoading: boolean;
}

const CollegeInputForm: React.FC<CollegeInputFormProps> = ({ onSearch, isLoading }) => {
  const [collegeName, setCollegeName] = useState('');
  const [major, setMajor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(collegeName, major);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          placeholder="e.g., 'Harvard University'"
          className="flex-grow px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          disabled={isLoading}
          required
        />
        <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Major/Interest (e.g., 'Engineering', 'Arts')"
            className="flex-grow sm:flex-grow-0 sm:w-1/3 px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Get Insights'}
      </button>
    </form>
  );
};

export default CollegeInputForm;
