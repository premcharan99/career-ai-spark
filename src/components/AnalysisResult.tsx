
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export interface MatchResult {
  overallScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  improved: string;
}

interface AnalysisResultProps {
  result: MatchResult;
  isLoading?: boolean;
}

const AnalysisResult = ({ result, isLoading = false }: AnalysisResultProps) => {
  const { overallScore, matchingSkills, missingSkills, suggestions, improved } = result;

  const scoreColor = () => {
    if (overallScore >= 80) return 'text-success-500';
    if (overallScore >= 60) return 'text-yellow-500';
    return 'text-destructive';
  };

  const progressColor = () => {
    if (overallScore >= 80) return 'bg-success-500';
    if (overallScore >= 60) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  const handleDownload = () => {
    // This will be implemented to generate and download a PDF report
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update",
    });
  };

  const handleShare = () => {
    // This will be implemented to share the analysis
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Analyzing Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="animate-pulse bg-gray-200 rounded-full h-24 w-24"></div>
            <div className="text-center space-y-3">
              <div className="animate-pulse bg-gray-200 h-6 w-48 mx-auto rounded-md"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-64 mx-auto rounded-md"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-6 w-full rounded-md"></div>
            <div className="w-full space-y-3">
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded-md"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded-md"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Resume Match Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-32 w-32 flex items-center justify-center mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e6e6e6" 
                  strokeWidth="10" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke={overallScore >= 80 ? "#00ff55" : overallScore >= 60 ? "#ffcc00" : "#ff3333"} 
                  strokeWidth="10" 
                  strokeDasharray={`${overallScore * 2.83} 283`} 
                  strokeLinecap="round" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">
              <span className={scoreColor()}>{overallScore}%</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold">
            {overallScore >= 80 
              ? 'Excellent Match!'
              : overallScore >= 60 
                ? 'Good Match'
                : 'Needs Improvement'
            }
          </h3>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            {overallScore >= 80 
              ? 'Your resume is well-aligned with this job. You have a strong chance!'
              : overallScore >= 60 
                ? 'Your resume matches many requirements but could use some improvements'
                : 'Your resume needs significant updates to match this job description better'
            }
          </p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3">Matching Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {matchingSkills.map((skill, index) => (
              <Badge key={index} variant="default" className="bg-success-500">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Missing Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {missingSkills.map((skill, index) => (
              <Badge key={index} variant="outline" className="border-destructive text-destructive">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Improvement Suggestions</h3>
          <ul className="list-disc pl-5 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-700">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 flex justify-between flex-wrap gap-4">
          <Button onClick={handleDownload} variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            Share Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;
