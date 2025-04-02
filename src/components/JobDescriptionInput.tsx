
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
}

const JobDescriptionInput = ({ onSubmit }: JobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = () => {
    if (jobDescription.trim().length < 50) {
      toast({
        title: "Job description too short",
        description: "Please enter a more detailed job description for better analysis",
        variant: "destructive",
      });
      return;
    }

    onSubmit(jobDescription);
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

  const handleClear = () => {
    setJobDescription('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Job Description</h3>
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
      </CardContent>
      <CardFooter className="flex justify-between px-6 pb-6 pt-0">
        <div className="flex space-x-2">
          <Button onClick={handlePaste} variant="outline" size="sm">
            Paste
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm">
            Clear
          </Button>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={jobDescription.trim().length < 50}
        >
          Analyze Match
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobDescriptionInput;
