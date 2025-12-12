
import React, { useState } from 'react';
import type { CollegeInfo, Scholarship, AcademicTrack, Club, CollegeVisit, StudentOpportunity, EssayPrompt, NearbyPlace, Alumnus, CareerOutcomes } from '../types';
import CostChart from './CostChart';
import ScholarshipChart from './ScholarshipChart';

interface CollegeInfoDisplayProps {
  info: CollegeInfo;
  onSave: (info: CollegeInfo) => void;
  isSaved: boolean;
}

const ScorecardMetric: React.FC<{ label: string; value: string; subtext?: string }> = ({ label, value, subtext }) => (
  <div className="text-center">
    <p className="text-sm font-semibold text-blue-200 uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-extrabold text-white mt-1">{value}</p>
    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
  </div>
);

const CollegeScorecard: React.FC<{ info: CollegeInfo }> = ({ info }) => {
  const { schoolType, setting, fourYearGraduationRate, costOfAttendance, careerOutcomes } = info;
  
  const sortedCareerOutcomes = Array.isArray(careerOutcomes)
    ? [...careerOutcomes].sort((a, b) => parseInt(b.year) - parseInt(a.year))
    : [];
  
  const latestCareerInfo = sortedCareerOutcomes[0];
  
  const avgAnnualCost = costOfAttendance.inStateTuition + costOfAttendance.roomAndBoard + costOfAttendance.books + costOfAttendance.food;

  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <ScorecardMetric label="Type" value={schoolType} subtext={setting} />
        <ScorecardMetric label="Graduation Rate" value={fourYearGraduationRate > 0 ? `${fourYearGraduationRate}%` : 'N/A'} subtext="4-Year Rate" />
        <ScorecardMetric label="Avg. Annual Cost" value={avgAnnualCost > 0 ? formatCurrency(avgAnnualCost) : 'N/A'} subtext="In-State" />
        <ScorecardMetric label="Median Earnings" value={latestCareerInfo?.medianStartingSalary || 'N/A'} subtext={`Post-Graduation (${latestCareerInfo?.year || 'N/A'})`} />
      </div>
    </div>
  );
};


const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 mb-6">
    <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-blue-400/50 pb-2">{children ? title : ''}</h2>
    {children}
  </div>
);

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-white/10">
    <dt className="text-sm font-medium text-gray-300">{label}</dt>
    <dd className="text-sm text-white font-semibold text-right">{value}</dd>
  </div>
);

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-2 align-middle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-blue-300 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-50 text-center leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const formatCurrency = (value: number) => {
  return value > 0 ? `$${value.toLocaleString()}` : 'N/A';
};

const getCategoryColor = (category: string) => {
  if (!category) return 'bg-gray-500/30 text-gray-200';
  switch (category.toLowerCase()) {
    case 'sports': return 'bg-green-500/30 text-green-200';
    case 'arts':
    case 'music':
    case 'dance':
       return 'bg-purple-500/30 text-purple-200';
    case 'academic': return 'bg-blue-500/30 text-blue-200';
    case 'social': return 'bg-yellow-500/30 text-yellow-200';
    case 'restaurant': return 'bg-orange-500/30 text-orange-200';
    case 'cinema': return 'bg-red-500/30 text-red-200';
    case 'hangout': return 'bg-teal-500/30 text-teal-200';
    default: return 'bg-gray-500/30 text-gray-200';
  }
};

