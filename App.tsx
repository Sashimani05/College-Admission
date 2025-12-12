
import React, { useState, useCallback, useEffect } from 'react';
import { getCollegeInfo } from './services/geminiService';
import { CollegeInfo } from './types';
import Header from './components/Header';
import CollegeInputForm from './components/CollegeInputForm';
import CollegeInfoDisplay from './components/CollegeInfoDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WelcomeMessage from './components/WelcomeMessage';
import SavedSearches from './components/SavedSearches';
import ComparisonDisplay from './components/ComparisonDisplay';

const App: React.FC = () => {
  const [collegeInfo, setCollegeInfo] = useState<CollegeInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedColleges, setSavedColleges] = useState<CollegeInfo[]>([]);
  
  // State for comparison feature
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [collegesToCompare, setCollegesToCompare] = useState<[CollegeInfo, CollegeInfo] | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedCollegeSearches');
      if (saved) {
        setSavedColleges(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load saved searches from localStorage", error);
      localStorage.removeItem('savedCollegeSearches');
    }
  }, []);

  const handleSaveCollege = useCallback((collegeToSave: CollegeInfo) => {
    setSavedColleges(prevSaved => {
      if (prevSaved.some(c => 
          c.collegeName.toLowerCase() === collegeToSave.collegeName.toLowerCase() && 
          (c.userInputMajor || '').toLowerCase() === (collegeToSave.userInputMajor || '').toLowerCase()
      )) {
        return prevSaved;
      }
      const newSaved = [...prevSaved, collegeToSave];
      localStorage.setItem('savedCollegeSearches', JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  const handleRemoveCollege = useCallback((uniqueId: string) => {
    setSavedColleges(prevSaved => {
      const newSaved = prevSaved.filter(c => `${c.collegeName}-${c.userInputMajor || ''}` !== uniqueId);
      localStorage.setItem('savedCollegeSearches', JSON.stringify(newSaved));
      if (collegeInfo && `${collegeInfo.collegeName}-${collegeInfo.userInputMajor || ''}` === uniqueId) {
        setCollegeInfo(null);
      }
      return newSaved;
    });
    // Also remove from comparison if it was selected
    setComparisonList(prev => prev.filter(id => id !== uniqueId));
  }, [collegeInfo]);

  const handleLoadSavedCollege = useCallback((uniqueId: string) => {
    const collegeToLoad = savedColleges.find(c => `${c.collegeName}-${c.userInputMajor || ''}` === uniqueId);
    if (collegeToLoad) {
      setCollegeInfo(collegeToLoad);
      setError(null);
      setIsLoading(false);
      setIsComparing(false);
      setCollegesToCompare(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [savedColleges]);

  const handleSearch = useCallback(async (collegeName: string, major: string) => {
    if (!collegeName.trim()) {
      setError('Please enter a college name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCollegeInfo(null);
    setIsComparing(false);

    try {
      const info = await getCollegeInfo(collegeName, major);
      setCollegeInfo(info);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch college information. The AI might be busy, or the college name is invalid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleCompare = useCallback((uniqueId: string) => {
    setComparisonList(prev => {
      const isSelected = prev.includes(uniqueId);
      if (isSelected) {
        return prev.filter(id => id !== uniqueId);
      } else if (prev.length < 2) {
        return [...prev, uniqueId];
      }
      return prev; // Don't add more than 2
    });
  }, []);

  const handleStartComparison = useCallback(() => {
    if (comparisonList.length !== 2) return;
    
    const college1 = savedColleges.find(c => `${c.collegeName}-${c.userInputMajor || ''}` === comparisonList[0]);
    const college2 = savedColleges.find(c => `${c.collegeName}-${c.userInputMajor || ''}` === comparisonList[1]);

    if (college1 && college2) {
      setCollegesToCompare([college1, college2]);
      setIsComparing(true);
      setCollegeInfo(null);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [comparisonList, savedColleges]);
  
  const handleClearComparison = useCallback(() => {
      setIsComparing(false);
      setCollegesToCompare(null);
      setComparisonList([]);
  }, []);

  const isCurrentCollegeSaved = collegeInfo ? savedColleges.some(c => 
      c.collegeName.toLowerCase() === collegeInfo.collegeName.toLowerCase() &&
      (c.userInputMajor || '') === (collegeInfo.userInputMajor || '')
  ) : false;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 antialiased">
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('https://picsum.photos/1920/1080?grayscale&blur=2')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative container mx-auto p-4 sm:p-6 lg:p-8 z-10">
          <Header />
          <main>
            {!isComparing && (
              <div className="max-w-4xl mx-auto mt-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
                <CollegeInputForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
            )}

            {savedColleges.length > 0 && !isComparing && (
              <div className="max-w-4xl mx-auto mt-8">
                <SavedSearches 
                  savedColleges={savedColleges}
                  onLoad={handleLoadSavedCollege}
                  onRemove={handleRemoveCollege}
                  comparisonList={comparisonList}
                  onToggleCompare={handleToggleCompare}
                  onStartComparison={handleStartComparison}
                />
              </div>
            )}

            <div className="max-w-4xl mx-auto mt-8">
              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} />}

              {isComparing && collegesToCompare ? (
                <ComparisonDisplay 
                  college1={collegesToCompare[0]} 
                  college2={collegesToCompare[1]}
                  onClear={handleClearComparison}
                />
              ) : collegeInfo ? (
                <CollegeInfoDisplay 
                  info={collegeInfo}
                  onSave={handleSaveCollege}
                  isSaved={isCurrentCollegeSaved}
                />
              ) : (
                !isLoading && !error && <WelcomeMessage />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
