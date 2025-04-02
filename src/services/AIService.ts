
import { supabase } from '@/integrations/supabase/client';
import { MatchResult } from '@/components/AnalysisResult';

export interface ResumeData {
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
}

export interface JobData {
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
}

export const parseResume = async (resumeFile: File): Promise<ResumeData> => {
  console.log('Parsing resume:', resumeFile.name);
  
  // Read the file content
  const fileContent = await readFileAsText(resumeFile);
  
  try {
    // Call the parse-resume edge function
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { fileContent, fileName: resumeFile.name }
    });
    
    if (error) {
      console.error('Error parsing resume:', error);
      throw new Error(`Error parsing resume: ${error.message}`);
    }
    
    return data as ResumeData;
  } catch (error) {
    console.error('Error calling parse-resume function:', error);
    throw error;
  }
};

export const parseJobDescription = async (jobDescription: string): Promise<JobData> => {
  console.log('Parsing job description');
  
  try {
    // Call the parse-job edge function
    const { data, error } = await supabase.functions.invoke('parse-job', {
      body: { jobDescription }
    });
    
    if (error) {
      console.error('Error parsing job description:', error);
      throw new Error(`Error parsing job description: ${error.message}`);
    }
    
    return data as JobData;
  } catch (error) {
    console.error('Error calling parse-job function:', error);
    throw error;
  }
};

export const analyzeMatch = async (resumeData: ResumeData, jobData: JobData): Promise<MatchResult> => {
  console.log('Analyzing match between resume and job');
  
  try {
    // Call the analyze-match edge function
    const { data, error } = await supabase.functions.invoke('analyze-match', {
      body: { resumeData, jobData }
    });
    
    if (error) {
      console.error('Error analyzing match:', error);
      throw new Error(`Error analyzing match: ${error.message}`);
    }
    
    return data as MatchResult;
  } catch (error) {
    console.error('Error calling analyze-match function:', error);
    throw error;
  }
};

export const uploadResume = async (userId: string, resumeFile: File): Promise<string> => {
  const timestamp = Date.now();
  const filePath = `${userId}/${timestamp}_${resumeFile.name.replace(/\s+/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(filePath, resumeFile, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Error uploading resume:', error);
    throw new Error(`Error uploading resume: ${error.message}`);
  }
  
  const { data: urlData } = await supabase.storage
    .from('resumes')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
  
  return urlData?.signedUrl || '';
};

// Save analysis to user history
export const saveAnalysis = async (
  userId: string, 
  jobTitle: string, 
  matchResult: MatchResult, 
  resumeFile: File, 
  resumeData: ResumeData,
  jobData: JobData,
  jobDescription: string
): Promise<string> => {
  console.log('Saving analysis to history for user:', userId);
  
  // Upload resume file to Storage
  let resumeUrl = '';
  try {
    resumeUrl = await uploadResume(userId, resumeFile);
  } catch (error) {
    console.error('Resume upload failed but continuing with analysis save:', error);
  }
  
  try {
    // Call the save-analysis edge function
    const { data, error } = await supabase.functions.invoke('save-analysis', {
      body: {
        userId,
        jobTitle,
        matchResult,
        resumeData,
        jobData,
        jobDescription,
        resumeUrl
      }
    });
    
    if (error) {
      console.error('Error saving analysis:', error);
      throw new Error(`Error saving analysis: ${error.message}`);
    }
    
    return data.analysisId;
  } catch (error) {
    console.error('Error calling save-analysis function:', error);
    throw error;
  }
};

// Get user's analysis history
export const getAnalysisHistory = async (userId: string): Promise<any[]> => {
  console.log('Fetching analysis history for user:', userId);
  
  try {
    // Call the get-analysis-history edge function
    const { data, error } = await supabase.functions.invoke('get-analysis-history', {
      body: {},
      query: { userId }
    });
    
    if (error) {
      console.error('Error fetching analysis history:', error);
      throw new Error(`Error fetching analysis history: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error calling get-analysis-history function:', error);
    throw error;
  }
};

// Get a specific analysis by ID
export const getAnalysisDetail = async (analysisId: string): Promise<any> => {
  console.log('Fetching analysis detail for ID:', analysisId);
  
  try {
    // Call the get-analysis-detail edge function
    const { data, error } = await supabase.functions.invoke('get-analysis-detail', {
      body: {},
      query: { analysisId }
    });
    
    if (error) {
      console.error('Error fetching analysis detail:', error);
      throw new Error(`Error fetching analysis detail: ${error.message}`);
    }
    
    return data || null;
  } catch (error) {
    console.error('Error calling get-analysis-detail function:', error);
    throw error;
  }
};

// Helper function to read file content as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
