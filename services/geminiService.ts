
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Correctly import CollegeInfo as a named export.
import { CollegeInfo } from '../types';

const getCollegeInfo = async (collegeName: string, majorInterest?: string): Promise<CollegeInfo> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Condensed prompt. Rely on the comprehensive schema for detailed structure.
  const prompt = `Act as an expert college admissions coach. For the university "${collegeName}", provide comprehensive, detailed, and up-to-date information for high school students. 
This includes:
- General Information: official website, general phone number, a list of all awards/degrees offered, total and undergraduate student population, and campus housing availability.
- Admission requirements (GPA, test scores, essay prompts)
- Cost of attendance (tuition, room & board, books, food, travel, international fees)
- Available scholarships (institutional and third-party)
- Academic tracks (focus on majors, concentrations, and programs related to "${majorInterest}" if specified, otherwise popular pre-med or health-science tracks)
- Student life & clubs (categorized)
- Student opportunities (research, volunteering, career development)
- Nearby amenities (restaurants, cinemas, hangouts with distance and transport info)
- Campus commute options (summary and free services)
- Career outcomes stats for the most recent year and the two previous years, including placement/employment rate, median starting salary, top national recruiters, a separate list of local/in-state recruiters, and the data year for each.
- FAANG/major tech company recruitment history (presence, known companies, summary of opportunities)
- Notable alumni (name, graduation year, title, achievement)
- Key application deadlines (Regular Decision, Early Action, Early Decision)
- General contact info for admissions counselor
- Upcoming college visits (virtual/in-person)
- Official application portal URL
- A very short introductory note about the college
- Four-year graduation rate
- School type (e.g., 'Private Nonprofit', 'Public') and setting (e.g., 'Urban', 'Suburban', 'Rural').
- Princeton Review status (if listed, include summary, pros, and cons; otherwise state not listed).

Ensure all data is accurate and fits the provided JSON schema. Use "N/A" or empty arrays for unavailable or irrelevant data.`;

  const collegeInfoSchema = {
    type: Type.OBJECT,
    properties: {
      collegeName: { type: Type.STRING, description: "The official name of the college/university." },
      location: { type: Type.STRING, description: "City and State where the college is located." },
      website: { type: Type.STRING, description: "Official college website URL, beginning with http or https." },
      generalPhone: { type: Type.STRING, description: "General information phone number." },
      schoolType: { type: Type.STRING, description: "The type of institution (e.g., 'Private Nonprofit', 'Public')." },
      setting: { type: Type.STRING, description: "The campus setting (e.g., 'Urban', 'Suburban', 'Rural')." },
      awardsOffered: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of all degrees and certificates offered (e.g., 'Bachelor's degree', 'Master's degree', 'Doctor's degree - research/scholarship')." },
      campusHousing: { type: Type.BOOLEAN, description: "True if on-campus housing is available for students." },
      studentPopulation: { type: Type.STRING, description: "Total student population with undergraduate count in parentheses (e.g., '15,081 (6,818 undergraduate)')." },
      acceptanceRate: { type: Type.NUMBER, description: "The most recent undergraduate acceptance rate as a percentage (e.g., 15 for 15%)." },
      fourYearGraduationRate: { type: Type.NUMBER, description: "The percentage of students who graduate within four years (e.g., 85 for 85%)." },
      admissionRequirements: {
        type: Type.OBJECT,
        properties: {
          avgGpa: { type: Type.STRING, description: "Average or recommended high school GPA for admitted students." },
          minimumGpa: { type: Type.STRING, description: "Minimum high school GPA for consideration, if specified." },
          satRange: { type: Type.STRING, description: "The 25th-75th percentile range for SAT scores." },
          actRange: { type: Type.STRING, description: "The 25th-75th percentile range for ACT scores." },
          testPolicy: { type: Type.STRING, description: "The college's policy on SAT/ACT scores (e.g., 'Test Optional', 'Test Blind', 'Test Required')." },
          essayRequired: { type: Type.BOOLEAN, description: "Whether an application essay is required." },
          essayPrompts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "A title or category for the essay prompt (e.g., 'Personal Statement', 'Why Us')." },
                text: { type: Type.STRING, description: "The full text of the essay prompt." },
              },
              required: ["title", "text"],
            },
            description: "List of common or required essay prompts, each with a title and the prompt text."
          },
        },
        required: ["avgGpa", "minimumGpa", "satRange", "actRange", "testPolicy", "essayRequired", "essayPrompts"],
      },
      costOfAttendance: {
        type: Type.OBJECT,
        properties: {
          inStateTuition: { type: Type.NUMBER, description: "Annual tuition and fees for in-state students." },
          outOfStateTuition: { type: Type.NUMBER, description: "Annual tuition and fees for out-of-state students." },
          internationalTuition: { type: Type.NUMBER, description: "Annual tuition and fees for international students on a visa." },
          roomAndBoard: { type: Type.NUMBER, description: "Estimated annual cost for on-campus housing and meal plans." },
          books: { type: Type.NUMBER, description: "Estimated annual cost for books and supplies." },
          food: { type: Type.NUMBER, description: "Estimated annual cost for food, if separate from room and board, or additional food expenses." },
          travelExpenses: { type: Type.NUMBER, description: "Estimated annual travel expenses." },
        },
        required: ["inStateTuition", "outOfStateTuition", "internationalTuition", "roomAndBoard", "books", "food", "travelExpenses"],
      },
      scholarships: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the scholarship." },
            amount: { type: Type.STRING, description: "Scholarship amount or range (e.g., '$5,000' or 'Full Tuition')." },
            description: { type: Type.STRING, description: "A brief description of the scholarship and its explicit eligibility criteria." },
            duration: { type: Type.STRING, description: "Duration of the scholarship (e.g., '4 Years', 'Freshman Year Only', 'Renewable')." },
            type: { type: Type.STRING, description: "The type of scholarship, e.g., 'Institutional' or 'Third-Party'." },
          },
          required: ["name", "amount", "description", "duration", "type"],
        },
        description: "A list of notable institutional and third-party scholarships available to undergraduate students."
      },
      academicTracks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            major: { type: Type.STRING, description: "Name of the major or academic program." },
            description: { type: Type.STRING, description: "A brief description of the track, its strengths, and relevant resources." },
          },
          required: ["major", "description"],
        },
        description: "A list of academic majors, tracks, or programs relevant to the user's interest."
      },
      otherDetails: {
        type: Type.OBJECT,
        properties: {
          regularDecisionDeadline: { type: Type.STRING, description: "The Regular Decision application deadline (e.g., 'January 1st')." },
          earlyDecisionDeadline: { type: Type.STRING, description: "The Early Decision application deadline, if applicable (e.g., 'November 1st'). Use 'N/A' if not offered." },
          earlyActionDeadline: { type: Type.STRING, description: "The Early Action application deadline, if applicable (e.g., 'November 1st'). Use 'N/A' if not offered." },
          studentFacultyRatio: { type: Type.STRING, description: "The student-to-faculty ratio (e.g., '8:1')." }
        },
        required: ["regularDecisionDeadline", "earlyDecisionDeadline", "earlyActionDeadline", "studentFacultyRatio"],
      },
      clubs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the student club or organization." },
            category: { type: Type.STRING, description: "Category of the club (e.g., 'Sports', 'Arts', 'Academic', 'Social')." },
          },
          required: ["name", "category"],
        },
        description: "A list of popular and notable student clubs and activities."
      },
      counselorInfo: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Name of a contact person in the admissions office, or 'Admissions Office'." },
            email: { type: Type.STRING, description: "Contact email for admissions." },
            phone: { type: Type.STRING, description: "Contact phone number for admissions." },
        },
        required: ["name", "email", "phone"],
        description: "Contact information for the admissions office or a counselor."
      },
      upcomingVisits: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                date: { type: Type.STRING, description: "Date and time of the event (e.g., 'October 25, 2024, 2:00 PM PST')." },
                description: { type: Type.STRING, description: "Brief description of the visit or event (e.g., 'Virtual Campus Tour')." },
                link: { type: Type.STRING, description: "A URL to register or find more information." },
            },
            required: ["date", "description", "link"],
        },
        description: "A list of upcoming college visits or informational events."
      },
      studentOpportunities: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Name of the opportunity." },
                description: { type: Type.STRING, description: "Brief description of the opportunity." },
                location: { type: Type.STRING, description: "Category of the opportunity (e.g. 'On-Campus', 'Off-Campus', 'Remote'). Used for display purposes." },
                applicationTimeline: { type: Type.STRING, description: "When to apply (e.g. 'Fall Semester', 'Year-round')." },
                link: { type: Type.STRING, description: "A URL for more information." },
                type: { type: Type.STRING, description: "The type of opportunity, e.g., 'Research'." },
            },
            required: ["name", "description", "location", "applicationTimeline", "link", "type"],
        },
        description: "A list of notable student opportunities like research, volunteering, and career development."
      },
      nearbyPlaces: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Name of the place." },
                category: { type: Type.STRING, description: "Category (e.g., 'Restaurant', 'Cinema', 'Hangout')." },
                description: { type: Type.STRING, description: "Brief description of the place." },
                link: { type: Type.STRING, description: "Website or Maps link." },
                distanceFromCollege: { type: Type.STRING, description: "Approximate distance from campus (e.g. '0.5 miles')." },
                freeTransportAvailable: { type: Type.BOOLEAN, description: "True if the college provides free transport (shuttle/bus) to this specific location or area." },
            },
            required: ["name", "category", "description", "link", "distanceFromCollege", "freeTransportAvailable"],
        },
        description: "A list of popular nearby off-campus restaurants, cinema theaters, and hangout places."
      },
      campusCommute: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Overview of transportation options within the campus." },
          freeServices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of free transport services available (e.g. 'Campus Loop Bus', 'Night Safety Van')."
          }
        },
        required: ["summary", "freeServices"],
      },
      careerOutcomes: {
        type: Type.ARRAY,
        description: "A list of career outcome statistics for the last 3 years (most recent first).",
        items: {
            type: Type.OBJECT,
            properties: {
              placementRate: { type: Type.STRING, description: "Percentage of graduates employed or in further education within 6 months (e.g. '92%')." },
              medianStartingSalary: { type: Type.STRING, description: "Median starting salary of graduates for that year." },
              topRecruiters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of reputed national/international companies that hired graduates in that year." },
              localRecruiters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of local or in-state companies that hired graduates in that year." },
              year: { type: Type.STRING, description: "The year for which these statistics are valid (e.g. '2023')." }
            },
            required: ["placementRate", "medianStartingSalary", "topRecruiters", "localRecruiters", "year"]
        }
      },
      faangRecruitment: {
        type: Type.OBJECT,
        properties: {
          hasPresence: { type: Type.BOOLEAN, description: "True if there is a known history of FAANG/Big Tech recruitment on campus." },
          knownCompanies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of FAANG or major tech companies known to recruit." },
          recruitmentSummary: { type: Type.STRING, description: "Summary of the history of visits, internship opportunities, and hiring outcomes." }
        },
        required: ["hasPresence", "knownCompanies", "recruitmentSummary"]
      },
      famousAlumni: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the alumnus." },
            gradYear: { type: Type.STRING, description: "Year of graduation or 'N/A'." },
            currentTitle: { type: Type.STRING, description: "Current or most notable professional title." },
            achievement: { type: Type.STRING, description: "Brief description of their success or industry influence." },
          },
          required: ["name", "gradYear", "currentTitle", "achievement"],
        },
        description: "A list of notable alumni.",
      },
      applicationLink: { type: Type.STRING, description: "The official application portal URL for the college." }, 
      shortNote: { type: Type.STRING, description: "A very short (2-line max) introductory note about the college." }, 
      princetonReviewStatus: { 
        type: Type.OBJECT,
        properties: {
          isListed: { type: Type.BOOLEAN, description: "True if the college is listed in 'Princeton Review's The Best 329 Colleges', false otherwise." },
          summary: { type: Type.STRING, description: "A small summary about the college from the Princeton Review, or 'N/A' if not listed." }, 
          pros: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key advantages or positive aspects of the college, based on the Princeton Review. Empty if not listed or no specific pros mentioned."
          },
          cons: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key disadvantages or negative aspects of the college, based on the Princeton Review. Empty if not listed or no specific cons mentioned."
          },
        },
        required: ["isListed", "summary", "pros", "cons"], 
      },
    },
    required: [
      "collegeName", "location", "website", "generalPhone", "schoolType", "setting", "awardsOffered", "campusHousing", "studentPopulation", 
      "acceptanceRate", "fourYearGraduationRate", "admissionRequirements", "costOfAttendance", "scholarships", 
      "academicTracks", "otherDetails", "clubs", "counselorInfo", "upcomingVisits", "studentOpportunities", 
      "nearbyPlaces", "campusCommute", "careerOutcomes", "faangRecruitment", "famousAlumni", "applicationLink", 
      "shortNote", "princetonReviewStatus"
    ],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: collegeInfoSchema,
    },
  });
  
  const jsonText = response.text.trim();

  if (!jsonText) {
    throw new Error('Received an empty response from the AI.');
  }
  
  const result = JSON.parse(jsonText) as CollegeInfo;
  result.userInputMajor = majorInterest; // Attach the user input to the result
  return result;
};

export { getCollegeInfo };