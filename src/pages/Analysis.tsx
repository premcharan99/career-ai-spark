
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import ResumeUploader from '@/components/ResumeUploader';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import AnalysisResult, { MatchResult } from '@/components/AnalysisResult';
import { analyzeResumeMatch, checkSubscriptionLimit } from '@/services/AnalysisService';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Analysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleResumeSelect = (file: File) => {
    setResume(file);
    toast({
      title: "Resume uploaded",
      description: "Your resume has been uploaded successfully",
    });
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

    try {
      // Check if user has analyses left
      const subscriptionStatus = await checkSubscriptionLimit(user?.id || '');
      
      if (!subscriptionStatus.canProceed) {
        toast({
          title: "Analysis limit reached",
          description: `You've used all ${subscriptionStatus.limit} analyses in your ${user?.subscription} plan. Please upgrade to continue.`,
          variant: "destructive",
        });
        navigate('/pricing');
        return;
      }

      // Start analysis
      const analysisResult = await analyzeResumeMatch(resume, description);
      setResult(analysisResult);

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
        
        <h1 className="text-2xl font-bold mb-8">New Resume Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(!result || isAnalyzing) && (
            <>
              <div>
                <h2 className="text-lg font-semibold mb-4">Step 1: Upload Resume</h2>
                <ResumeUploader onFileSelected={handleResumeSelect} />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Step 2: Enter Job Description</h2>
                <JobDescriptionInput onSubmit={handleJobDescriptionSubmit} />
              </div>
            </>
          )}
          
          {(isAnalyzing || result) && (
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
              <AnalysisResult 
                result={result || {
                  overallScore: 0,
                  matchingSkills: [],
                  missingSkills: [],
                  suggestions: [],
                  improved: ''
                }} 
                isLoading={isAnalyzing} 
              />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Analysis;
