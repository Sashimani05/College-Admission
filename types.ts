
export interface AdmissionRequirements {
  avgGpa: string;
  minimumGpa: string;
  satRange: string;
  actRange: string;
  testPolicy: string;
  essayRequired: boolean;
  essayPrompts: EssayPrompt[];
}

export interface EssayPrompt {
  title: string;
  text: string;
}

export interface CostOfAttendance {
  inStateTuition: number;
  outOfStateTuition: number;
  internationalTuition: number;
  roomAndBoard: number;
  books: number; // Added books cost
  food: number; // Added food cost
  travelExpenses: number; // Added travel expenses
}

export interface Scholarship {
  name: string;
  amount: string;
  description: string;
  duration: string;
  type: string;
}

export interface AcademicTrack { // Renamed from PreMedTrack
  major: string;
  description: string;
}

export interface OtherDetails {
  regularDecisionDeadline: string;
  earlyDecisionDeadline: string;
  earlyActionDeadline: string;
  studentFacultyRatio: string;
}

export interface Club {
  name: string;
  category: string;
}

export interface CounselorInfo {
  name: string;
  email: string;
  phone: string;
}

export interface CollegeVisit {
  date: string;
  description: string;
  link: string;
}

export interface StudentOpportunity {
  name: string;
  description: string;
  location: string;
  applicationTimeline: string;
  link: string;
  type: string;
}

export interface PrincetonReviewStatus {
  isListed: boolean;
  summary: string; // Renamed from 'note' to 'summary'
  pros: string[]; // Added pros
  cons: string[]; // Added cons
}

export interface NearbyPlace {
  name: string;
  category: string;
  description: string;
  link: string;
  distanceFromCollege: string; // Added distance
  freeTransportAvailable: boolean; // Added transport availability
}

export interface CampusCommute {
  summary: string;
  freeServices: string[];
}

export interface FaangRecruitment {
  hasPresence: boolean;
  knownCompanies: string[];
  recruitmentSummary: string;
}

export interface CareerOutcomes {
  placementRate: string;
  medianStartingSalary: string;
  topRecruiters: string[];
  localRecruiters: string[];
  year: string;
}

export interface Alumnus {
  name: string;
  gradYear: string;
  currentTitle: string;
  achievement: string;
}

export interface CollegeInfo {
  collegeName: string;
  location: string;
  website: string; // Added for general info
  generalPhone: string; // Added for general info
  schoolType: string; 
  setting: string;
  awardsOffered: string[]; // Added for general info
  campusHousing: boolean; // Added for general info
  studentPopulation: string; // Added for general info
  acceptanceRate: number;
  fourYearGraduationRate: number; 
  admissionRequirements: AdmissionRequirements;
  costOfAttendance: CostOfAttendance;
  scholarships: Scholarship[];
  academicTracks: AcademicTrack[];
  userInputMajor?: string;
  otherDetails: OtherDetails;
  clubs: Club[];
  counselorInfo: CounselorInfo;
  upcomingVisits: CollegeVisit[];
  studentOpportunities: StudentOpportunity[];
  nearbyPlaces: NearbyPlace[];
  campusCommute: CampusCommute;
  faangRecruitment: FaangRecruitment;
  careerOutcomes: CareerOutcomes[];
  famousAlumni: Alumnus[];
  applicationLink: string;
  shortNote: string;
  princetonReviewStatus: PrincetonReviewStatus;
}