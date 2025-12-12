
import React from 'react';
import type { CollegeInfo } from '../types';

interface SavedSearchesProps {
  savedColleges: CollegeInfo[];
  onLoad: (uniqueId: string) => void;
  onRemove: (uniqueId: string) => void;
  comparisonList: string[];
  onToggleCompare: (uniqueId: string) => void;
  onStartComparison: () => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ savedColleges, onLoad, onRemove, comparisonList, onToggleCompare, onStartComparison }) => {
  const handleRemoveClick = (e: React.MouseEvent, uniqueId: string) => {
    e.stopPropagation(); 
    onRemove(uniqueId);
  }

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, uniqueId: string) => {
    // Only load the college if the click was not on the checkbox or its label
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' && target.tagName !== 'LABEL' && target.parentElement?.tagName !== 'LABEL') {
      onLoad(uniqueId);
    }
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b-2 border-blue-400/50 pb-2">
        <h2 className="text-2xl font-bold text-white">Saved Searches</h2>
        {comparisonList.length === 2 && (
          <button
            onClick={onStartComparison}
            className="mt-2 sm:mt-0 px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 transform hover:scale-105"
          >
            Compare Selected (2)
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedColleges.map((college, index) => {
          const uniqueId = `${college.collegeName}-${college.userInputMajor || ''}`;
          const isSelectedForCompare = comparisonList.includes(uniqueId);
          return (
            <div
              key={uniqueId}
              onClick={(e) => handleCardClick(e, uniqueId)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e, uniqueId)}
              className={`group relative bg-black/20 p-4 rounded-lg cursor-pointer hover:bg-blue-900/50 transition-all duration-300 focus:outline-none focus-within:ring-2 focus-within:ring-blue-400 ${isSelectedForCompare ? 'ring-2 ring-green-400' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`Load saved search for ${college.collegeName}`}
            >
              <div className="flex justify-between items-start">
                  <div className="flex-1 overflow-hidden pr-2">
                    <h3 className="font-bold text-white truncate">{college.collegeName}</h3>
                    {college.userInputMajor ? (
                        <p className="text-xs text-blue-300 font-semibold truncate mb-1">Focus: {college.userInputMajor}</p>
                    ) : (
                        <p className="text-xs text-gray-400 font-semibold truncate mb-1">General Search</p>
                    )}
                    <p className="text-sm text-gray-400 truncate">{college.location}</p>
                  </div>
                  <label htmlFor={`compare-${uniqueId}`} className="flex items-center space-x-2 cursor-pointer p-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      id={`compare-${uniqueId}`}
                      checked={isSelectedForCompare}
                      onChange={() => onToggleCompare(uniqueId)}
                      disabled={!isSelectedForCompare && comparisonList.length >= 2}
                      className="form-checkbox h-5 w-5 bg-white/20 border-white/30 rounded text-green-500 focus:ring-green-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
              </div>

              <button
                onClick={(e) => handleRemoveClick(e, uniqueId)}
                className="absolute top-2 right-12 p-1.5 bg-red-600/50 text-white rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-red-600 focus:opacity-100 focus:ring-2 focus:ring-red-400 transition-all duration-300"
                aria-label={`Remove saved search for ${college.collegeName}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
      {savedColleges.length > 0 && <p className="text-xs text-gray-400 mt-4 text-center">Select two saved searches to compare them side-by-side.</p>}
    </div>
  );
};

export default SavedSearches;
