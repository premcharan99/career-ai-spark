
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { FileText, Link2, Upload } from 'lucide-react';
import ResumeUploader from './ResumeUploader';

interface AnalysisFormProps {
  onResumeSelected: (file: File | null, text?: string) => void;
  onJobDescriptionSubmit: (description: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const AnalysisForm = ({ onResumeSelected, onJobDescriptionSubmit, isLoading, disabled = false }: AnalysisFormProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [resumeSubmitted, setResumeSubmitted] = useState(false);

  const handleResumeSelected = (file: File | null, text?: string) => {
    onResumeSelected(file, text);
    setResumeSubmitted(true);
  };

  const handleJobDescriptionSubmit = () => {
    if (jobDescription.trim().length < 50) {
      toast({
        title: "Job description too short",
        description: "Please enter a more detailed job description for better analysis",
        variant: "destructive",
      });
      return;
    }

    if (!resumeSubmitted) {
      toast({
        title: "Resume required",
        description: "Please upload or enter your resume first",
        variant: "destructive",
      });
      return;
    }

    onJobDescriptionSubmit(jobDescription);
  };

  const handleJobUrlSubmit = async () => {
    if (!jobUrl.trim() || !isValidUrl(jobUrl)) {
      toast({
        title: "Invalid job URL",
        description: "Please enter a valid job posting URL",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Fetching job description",
      description: "We're retrieving the job description from the provided URL",
    });

    try {
      // Simulate API call to scrape job description
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "URL feature coming soon",
        description: "Please manually copy and paste the job description from the URL for now.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error fetching job description:', error);
      toast({
        title: "Error fetching job description",
        description: "We couldn't retrieve the job description from the URL. Please enter it manually.",
        variant: "destructive",
      });
    }
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
      toast({
        description: "Job description pasted from clipboard",
      });
    } catch (err) {
      toast({
        title: "Clipboard access denied",
        description: "Please grant clipboard permission or paste manually",
        variant: "destructive",
      });
    }
  };

  if (disabled) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-red-600 mb-2">Analysis Limit Reached</h3>
        <p className="mb-4 text-gray-600">
          You've reached your limit of free resume analyses today. Please try again tomorrow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 1: Upload Your Resume</h2>
        <ResumeUploader onFileSelected={handleResumeSelected} />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 2: Enter Job Description</h2>
        <Card>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Enter Manually</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Paste the complete job description to get the most accurate matching analysis
                  </p>
                  <Textarea
                    placeholder="Enter the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>
                
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button onClick={handlePaste} variant="outline" size="sm">
                      Paste
                    </Button>
                    <Button 
                      onClick={() => setJobDescription('')} 
                      variant="outline" 
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleJobDescriptionSubmit} 
                    disabled={jobDescription.trim().length < 50 || isLoading || !resumeSubmitted}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Match'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Enter the URL of the job posting (Coming Soon)
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="url"
                        placeholder="https://example.com/job-posting"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <Button 
                      onClick={handleJobUrlSubmit}
                      disabled={!jobUrl.trim() || isLoading}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Fetch
                    </Button>
                  </div>
                </div>
                
                {jobDescription && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Job Description</h3>
                      <Textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleJobDescriptionSubmit} 
                        disabled={jobDescription.trim().length < 50 || isLoading || !resumeSubmitted}
                      >
                        {isLoading ? 'Analyzing...' : 'Analyze Match'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisForm;
