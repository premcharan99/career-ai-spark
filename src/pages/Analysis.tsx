
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PageLayout from '@/components/PageLayout';
import AnalysisForm from '@/components/AnalysisForm';
import AnalysisResult, { MatchResult } from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { 
  parseResume, 
  parseJobDescription, 
  analyzeMatch, 
  saveAnalysis, 
  ResumeData,
  JobData
} from '@/services/AIService';

const Analysis = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [parsedResumeData, setParsedResumeData] = useState<ResumeData | null>(null);
  const [parsedJobData, setParsedJobData] = useState<JobData | null>(null);
  const [analysisAllowed, setAnalysisAllowed] = useState(true);
  const [remainingAnalyses, setRemainingAnalyses] = useState({ used: 0, limit: 15, remaining: 15 });

  useEffect(() => {
    if (profile) {
      const dailyLimit = 15;
      const canPerformAnalysis = profile.analyses_used < dailyLimit;
      setAnalysisAllowed(canPerformAnalysis);
      
      setRemainingAnalyses({
        used: profile.analyses_used,
        limit: dailyLimit,
        remaining: Math.max(0, dailyLimit - profile.analyses_used)
      });
      
      if (!canPerformAnalysis) {
        toast({
          title: "Daily analysis limit reached",
          description: `You've used all ${dailyLimit} analyses for today. Try again tomorrow.`,
          variant: "destructive",
        });
      }
    }
  }, [profile]);

  const handleResumeSelect = (file: File) => {
    setResume(file);
    toast({
      title: "Resume uploaded",
      description: "Your resume has been uploaded successfully",
    });
  };

  const handleResumeTextEntered = (text: string) => {
    setResumeText(text);
  };

  const extractJobTitle = (description: string): string => {
    // A simple function to extract a job title from a job description
    const firstLine = description.split('\n')[0].trim();
    if (firstLine.length < 50) return firstLine;
    
    const jobTitleMatch = description.match(/job title:?\s*([^\n]+)/i);
    if (jobTitleMatch && jobTitleMatch[1]) {
      return jobTitleMatch[1].trim();
    }
    
    const positionMatch = description.match(/position:?\s*([^\n]+)/i);
    if (positionMatch && positionMatch[1]) {
      return positionMatch[1].trim();
    }
    
    const roleMatch = description.match(/role:?\s*([^\n]+)/i);
    if (roleMatch && roleMatch[1]) {
      return roleMatch[1].trim();
    }
    
    return 'Job Position';
  };

  const handleJobDescriptionSubmit = async (description: string) => {
    if (!resume) {
      toast({
        title: "Resume required",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to perform an analysis",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    if (!analysisAllowed) {
      toast({
        title: "Daily analysis limit reached",
        description: `You've used all ${remainingAnalyses.limit} analyses for today. Try again tomorrow.`,
        variant: "destructive",
      });
      return;
    }

    setJobDescription(description);
    setIsAnalyzing(true);
    const extractedTitle = extractJobTitle(description);
    setJobTitle(extractedTitle);

    try {
      toast({
        title: "Analysis started",
        description: "We're processing your resume and job description",
      });
      
      // Step 1: Parse resume
      const resumeData = await parseResume(resume);
      setParsedResumeData(resumeData);
      
      // Step 2: Parse job description
      const jobData = await parseJobDescription(description);
      setParsedJobData(jobData);
      
      // Step 3: Analyze match
      const analysisResult = await analyzeMatch(resumeData, jobData);
      setResult(analysisResult);
      
      // Step 4: Save analysis to history
      if (user) {
        await saveAnalysis(
          user.id, 
          extractedTitle, 
          analysisResult, 
          resume, 
          resumeData, 
          jobData, 
          description
        );
        
        // Update the user's profile to reflect the new analysis
        await updateProfile();
      }

      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed against the job description",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setResume(null);
    setResumeText('');
    setJobDescription('');
    setResult(null);
    setJobTitle('');
    setParsedResumeData(null);
    setParsedJobData(null);
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-8">
          {result ? `Analysis Results: ${jobTitle}` : 'New Resume Analysis'}
        </h1>
        
        {/* Analysis Usage Information */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            You have used <span className="font-semibold">{remainingAnalyses.used}</span> of your <span className="font-semibold">{remainingAnalyses.limit}</span> analyses today.
            <span className="ml-2 font-semibold">{remainingAnalyses.remaining}</span> analyses remaining today.
          </p>
        </div>
        
        {(!result || isAnalyzing) ? (
          <div className="max-w-4xl mx-auto">
            <AnalysisForm 
              onResumeSelected={handleResumeSelect}
              onResumeTextEntered={handleResumeTextEntered}
              onJobDescriptionSubmit={handleJobDescriptionSubmit}
              isLoading={isAnalyzing}
              disabled={!analysisAllowed}
            />
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <Button variant="outline" onClick={handleNewAnalysis}>
                Start New Analysis
              </Button>
            </div>
            
            <AnalysisResult result={result} />
            
            <div className="mt-8 flex justify-end">
              <Button 
                variant="outline" 
                className="mr-4"
                onClick={() => navigate('/history')}
              >
                View Analysis History
              </Button>
              <Button 
                variant="default" 
                onClick={handleNewAnalysis}
              >
                Start New Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Analysis;
