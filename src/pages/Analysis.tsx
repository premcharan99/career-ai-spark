
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import PageLayout from '@/components/PageLayout';
import AnalysisForm from '@/components/AnalysisForm';
import AnalysisResult, { MatchResult } from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { parseResume, parseJobDescription, analyzeMatch, saveAnalysis } from '@/services/AIService';
import { getRemainingAnalyses } from '@/services/SubscriptionService';

const Analysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');

  const handleResumeSelect = (file: File) => {
    setResume(file);
    toast({
      title: "Resume uploaded",
      description: "Your resume has been uploaded successfully",
    });
  };

  const extractJobTitle = (description: string): string => {
    // A simple function to extract a job title from a job description
    // In a real implementation, this would be more sophisticated using AI
    const firstLine = description.split('\n')[0].trim();
    if (firstLine.length < 50) return firstLine;
    
    const commonTitles = [
      'Software Engineer', 'Frontend Developer', 'Backend Developer',
      'Full Stack Developer', 'Product Manager', 'Data Scientist',
      'UX Designer', 'Project Manager', 'Marketing Manager',
      'Sales Representative', 'Customer Success Manager'
    ];
    
    for (const title of commonTitles) {
      if (description.toLowerCase().includes(title.toLowerCase())) {
        return title;
      }
    }
    
    return 'Untitled Position';
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

    setJobDescription(description);
    setIsAnalyzing(true);
    const extractedTitle = extractJobTitle(description);
    setJobTitle(extractedTitle);

    try {
      // Check if user has analyses left
      if (!user) throw new Error("You must be logged in to perform an analysis");
      
      const usageStats = await getRemainingAnalyses(user.id);
      
      if (usageStats.used >= usageStats.limit) {
        toast({
          title: "Analysis limit reached",
          description: `You've used all ${usageStats.limit} analyses in your ${user.subscription} plan. Please upgrade to continue.`,
          variant: "destructive",
        });
        navigate('/pricing');
        return;
      }

      // Start analysis process
      toast({
        title: "Analysis started",
        description: "We're processing your resume and job description",
      });
      
      // Step 1: Parse resume
      const resumeData = await parseResume(resume);
      
      // Step 2: Parse job description
      const jobData = await parseJobDescription(description);
      
      // Step 3: Analyze match
      const analysisResult = await analyzeMatch(resumeData, jobData);
      setResult(analysisResult);
      
      // Step 4: Save analysis to history
      if (user) {
        await saveAnalysis(user.id, extractedTitle, analysisResult, resume, description);
      }

      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed against the job description",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setResume(null);
    setJobDescription('');
    setResult(null);
    setJobTitle('');
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
        
        {(!result || isAnalyzing) ? (
          <div className="max-w-4xl mx-auto">
            <AnalysisForm 
              onResumeSelected={handleResumeSelect} 
              onJobDescriptionSubmit={handleJobDescriptionSubmit}
              isLoading={isAnalyzing}
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
