
import React from 'react';
import type { CollegeInfo } from '../types';

interface ComparisonDisplayProps {
  college1: CollegeInfo;
  college2: CollegeInfo;
  onClear: () => void;
}

const formatCurrency = (value: number) => {
  return value > 0 ? `$${value.toLocaleString()}` : 'N/A';
};

const ComparisonRow: React.FC<{ label: string; value1: React.ReactNode; value2: React.ReactNode; isHeader?: boolean }> = ({ label, value1, value2, isHeader = false }) => {
  const baseClasses = "px-4 py-3";
  const headerClasses = "font-extrabold text-2xl text-white";
  const labelClasses = "font-semibold text-blue-200 text-right";
  const valueClasses = "text-white";

  return (
    <>
      <div className={`${baseClasses} ${isHeader ? '' : labelClasses} border-b border-white/10`}>{!isHeader && label}</div>
      <div className={`${baseClasses} ${isHeader ? headerClasses : valueClasses} border-b border-white/10 text-center`}>{value1}</div>
      <div className={`${baseClasses} ${isHeader ? headerClasses : valueClasses} border-b border-white/10 text-center`}>{value2}</div>
    </>
  );
};

const ComparisonDisplay: React.FC<ComparisonDisplayProps> = ({ college1, college2, onClear }) => {
    const getLatestCareerInfo = (college: CollegeInfo) => {
        return Array.isArray(college.careerOutcomes) && college.careerOutcomes.length > 0
            ? [...college.careerOutcomes].sort((a, b) => parseInt(b.year) - parseInt(a.year))[0]
            : null;
    };

    const getPreMedInfo = (college: CollegeInfo): { preMedTrack: React.ReactNode; mcatPrep: React.ReactNode } => {
        if (!Array.isArray(college.academicTracks) || college.academicTracks.length === 0) {
            return { preMedTrack: 'N/A', mcatPrep: 'N/A' };
        }

        const preMedTracks = college.academicTracks.filter(track =>
            track.major.toLowerCase().includes('pre-med') ||
            track.major.toLowerCase().includes('pre-medical') ||
            track.description.toLowerCase().includes('pre-med') ||
            track.description.toLowerCase().includes('pre-medical') ||
            track.major.toLowerCase().includes('health science')
        );

        if (preMedTracks.length === 0) {
            return { preMedTrack: 'No specific track found', mcatPrep: 'General science curriculum provides foundation.' };
        }

        const preMedTrackNames = preMedTracks.map(t => t.major).join(', ') || 'N/A';

        let mcatPrepInfo: React.ReactNode = 'N/A';
        for (const track of preMedTracks) {
            if (track.description.toLowerCase().includes('mcat')) {
                const sentences = track.description.split('. ');
                const mcatSentence = sentences.find(s => s.toLowerCase().includes('mcat'));
                if (mcatSentence) {
                    mcatPrepInfo = mcatSentence.trim() + '.';
                    break;
                }
            }
        }
        
        if (mcatPrepInfo === 'N/A' && preMedTracks.length > 0) {
            mcatPrepInfo = 'Offers advising and resources for MCAT preparation.';
        }

        return {
            preMedTrack: preMedTrackNames,
            mcatPrep: mcatPrepInfo
        };
    };
    
    const latestCareer1 = getLatestCareerInfo(college1);
    const latestCareer2 = getLatestCareerInfo(college2);

    const avgAnnualCost1 = college1.costOfAttendance.inStateTuition + college1.costOfAttendance.roomAndBoard + college1.costOfAttendance.books + college1.costOfAttendance.food;
    const avgAnnualCost2 = college2.costOfAttendance.inStateTuition + college2.costOfAttendance.roomAndBoard + college2.costOfAttendance.books + college2.costOfAttendance.food;

    const preMedInfo1 = getPreMedInfo(college1);
    const preMedInfo2 = getPreMedInfo(college2);


  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b-2 border-blue-400/50 pb-3">
        <h2 className="text-3xl font-bold text-white">College Comparison</h2>
        <button
          onClick={onClear}
          className="mt-2 sm:mt-0 px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 transform hover:scale-105"
        >
          Clear Comparison & Go Back
        </button>
      </div>

      <div className="grid grid-cols-[1fr,2fr,2fr] gap-x-4">
        {/* Header */}
        <ComparisonRow
          label=""
          value1={college1.collegeName}
          value2={college2.collegeName}
          isHeader
        />

        {/* --- Scorecard --- */}
        <div className="col-span-3 text-lg font-bold text-purple-300 pt-6 pb-2">Key Metrics</div>
        <ComparisonRow label="Graduation Rate" value1={`${college1.fourYearGraduationRate}%`} value2={`${college2.fourYearGraduationRate}%`} />
        <ComparisonRow label="Avg. Annual Cost" value1={formatCurrency(avgAnnualCost1)} value2={formatCurrency(avgAnnualCost2)} />
        <ComparisonRow label="Median Earnings" value1={latestCareer1?.medianStartingSalary || 'N/A'} value2={latestCareer2?.medianStartingSalary || 'N/A'} />
        <ComparisonRow label="Acceptance Rate" value1={`${college1.acceptanceRate}%`} value2={`${college2.acceptanceRate}%`} />
        <ComparisonRow label="Student Population" value1={college1.studentPopulation} value2={college2.studentPopulation} />
        <ComparisonRow label="Student:Faculty Ratio" value1={college1.otherDetails.studentFacultyRatio} value2={college2.otherDetails.studentFacultyRatio} />
        
        {/* --- Admissions --- */}
        <div className="col-span-3 text-lg font-bold text-purple-300 pt-6 pb-2">Admissions</div>
        <ComparisonRow label="Average GPA" value1={college1.admissionRequirements.avgGpa} value2={college2.admissionRequirements.avgGpa} />
        <ComparisonRow label="SAT Range" value1={college1.admissionRequirements.satRange} value2={college2.admissionRequirements.satRange} />
        <ComparisonRow label="ACT Range" value1={college1.admissionRequirements.actRange} value2={college2.admissionRequirements.actRange} />
        <ComparisonRow label="Test Policy" value1={college1.admissionRequirements.testPolicy} value2={college2.admissionRequirements.testPolicy} />

        {/* --- Academics & Pre-Med --- */}
        <div className="col-span-3 text-lg font-bold text-purple-300 pt-6 pb-2">Academics & Pre-Med</div>
        <ComparisonRow label="Pre-Med Concentration" value1={preMedInfo1.preMedTrack} value2={preMedInfo2.preMedTrack} />
        <ComparisonRow label="MCAT Preparation" value1={preMedInfo1.mcatPrep} value2={preMedInfo2.mcatPrep} />

        {/* --- Recruitment --- */}
        <div className="col-span-3 text-lg font-bold text-purple-300 pt-6 pb-2">Recruitment</div>
        <ComparisonRow label="Top Recruiters" value1={latestCareer1?.topRecruiters?.slice(0, 3).join(', ') || 'N/A'} value2={latestCareer2?.topRecruiters?.slice(0, 3).join(', ') || 'N/A'} />
        <ComparisonRow label="Top Local Recruiters" value1={latestCareer1?.localRecruiters?.slice(0, 3).join(', ') || 'N/A'} value2={latestCareer2?.localRecruiters?.slice(0, 3).join(', ') || 'N/A'} />
        
        {/* --- Deadlines --- */}
        <div className="col-span-3 text-lg font-bold text-purple-300 pt-6 pb-2">Application Deadlines</div>
        <ComparisonRow label="Regular Decision" value1={college1.otherDetails.regularDecisionDeadline} value2={college2.otherDetails.regularDecisionDeadline} />
        <ComparisonRow label="Early Action" value1={college1.otherDetails.earlyActionDeadline} value2={college2.otherDetails.earlyActionDeadline} />
        <ComparisonRow label="Early Decision" value1={college1.otherDetails.earlyDecisionDeadline} value2={college2.otherDetails.earlyDecisionDeadline} />

        {/* --- Costs --- */}
        <div className="col-span-3 text-lg font-bold text-purple-300 pt-6 pb-2">Cost Breakdown (In-State)</div>
        <ComparisonRow label="Tuition" value1={formatCurrency(college1.costOfAttendance.inStateTuition)} value2={formatCurrency(college2.costOfAttendance.inStateTuition)} />
        <ComparisonRow label="Room & Board" value1={formatCurrency(college1.costOfAttendance.roomAndBoard)} value2={formatCurrency(college2.costOfAttendance.roomAndBoard)} />
        <ComparisonRow label="Books & Food" value1={formatCurrency(college1.costOfAttendance.books + college1.costOfAttendance.food)} value2={formatCurrency(college2.costOfAttendance.books + college2.costOfAttendance.food)} />
      </div>
    </div>
  );
};

export default ComparisonDisplay;