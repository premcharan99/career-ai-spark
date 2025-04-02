
import { supabase } from '@/integrations/supabase/client';
import { MatchResult } from '@/components/AnalysisResult';
import { toast } from '@/components/ui/use-toast';

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
  
  try {
    // Read the file content
    const fileContent = await readFileAsText(resumeFile);
    
    // Call the parse-resume edge function
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { fileContent, fileName: resumeFile.name }
    });
    
    if (error) {
      console.error('Error parsing resume:', error);
      throw new Error(`Error parsing resume: ${error.message}`);
    }
    
    if (data.error) {
      console.error('Resume parsing failed:', data.error);
      throw new Error(data.error);
    }
    
    console.log('Resume parsed successfully:', data);
    
    return data as ResumeData;
  } catch (error: any) {
    console.error('Error calling parse-resume function:', error);
    toast({
      title: "Resume parsing failed",
      description: error.message || "There was an error parsing your resume. Please try a different file.",
      variant: "destructive",
    });
    throw error;
  }
};

export const parseJobDescription = async (jobDescription: string): Promise<JobData> => {
  console.log('Parsing job description');
  
  try {
    if (!jobDescription || jobDescription.trim().length < 50) {
      throw new Error('Job description is too short. Please provide more details.');
    }
    
    // Call the parse-job edge function
    const { data, error } = await supabase.functions.invoke('parse-job', {
      body: { jobDescription }
    });
    
    if (error) {
      console.error('Error parsing job description:', error);
      throw new Error(`Error parsing job description: ${error.message}`);
    }
    
    console.log('Job description parsed successfully:', data);
    
    return data as JobData;
  } catch (error: any) {
    console.error('Error calling parse-job function:', error);
    toast({
      title: "Job parsing failed",
      description: error.message || "There was an error parsing the job description. Please try again.",
      variant: "destructive",
    });
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
    
    console.log('Match analysis completed successfully:', data);
    
    return data as MatchResult;
  } catch (error: any) {
    console.error('Error calling analyze-match function:', error);
    toast({
      title: "Analysis failed",
      description: error.message || "There was an error analyzing the match. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const uploadResume = async (userId: string, resumeFile: File): Promise<string> => {
  try {
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}_${resumeFile.name.replace(/\s+/g, '_')}`;
    
    // Check if the storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'resumes')) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('resumes', {
        public: false,
      });
      
      if (createError) {
        console.error('Error creating storage bucket:', createError);
        throw new Error(`Error creating storage bucket: ${createError.message}`);
      }
    }
    
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
    
    const { data: urlData, error: urlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
    
    if (urlError) {
      console.error('Error generating signed URL:', urlError);
      throw new Error(`Error generating signed URL: ${urlError.message}`);
    }
    
    return urlData?.signedUrl || '';
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    return '';
  }
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
  } catch (error: any) {
    console.error('Error calling save-analysis function:', error);
    toast({
      title: "Saving analysis failed",
      description: error.message || "There was an error saving the analysis. Your results are still available.",
      variant: "destructive",
    });
    throw error;
  }
};

// Get user's analysis history
export const getAnalysisHistory = async (userId: string): Promise<any[]> => {
  console.log('Fetching analysis history for user:', userId);
  
  try {
    // Call the get-analysis-history edge function
    const { data, error } = await supabase.functions.invoke('get-analysis-history', {
      body: { userId }
    });
    
    if (error) {
      console.error('Error fetching analysis history:', error);
      throw new Error(`Error fetching analysis history: ${error.message}`);
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error calling get-analysis-history function:', error);
    toast({
      title: "Fetching history failed",
      description: error.message || "There was an error fetching your analysis history. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

// Get a specific analysis by ID
export const getAnalysisDetail = async (analysisId: string): Promise<any> => {
  console.log('Fetching analysis detail for ID:', analysisId);
  
  try {
    // Call the get-analysis-detail edge function
    const { data, error } = await supabase.functions.invoke('get-analysis-detail', {
      body: { analysisId }
    });
    
    if (error) {
      console.error('Error fetching analysis detail:', error);
      throw new Error(`Error fetching analysis detail: ${error.message}`);
    }
    
    return data || null;
  } catch (error: any) {
    console.error('Error calling get-analysis-detail function:', error);
    toast({
      title: "Fetching analysis detail failed",
      description: error.message || "There was an error fetching the analysis details. Please try again.",
      variant: "destructive",
    });
    return null;
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