const OpportunitySection: React.FC<{ title: string; opportunities: StudentOpportunity[] }> = ({ title, opportunities }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (!opportunities || opportunities.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left flex justify-between items-center bg-black/20 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-expanded={isOpen}
            >
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <svg
                    className={`w-6 h-6 text-white transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="mt-4 space-y-4">
                    {opportunities.map((opp, index) => (
                        <div key={index} className="p-4 bg-black/20 rounded-lg border-l-4 border-blue-400">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <h4 className="font-bold text-white text-lg">{opp.name}</h4>
                                <span className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(opp.location)}`}>
                                    {opp.location}
                                </span>
                            </div>
                            <p className="text-sm text-gray-300 mt-2">{opp.description}</p>
                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <p className="text-xs font-semibold text-yellow-300 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Timeline: {opp.applicationTimeline}
                                </p>
                                {opp.link && opp.link !== 'N/A' && (
                                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors">
                                        Learn More &rarr;
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ScholarshipDescription: React.FC<{ description: string }> = ({ description }) => {
    if (!description) {
        return <span className="text-gray-400">N/A</span>;
    }

    // 1. Keyword Highlighting
    const keywords = ['gpa', 'major', 'merit-based', 'need-based', 'financial need', 'essay', 'recommendation', 'first-year', 'freshman', 'transfer', 'international', 'resident', 'citizen', 'leadership', 'community service', 'deadline'];
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    const parts = description.split(regex);
    const highlightedDescription = (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <strong key={i} className="text-yellow-300 bg-yellow-500/10 px-1 rounded-sm font-semibold">{part}</strong>
                ) : (
                    part
                )
            )}
        </span>
    );

    // 2. Deadline Extraction
    const deadlineRegex = /(?:deadline|due by|apply by|application deadline):?\s*([a-zA-Z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/i;
    const match = description.match(deadlineRegex);
    const deadline = match ? match[1] : null;

    return (
        <div>
            <p>{highlightedDescription}</p>
            {deadline && (
                <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-red-500/20 text-red-200 border border-red-500/30 rounded-md text-xs font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Deadline Found: {deadline}
                </div>
            )}
        </div>
    );
};

const CollegeInfoDisplay: React.FC<CollegeInfoDisplayProps> = ({ info, onSave, isSaved }) => {
  const { 
    collegeName, 
    location,
    website,
    generalPhone,
    schoolType,
    setting,
    awardsOffered,
    campusHousing,
    studentPopulation,
    acceptanceRate,
    fourYearGraduationRate,
    admissionRequirements, 
    costOfAttendance, 
    scholarships, 
    academicTracks, 
    userInputMajor, 
    otherDetails,
    clubs,
    counselorInfo,
    upcomingVisits,
    studentOpportunities,
    nearbyPlaces,
    campusCommute,
    faangRecruitment,
    careerOutcomes,
    famousAlumni,
    applicationLink, 
    shortNote, 
    princetonReviewStatus 
  } = info;

  const { 
    inStateTuition, 
    outOfStateTuition, 
    internationalTuition, 
    roomAndBoard,
    books, 
    food,
    travelExpenses
  } = costOfAttendance;

  const { isListed, summary, pros, cons } = princetonReviewStatus;

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormName, setContactFormName] = useState('');
  const [contactFormEmail, setContactFormEmail] = useState('');
  const [contactFormMessage, setContactFormMessage] = useState('');
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  const handleCopyPrompt = async (promptText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPromptIndex(index);
      setTimeout(() => setCopiedPromptIndex(null), 2000); 
    } catch (err) {
      console.error('Failed to copy prompt: ', err);
    }
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Counselor Inquiry Sent:", {
        name: contactFormName,
        email: contactFormEmail,
        message: contactFormMessage,
        college: collegeName,
        counselor: counselorInfo.name,
    });
    setContactFormName('');
    setContactFormEmail('');
    setContactFormMessage('');
    setShowContactForm(false);
  };

  const handleDownloadCSV = () => {
    if (!info) return;

    const escapeCSV = (str: string | number | boolean): string => {
      let s = String(str ?? 'N/A');
      s = s.replace(/"/g, '""');
      if (s.search(/("|,|\n)/g) >= 0) {
        return `"${s}"`;
      }
      return s;
    };

    const formatArrayForCSV = (arr: any[], formatter: (item: any) => string): string => {
      if (!Array.isArray(arr) || arr.length === 0) return 'N/A';
      return arr.map(formatter).join('; ');
    };
    
    const formatCareerOutcomesForCSV = (outcomes: CareerOutcomes[] | undefined): string => {
        if (!Array.isArray(outcomes) || outcomes.length === 0) return 'N/A';
        return outcomes
            .sort((a, b) => parseInt(b.year) - parseInt(a.year))
            .map(o => `(${o.year}: Placement=${o.placementRate}, Salary=${o.medianStartingSalary})`)
            .join('; ');
    };

    const allRecruiters = Array.isArray(info.careerOutcomes)
        ? [...new Set(info.careerOutcomes.flatMap(o => o.topRecruiters))].join(', ')
        : 'N/A';
        
    const allLocalRecruiters = Array.isArray(info.careerOutcomes)
        ? [...new Set(info.careerOutcomes.flatMap(o => o.localRecruiters || []))].join(', ')
        : 'N/A';


    const headers = [
      'College Name', 'Location', 'Website', 'Phone', 'School Type', 'Setting', 'Campus Housing', 'Student Population', 'Awards Offered',
      'Acceptance Rate (%)', '4-Year Graduation Rate (%)', 'Avg GPA', 'Min GPA', 'SAT Range', 'ACT Range', 'Test Policy', 'Essay Required',
      'In-State Tuition ($)', 'Out-of-State Tuition ($)', 'International Tuition ($)', 'Room & Board ($)', 'Books ($)', 'Food ($)', 'Travel Expenses ($)',
      'Regular Decision Deadline', 'Early Action Deadline', 'Early Decision Deadline', 'Student:Faculty Ratio',
      'Scholarships', 'Academic Tracks', 'Student Opportunities', 'Clubs',
      'Nearby Places', 'Campus Commute Summary', 'Free Commute Services',
      'Career Outcomes History', 'Top Recruiters (Combined)', 'Top Local Recruiters (Combined)',
      'FAANG Presence', 'FAANG Companies', 'FAANG Recruitment Summary',
      'Notable Alumni',
      'Counselor Name', 'Counselor Email', 'Counselor Phone', 'Upcoming Visits', 'Application Link',
      'Short Note', 'Princeton Review Listed', 'Princeton Review Summary', 'Princeton Review Pros', 'Princeton Review Cons', 'Essay Prompts'
    ];

    const data = [
      escapeCSV(info.collegeName),
      escapeCSV(info.location),
      escapeCSV(info.website),
      escapeCSV(info.generalPhone),
      escapeCSV(info.schoolType),
      escapeCSV(info.setting),
      escapeCSV(info.campusHousing ? 'Yes' : 'No'),
      escapeCSV(info.studentPopulation),
      escapeCSV(info.awardsOffered.join(', ')),
      escapeCSV(info.acceptanceRate),
      escapeCSV(info.fourYearGraduationRate),
      escapeCSV(info.admissionRequirements.avgGpa),
      escapeCSV(info.admissionRequirements.minimumGpa),
      escapeCSV(info.admissionRequirements.satRange),
      escapeCSV(info.admissionRequirements.actRange),
      escapeCSV(info.admissionRequirements.testPolicy),
      escapeCSV(info.admissionRequirements.essayRequired),
      escapeCSV(info.costOfAttendance.inStateTuition),
      escapeCSV(info.costOfAttendance.outOfStateTuition),
      escapeCSV(info.costOfAttendance.internationalTuition),
      escapeCSV(info.costOfAttendance.roomAndBoard),
      escapeCSV(info.costOfAttendance.books),
      escapeCSV(info.costOfAttendance.food),
      escapeCSV(info.costOfAttendance.travelExpenses),
      escapeCSV(info.otherDetails.regularDecisionDeadline),
      escapeCSV(info.otherDetails.earlyActionDeadline),
      escapeCSV(info.otherDetails.earlyDecisionDeadline),
      escapeCSV(info.otherDetails.studentFacultyRatio),
      escapeCSV(formatArrayForCSV(info.scholarships, s => `${s.name} (${s.amount}, ${s.type})`)),
      escapeCSV(formatArrayForCSV(info.academicTracks, t => `${t.major}: ${t.description.replace(/\n/g, ' ')}`)),
      escapeCSV(formatArrayForCSV(info.studentOpportunities, o => `${o.name} (${o.type}) - Timeline: ${o.applicationTimeline}`)),
      escapeCSV(Array.isArray(info.clubs) ? info.clubs.map(c => c.name).join(', ') : 'N/A'),
      escapeCSV(formatArrayForCSV(info.nearbyPlaces, p => `${p.name} (${p.category}) - ${p.distanceFromCollege} [Free Transport: ${p.freeTransportAvailable ? 'Yes' : 'No'}]: ${p.description}`)),
      escapeCSV(info.campusCommute?.summary),
      escapeCSV(Array.isArray(info.campusCommute?.freeServices) ? info.campusCommute.freeServices.join(', ') : 'N/A'),
      escapeCSV(formatCareerOutcomesForCSV(info.careerOutcomes)),
      escapeCSV(allRecruiters),
      escapeCSV(allLocalRecruiters),
      escapeCSV(info.faangRecruitment?.hasPresence ? 'Yes' : 'No'),
      escapeCSV(Array.isArray(info.faangRecruitment?.knownCompanies) ? info.faangRecruitment.knownCompanies.join(', ') : 'N/A'),
      escapeCSV(info.faangRecruitment?.recruitmentSummary),
      escapeCSV(formatArrayForCSV(info.famousAlumni, a => `${a.name} (${a.gradYear}) - ${a.currentTitle}`)),
      escapeCSV(info.counselorInfo.name),
      escapeCSV(info.counselorInfo.email),
      escapeCSV(info.counselorInfo.phone),
      escapeCSV(formatArrayForCSV(info.upcomingVisits, v => `${v.date}: ${v.description.replace(/\n/g, ' ')}`)),
      escapeCSV(info.applicationLink), 
      escapeCSV(info.shortNote),
      escapeCSV(isListed ? 'Yes' : 'No'),
      escapeCSV(summary),
      escapeCSV(pros), 
      escapeCSV(cons),
      escapeCSV(formatArrayForCSV(info.admissionRequirements.essayPrompts, (p: EssayPrompt) => `${p.title}: ${p.text.replace(/\n/g, ' ')}`))
    ];

    const csvContent = [headers.join(','), data.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `${info.collegeName.toLowerCase().replace(/\s+/g, '_')}_data.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const groupedClubs: Record<string, Club[]> = {};
  if (Array.isArray(clubs)) {
    clubs.forEach((club) => {
      if (club && typeof club === 'object') {
        const category = club.category || 'General';
        if (!groupedClubs[category]) {
          groupedClubs[category] = [];
        }
        groupedClubs[category].push(club);
      }
    });
  }

  const groupedOpportunities: Record<string, StudentOpportunity[]> = {};
  if (Array.isArray(studentOpportunities)) {
    studentOpportunities.forEach((opp) => {
      if (opp && typeof opp === 'object') {
        const type = opp.type || 'Other';
        if (!groupedOpportunities[type]) {
          groupedOpportunities[type] = [];
        }
        groupedOpportunities[type].push(opp);
      }
    });
  }

  const relevantOpportunityTypes = Object.keys(groupedOpportunities)
    .filter(type => type !== 'Volunteering' && type !== 'Career Enhancement');

  const totalAdditionalCosts = books + food + travelExpenses;
  const inStateTotalCost = inStateTuition + roomAndBoard + totalAdditionalCosts;
  const outOfStateTotalCost = outOfStateTuition + roomAndBoard + totalAdditionalCosts;
  const internationalTotalCost = internationalTuition + roomAndBoard + totalAdditionalCosts;

  const isMedRelated = (userInputMajor || '').toLowerCase().match(/med|doctor|health|biology|science|nurse|clinical/);
  const showPreMedTips = !userInputMajor || isMedRelated;

  const sortedCareerOutcomes = Array.isArray(careerOutcomes) 
    ? [...careerOutcomes].sort((a, b) => parseInt(b.year) - parseInt(a.year)) 
    : [];

  return (
    <div className="animate-fade-in space-y-8">
      <header className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-4xl font-extrabold text-white">{collegeName}</h1>
              {userInputMajor && (
                  <div className="mt-1">
                      <span className="inline-block px-3 py-1 bg-blue-600/50 rounded-full text-xs font-semibold text-blue-100 uppercase tracking-wide">
                        Focus: {userInputMajor}
                      </span>
                  </div>
              )}
              <div className="mt-2 text-lg text-gray-300 flex items-center justify-center sm:justify-start gap-3">
                <span>{location}</span>
                {location && location !== 'N/A' && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${collegeName}, ${location}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1 text-sm font-semibold"
                    aria-label={`View ${collegeName} on Google Maps`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    View on Map
                  </a>
                )}
              </div>
              {shortNote && shortNote !== 'N/A' && (
                <p className="mt-2 text-md text-gray-400 italic max-w-2xl mx-auto sm:mx-0">{shortNote}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-shrink-0">
              {applicationLink && applicationLink !== 'N/A' && (
                <a 
                  href={applicationLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  aria-label={`Go to ${collegeName} Application Portal`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" /></svg>
                  Apply Now
                </a>
              )}
              <button 
                onClick={handleDownloadCSV}
                className="w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download CSV
              </button>
              <button 
                onClick={() => onSave(info)} 
                disabled={isSaved}
                className="w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {isSaved ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" />
                    </svg>
                    Save Search
                  </>
                )}
              </button>
            </div>
          </div>
      </header>

      <CollegeScorecard info={info} />

      <InfoCard title="General Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <dl>
              <DetailItem label="Website" value={<a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">{website}</a>} />
              <DetailItem label="General Phone" value={<a href={`tel:${generalPhone}`} className="text-blue-300 hover:underline">{generalPhone}</a>} />
              <DetailItem label="Type" value={`${schoolType} | ${setting}`} />
              <DetailItem label="Campus Housing" value={campusHousing ? 'Yes' : 'No'} />
              <DetailItem label="Student Population" value={studentPopulation} />
              <DetailItem label="Student-to-Faculty Ratio" value={otherDetails.studentFacultyRatio} />
            </dl>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Awards Offered</h3>
            <div className="flex flex-wrap gap-2">
              {awardsOffered.map((award, i) => (
                <span key={i} className="px-2 py-1 bg-gray-500/30 text-gray-200 rounded-md text-xs font-medium">
                  {award}
                </span>
              ))}
            </div>
          </div>
        </div>
      </InfoCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-300">Acceptance Rate</h3>
            <p className="text-4xl font-bold text-white mt-2">{acceptanceRate > 0 ? `${acceptanceRate}%` : 'N/A'}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-300">4-Year Grad Rate</h3>
            <p className="text-4xl font-bold text-white mt-2">{fourYearGraduationRate > 0 ? `${fourYearGraduationRate}%` : 'N/A'}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-300">SAT/ACT Policy</h3>
            <p className="text-4xl font-bold text-white mt-2">{admissionRequirements.testPolicy || 'N/A'}</p>
        </div>
      </div>
      
      <InfoCard title="Application Deadlines">
          <dl>
              <DetailItem label="Regular Decision" value={otherDetails.regularDecisionDeadline || 'N/A'} />
              <DetailItem label="Early Action" value={otherDetails.earlyActionDeadline || 'N/A'} />
              <DetailItem label="Early Decision" value={otherDetails.earlyDecisionDeadline || 'N/A'} />
          </dl>
      </InfoCard>

      {princetonReviewStatus && (isListed || summary !== 'N/A') && (
        <InfoCard title="Princeton Review Status">
          <div className="flex items-center gap-3 mb-3">
            {isListed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <p className="text-lg font-semibold text-white">
              {isListed ? 'Listed in Princeton Review' : 'Not listed in Princeton Review'}
            </p>
          </div>
          {summary && summary !== 'N/A' && (
             <p className="text-sm text-gray-300 italic">{summary}</p>
          )}
        </InfoCard>
      )}

      {isListed && (pros.length > 0 || cons.length > 0) && (
        <InfoCard title="Pros and Cons (from Princeton Review)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(pros && pros.length > 0) ? (
              <div>
                <h3 className="font-semibold text-green-400 text-lg flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Pros
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  {pros.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ) : (
                <p className="text-gray-400 italic">No specific pros listed.</p>
            )}

            {(cons && cons.length > 0) ? (
              <div>
                <h3 className="font-semibold text-red-400 text-lg flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Cons
                </h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                  {cons.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ) : (
                <p className="text-gray-400 italic">No specific cons listed.</p>
            )}
          </div>
        </InfoCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoCard title="Admission Requirements">
            <dl>
                <DetailItem label="Average GPA" value={admissionRequirements.avgGpa} />
                <DetailItem label="Minimum GPA" value={admissionRequirements.minimumGpa} />
                <DetailItem label="SAT Range" value={admissionRequirements.satRange} />
                <DetailItem label="ACT Range" value={admissionRequirements.actRange} />
                <DetailItem label="Essay Required" value={admissionRequirements.essayRequired ? 'Yes' : 'No'} />
            </dl>
             {admissionRequirements.essayRequired && Array.isArray(admissionRequirements.essayPrompts) && admissionRequirements.essayPrompts.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-200 mb-3">Essay Prompts:</h4>
                    <div className="space-y-4">
                      {admissionRequirements.essayPrompts.map((prompt: EssayPrompt, i: number) => (
                        <div key={i} className="p-3 bg-black/20 rounded-lg border border-white/10">
                          <h5 className="font-bold text-blue-300 text-md mb-1">{prompt.title}</h5>
                          <p className="text-sm text-gray-300">{prompt.text}</p>
                          <button
                            onClick={() => handleCopyPrompt(prompt.text, i)}
                            className="mt-2 px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-colors flex items-center gap-1"
                            aria-label={`Copy prompt for ${prompt.title}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            {copiedPromptIndex === i ? 'Copied!' : 'Copy Prompt'}
                          </button>
                        </div>
                      ))}
                    </div>
                </div>
             )}
        </InfoCard>

        <InfoCard title="Cost of Attendance (Annual)">
             <dl>
                <DetailItem label="In-State Tuition" value={formatCurrency(inStateTuition)} />
                <DetailItem label="Out-of-State Tuition" value={formatCurrency(outOfStateTuition)} />
                <DetailItem label="International Tuition" value={formatCurrency(internationalTuition)} />
                <DetailItem label="Room & Board" value={formatCurrency(roomAndBoard)} />
                <DetailItem label="Books & Supplies" value={formatCurrency(books)} /> 
                <DetailItem label="Food Expenses" value={formatCurrency(food)} /> 
                <DetailItem label="Travel Expenses" value={formatCurrency(travelExpenses)} /> 
                <div className="flex justify-between pt-3 mt-2 border-t-2 border-white/20">
                    <dt className="text-md font-bold text-white">Total Annual Cost (In-State)</dt>
                    <dd className="text-md font-bold text-white text-right">{formatCurrency(inStateTotalCost)}</dd>
                </div>
                <div className="flex justify-between pt-2">
                    <dt className="text-md font-bold text-white">Total Annual Cost (Out-of-State)</dt>
                    <dd className="text-md font-bold text-white text-right">{formatCurrency(outOfStateTotalCost)}</dd>
                </div>
                 <div className="flex justify-between pt-2 border-b border-white/10 pb-2">
                    <dt className="text-md font-bold text-white">Total Annual Cost (International)</dt>
                    <dd className="text-md font-bold text-white text-right">{formatCurrency(internationalTotalCost)}</dd>
                </div>
            </dl>
            <CostChart cost={costOfAttendance} />
        </InfoCard>
      </div>

      <InfoCard title="Student Life & Clubs">
        {Object.keys(groupedClubs).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedClubs).map(([category, clubsInCategory]) => (
              <div key={category}>
                <h4 className="font-bold text-gray-200 text-md capitalize mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {clubsInCategory.map((club) => (
                    <span key={club.name} className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(category)}`}>
                      {club.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">No specific club data found.</p>
        )}
      </InfoCard>

      <InfoCard title="Nearby Hangouts & Entertainment">
        {Array.isArray(nearbyPlaces) && nearbyPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyPlaces.map((place: NearbyPlace, i: number) => (
              <div key={i} className="p-4 bg-black/20 rounded-lg border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-lg">{place.name}</h4>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(place.category)}`}>
                    {place.category}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mb-2 text-xs text-gray-300">
                    {place.distanceFromCollege && (
                        <span className="flex items-center gap-1 font-semibold text-blue-200">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             {place.distanceFromCollege}
                        </span>
                    )}
                    {place.freeTransportAvailable && (
                         <span className="flex items-center gap-1 font-semibold text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                             Free Shuttle Available
                         </span>
                    )}
                </div>
                <p className="text-sm text-gray-300 mb-3">{place.description}</p>
                {place.link && place.link !== 'N/A' && (
                  <a href={place.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    View Info / Map
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">No nearby places information available.</p>
        )}
      </InfoCard>

      <InfoCard title="Campus Transportation">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Commute Overview
                </h4>
                <p className="text-gray-300">{campusCommute?.summary || 'Information not available.'}</p>
            </div>
            {campusCommute?.freeServices && campusCommute.freeServices.length > 0 && (
                <div className="flex-1">
                     <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                        Free Services
                    </h4>
                     <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {campusCommute.freeServices.map((service, i) => (
                            <li key={i}>{service}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </InfoCard>

      {sortedCareerOutcomes.length > 0 && (
      <InfoCard title="Career Outcomes & Placement History">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedCareerOutcomes.map((outcome, index) => (
              <div key={index} className="bg-black/20 p-4 rounded-lg text-center border border-white/10 flex flex-col justify-between">
                <h3 className="text-xl font-bold text-white mb-4">{outcome.year}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-300 font-medium text-sm flex items-center justify-center">
                      Placement Rate
                      <Tooltip text="Percentage of graduates employed or in further education within 6 months of graduation." />
                    </h4>
                    <p className="text-2xl font-bold text-green-400 mt-1">{outcome.placementRate}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-medium text-sm flex items-center justify-center">
                      Median Starting Salary
                      <Tooltip text="The median annual starting salary for graduates in their first full-time role." />
                    </h4>
                    <p className="text-2xl font-bold text-green-400 mt-1">{outcome.medianStartingSalary}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-6">
            <h3 className="font-semibold text-white mb-3 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Top Recruiters (Recent Graduates)
            </h3>
            {sortedCareerOutcomes[0]?.topRecruiters && sortedCareerOutcomes[0].topRecruiters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                {sortedCareerOutcomes[0].topRecruiters.map((company, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-600/30 text-blue-100 rounded-md text-sm border border-blue-500/30 font-medium">
                        {company}
                    </span>
                ))}
                </div>
            ) : (
                <p className="text-gray-400 italic">No specific recruiter data available for the most recent year.</p>
            )}
        </div>
        <div className="mt-6">
            <h3 className="font-semibold text-white mb-3 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Local & In-State Recruiters
            </h3>
            {sortedCareerOutcomes[0]?.localRecruiters && sortedCareerOutcomes[0].localRecruiters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                {sortedCareerOutcomes[0].localRecruiters.map((company, i) => (
                    <span key={i} className="px-3 py-1 bg-teal-600/30 text-teal-100 rounded-md text-sm border border-teal-500/30 font-medium">
                        {company}
                    </span>
                ))}
                </div>
            ) : (
                <p className="text-gray-400 italic">No specific local recruiter data available for the most recent year.</p>
            )}
        </div>
      </InfoCard>
      )}

      {/* FAANG Recruitment Section */}
      <InfoCard title="FAANG & Tech Recruitment">
          <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                  {faangRecruitment?.hasPresence ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/50 rounded-full text-sm font-semibold flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                           Strong Tech Recruitment Presence
                      </span>
                  ) : (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 rounded-full text-sm font-semibold">
                          Limited/No Known FAANG Presence
                      </span>
                  )}
              </div>
              
              {faangRecruitment?.knownCompanies && faangRecruitment.knownCompanies.length > 0 && (
                  <div>
                      <h4 className="text-white font-semibold mb-2">Companies recruiting on campus:</h4>
                      <div className="flex flex-wrap gap-2">
                          {faangRecruitment.knownCompanies.map((company, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-600/30 text-blue-100 rounded-md text-sm border border-blue-500/30">
                                  {company}
                              </span>
                          ))}
                      </div>
                  </div>
              )}

              {faangRecruitment?.recruitmentSummary && (
                  <div className="mt-2 bg-black/20 p-4 rounded-lg border-l-4 border-purple-400">
                      <h4 className="text-white font-semibold mb-1">Recruitment & Internship Overview</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{faangRecruitment.recruitmentSummary}</p>
                  </div>
              )}
          </div>
      </InfoCard>

      {/* Notable Alumni Section */}
      <InfoCard title="Notable Alumni">
        {Array.isArray(famousAlumni) && famousAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {famousAlumni.map((alum: Alumnus, i: number) => (
              <div key={i} className="p-4 bg-gradient-to-br from-indigo-900/40 to-black/20 rounded-lg border border-indigo-500/30 hover:border-indigo-400/50 transition-colors shadow-lg">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-lg">{alum.name}</h4>
                  {alum.gradYear && alum.gradYear !== 'N/A' && (
                     <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-200 text-xs rounded-full font-mono border border-indigo-500/30">
                       Class of {alum.gradYear}
                     </span>
                  )}
                </div>
                <p className="text-indigo-300 font-semibold text-sm mt-1 mb-2 min-h-[1.5rem]">{alum.currentTitle}</p>
                <p className="text-sm text-gray-300 leading-snug">{alum.achievement}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">No notable alumni data found.</p>
        )}
      </InfoCard>

      <InfoCard title="Scholarships">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-blue-200 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">Scholarship Name</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Duration</th>
                <th scope="col" className="px-4 py-3">Eligibility/Description</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(scholarships) && scholarships.length > 0 ? scholarships.map((s: Scholarship, i: number) => (
                <tr key={i} className="border-b border-white/10">
                  <th scope="row" className="px-4 py-4 font-medium text-white whitespace-nowrap">{s.name}</th>
                  <td className="px-4 py-4 text-gray-300">{s.amount}</td>
                   <td className="px-4 py-4 text-gray-300">{s.type}</td>
                  <td className="px-4 py-4 text-gray-300">{s.duration}</td>
                  <td className="px-4 py-4 text-gray-300">
                    <ScholarshipDescription description={s.description} />
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-4 text-gray-400">No specific scholarship data found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <ScholarshipChart scholarships={scholarships} />
      </InfoCard>

      <InfoCard title="Student Opportunities">
        {Array.isArray(studentOpportunities) && studentOpportunities.length > 0 && relevantOpportunityTypes.length > 0 ? (
          <div>
            {relevantOpportunityTypes.map(type => (
                <OpportunitySection key={type} title={`${type} Opportunities`} opportunities={groupedOpportunities[type]} />
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">No specific opportunity data found.</p>
        )}
      </InfoCard>

      {/* Dynamic Title for Tracks */}
      <InfoCard title={userInputMajor ? `${userInputMajor} Academic Tracks` : "Popular Academic Tracks"}>
        <div className="space-y-4">
            {Array.isArray(academicTracks) && academicTracks.length > 0 ? academicTracks.map((track: AcademicTrack, i: number) => (
                <div key={i} className="p-4 bg-black/20 rounded-lg">
                    <h4 className="font-bold text-white">{track.major}</h4>
                    <p className="text-sm text-gray-300 mt-1">{track.description}</p>
                </div>
            )) : (
                 <p className="text-center py-4 text-gray-400">No specific academic track data found.</p>
            )}
        </div>
      </InfoCard>

      {/* Conditionally Render Pre-Med Success Strategies */}
      {showPreMedTips && (
        <InfoCard title="Pre-Med Success Strategies">
            <h3 className="text-xl font-bold text-white mb-4">Charting Your Path to Medical School</h3>
            <p className="text-gray-300 mb-4">
            A successful pre-med journey requires dedication and strategic planning. Here's some advice to help you excel:
            </p>

            <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-blue-300 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" /></svg>
                Academic Excellence & Study Tips
                </h4>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1">
                <li>Master your **foundational science courses** (Biology, Chemistry, Physics, Organic Chemistry). These are critical for the MCAT and medical school curriculum.</li>
                <li>Practice **active learning**: don't just read, but **summarize, teach others, and solve practice problems** regularly.</li>
                <li>Utilize **academic support services** like tutoring and study groups, and always attend **review sessions**.</li>
                <li>Consider {academicTracks.length > 0 ? academicTracks.map(t => t.major).join(', ') : 'a strong science major'} to build a **robust scientific foundation**.</li>
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-blue-300 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 013-3h12c-.114.098-.227.199-.336.307M12 12l-1.22-1.22a4 4 0 10-5.656-5.656 4 4 0 00-5.656 5.656L10.78 12.22" /></svg>
                Meaningful Extracurricular Engagement
                </h4>
                <p className="text-gray-300 mb-2 ml-4">Medical schools seek **well-rounded applicants** with a **genuine commitment** to helping others:</p>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1">
                <li>Gain significant **clinical experience** (e.g., hospital volunteering, EMT, medical scribe).</li>
                <li>Engage in **research**, preferably **hands-on**. {groupedOpportunities['Research'] && groupedOpportunities['Research'].length > 0 ? `Explore opportunities like "${groupedOpportunities['Research'][0].name}" or similar listed here.` : 'Look for faculty research labs on campus.'}</li>
                <li>Volunteer in **community service roles**, especially with **underserved populations**.</li>
                <li>Seek **leadership roles** in student organizations or community initiatives.</li>
                <li>Consider **shadowing physicians** in various specialties to understand the profession deeply.</li>
                </ul>
            </div>

            <div>
                <h4 className="font-semibold text-blue-300 text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                Build Strong Relationships with Professors
                </h4>
                <ul className="list-disc list-inside text-gray-300 mt-2 ml-4 space-y-1">
                <li>Attend **office hours** regularly, even if just to ask clarifying questions about lectures or concepts.</li>
                <li>**Actively participate** in class discussions and demonstrate **intellectual curiosity**.</li>
                <li>Seek out **research opportunities** with professors whose work interests you.</li>
                <li>Strong relationships lead to **compelling letters of recommendation**, which are **vital** for medical school applications.</li>
                </ul>
            </div>
            </div>
        </InfoCard>
      )}
      
      <InfoCard title="Counselor Information & College Visits">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Connect with an Admissions Counselor</h3>
            {counselorInfo && counselorInfo.name !== 'N/A' ? (
              <div className="space-y-3 text-gray-300">
                <p className="font-semibold text-lg text-white">{counselorInfo.name}</p>
                {counselorInfo.email && counselorInfo.email !== 'N/A' && (
                  <a href={`mailto:${counselorInfo.email}`} className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                    {counselorInfo.email}
                  </a>
                )}
                {counselorInfo.phone && counselorInfo.phone !== 'N/A' && (
                  <a href={`tel:${counselorInfo.phone}`} className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                    {counselorInfo.phone}
                  </a>
                )}
                <button
                    onClick={() => setShowContactForm(prev => !prev)}
                    className="mt-4 w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                    {showContactForm ? 'Hide Form' : 'Contact Counselor'}
                </button>
              </div>
            ) : (
              <p className="text-gray-400">General admissions contact info not available.</p>
            )}

            {showContactForm && counselorInfo && counselorInfo.name !== 'N/A' && (
                <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                    <h4 className="text-xl font-bold text-white mb-4">Send a Message to {counselorInfo.name}</h4>
                    <form onSubmit={handleContactFormSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="your-name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                            <input
                                type="text"
                                id="your-name"
                                value={contactFormName}
                                onChange={(e) => setContactFormName(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                required
                                aria-label="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="your-email" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
                            <input
                                type="email"
                                id="your-email"
                                value={contactFormEmail}
                                onChange={(e) => setContactFormEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                required
                                aria-label="Your Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="message-counselor" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                            <textarea
                                id="message-counselor"
                                rows={4}
                                value={contactFormMessage}
                                onChange={(e) => setContactFormMessage(e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 text-white placeholder-gray-400 rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                required
                                aria-label="Message to Counselor"
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowContactForm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-600/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Upcoming Visits</h3>
            <div className="space-y-4">
              {Array.isArray(upcomingVisits) && upcomingVisits.length > 0 ? upcomingVisits.map((visit: CollegeVisit, i: number) => (
                <div key={i} className="p-4 bg-black/20 rounded-lg">
                  <p className="font-semibold text-gray-200">{visit.date}</p>
                  <p className="text-sm text-gray-300 mt-1">{visit.description}</p>
                  {visit.link && visit.link !== 'N/A' && (
                     <a href={visit.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors">
                      Learn More &rarr;
                    </a>
                  )}
                </div>
              )) : (
                <p className="text-center py-4 text-gray-400">No upcoming visits listed. Check the college's website for updates.</p>
              )}
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-500/20 text-yellow-100 rounded-lg text-center text-sm border border-yellow-500/30" role="alert">
        <p className="font-semibold flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Important Disclaimer:
        </p>
        <p className="mt-1">
          The information provided above is AI-generated and for informational purposes only. Please always verify all details,
          including admission requirements, deadlines, and costs, directly with the official college or university website.
        </p>
      </div>
    </div>
  );
};

export default CollegeInfoDisplay;