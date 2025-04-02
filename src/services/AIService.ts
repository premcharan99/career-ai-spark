
import { MatchResult } from '@/components/AnalysisResult';

// This service will be replaced with actual API calls to Supabase Edge Functions
// that will handle calls to Gemini and OpenAI APIs

interface ResumeData {
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
}

interface JobData {
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
}

export const parseResume = async (resumeFile: File): Promise<ResumeData> => {
  console.log('Parsing resume:', resumeFile.name);
  
  // In the real implementation, this would:
  // 1. Upload the resume to Supabase Storage
  // 2. Call a Supabase Edge Function that uses Gemini API to parse the resume
  // 3. Return structured data from the resume
  
  // For now, return mock data
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Responsive Design', 'Redux'],
    experience: [
      'Frontend Developer at XYZ Corp (2020-Present)',
      'Junior Developer at ABC Inc (2018-2020)'
    ],
    education: [
      'Bachelor of Science in Computer Science, University of Technology (2018)'
    ],
    certifications: [
      'AWS Certified Developer',
      'Google Cloud Professional Developer'
    ]
  };
};

export const parseJobDescription = async (jobDescription: string): Promise<JobData> => {
  console.log('Parsing job description');
  
  // In the real implementation, this would:
  // 1. Call a Supabase Edge Function that uses Gemini API to parse the job description
  // 2. Return structured data from the job description
  
  // For now, return mock data
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    preferredSkills: ['TypeScript', 'Next.js', 'GraphQL'],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with the design team',
      'Optimize applications for performance'
    ],
    requirements: [
      '3+ years of experience with React',
      'Proficient in JavaScript and HTML/CSS',
      'Experience with state management libraries'
    ]
  };
};

export const analyzeMatch = async (resumeData: ResumeData, jobData: JobData): Promise<MatchResult> => {
  console.log('Analyzing match between resume and job');
  
  // In the real implementation, this would:
  // 1. Call a Supabase Edge Function that uses OpenAI API to analyze the match
  // 2. Calculate match score, identify matching and missing skills, and generate suggestions
  
  // For now, simulate the analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Calculate matching skills
  const matchingSkills = resumeData.skills.filter(skill => 
    jobData.requiredSkills.includes(skill) || jobData.preferredSkills.includes(skill)
  );
  
  // Calculate missing skills
  const missingSkills = [...jobData.requiredSkills, ...jobData.preferredSkills].filter(
    skill => !resumeData.skills.includes(skill)
  );
  
  // Calculate match score (simple algorithm for mock)
  const requiredSkillsMatch = jobData.requiredSkills.filter(
    skill => resumeData.skills.includes(skill)
  ).length / jobData.requiredSkills.length;
  
  const preferredSkillsMatch = jobData.preferredSkills.filter(
    skill => resumeData.skills.includes(skill)
  ).length / jobData.preferredSkills.length;
  
  // Weight required skills more heavily
  const overallScore = Math.floor((requiredSkillsMatch * 0.7 + preferredSkillsMatch * 0.3) * 100);
  
  return {
    overallScore,
    matchingSkills,
    missingSkills,
    suggestions: [
      'Add more details about your React experience',
      'Highlight any Next.js projects you\'ve worked on',
      'Include metrics and achievements in your experience section',
      'Consider adding GraphQL to your skill set'
    ],
    improved: 'Your optimized resume would focus more on your React projects, include specific metrics of success, and highlight your experience with state management libraries like Redux.'
  };
};

// Save analysis to user history
export const saveAnalysis = async (
  userId: string, 
  jobTitle: string, 
  matchResult: MatchResult, 
  resumeFile: File, 
  jobDescription: string
): Promise<string> => {
  console.log('Saving analysis to history for user:', userId);
  
  // In the real implementation, this would:
  // 1. Store the analysis result in Supabase
  // 2. Link it to the user's account
  
  // For now, return a mock analysis ID
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return 'analysis-' + Date.now().toString();
};

// Get user's analysis history
export const getAnalysisHistory = async (userId: string): Promise<any[]> => {
  console.log('Fetching analysis history for user:', userId);
  
  // In the real implementation, this would:
  // 1. Fetch the user's analysis history from Supabase
  
  // For now, return mock history
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'analysis-1',
      date: new Date().toISOString(),
      jobTitle: 'Senior Frontend Developer',
      matchScore: 85,
      matchResult: {
        overallScore: 85,
        matchingSkills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
        missingSkills: ['Next.js', 'GraphQL'],
        suggestions: ['Add Next.js experience', 'Learn GraphQL'],
        improved: 'Focus on React experience and add Next.js projects.'
      }
    },
    {
      id: 'analysis-2',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      jobTitle: 'Full Stack Developer',
      matchScore: 72,
      matchResult: {
        overallScore: 72,
        matchingSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
        missingSkills: ['Node.js', 'MongoDB', 'Express'],
        suggestions: ['Add backend experience', 'Learn MongoDB'],
        improved: 'Highlight any backend projects you\'ve worked on.'
      }
    }
  ];
};
