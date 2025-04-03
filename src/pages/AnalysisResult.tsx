
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import AnalysisResult, { MatchResult } from '@/components/AnalysisResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, FileText, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getAnalysisHistory } from '@/services/AIService';

const AnalysisResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<{
    jobTitle: string;
    date: string;
    matchResult: MatchResult;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!id || !user?.id) return;
      
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch a specific analysis from Supabase
        const analysisHistory = await getAnalysisHistory(user.id);
        const foundAnalysis = analysisHistory.find(item => item.id === id);
        
        if (foundAnalysis) {
          setAnalysis({
            jobTitle: foundAnalysis.jobTitle,
            date: foundAnalysis.date,
            matchResult: foundAnalysis.matchResult,
          });
        } else {
          toast({
            title: "Analysis not found",
            description: "The requested analysis could not be found",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
        toast({
          title: "Error loading analysis",
          description: "There was an error loading your analysis. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id, user?.id, navigate]);

  const handleDownload = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update",
    });
  };

  const handleShare = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update",
    });
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={() => navigate('/history')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500">Loading analysis results...</p>
          </div>
        ) : analysis ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{analysis.jobTitle}</h1>
              <p className="text-gray-500">
                Analyzed on {new Date(analysis.date).toLocaleDateString()} at {new Date(analysis.date).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalysisResult result={analysis.matchResult} />
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Analysis
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full justify-start" 
                      onClick={() => navigate('/analysis')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      New Analysis
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pro Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Focus on Keywords</h3>
                      <p className="text-sm text-gray-500">Make sure to include the matching keywords from this job description in your resume.</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Tailor Your Experience</h3>
                      <p className="text-sm text-gray-500">Highlight past experiences that are most relevant to this specific job.</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Use Action Verbs</h3>
                      <p className="text-sm text-gray-500">Begin bullet points with strong action verbs that demonstrate your impact.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-8">
              <Tabs defaultValue="improvements">
                <TabsList>
                  <TabsTrigger value="improvements">Suggested Improvements</TabsTrigger>
                  <TabsTrigger value="optimized">Optimized Resume</TabsTrigger>
                </TabsList>
                
                <TabsContent value="improvements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {analysis.matchResult.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex">
                            <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            <p>{suggestion}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="optimized" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>ATS-Optimized Resume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 border rounded-md bg-gray-50">
                        <p className="whitespace-pre-line">{analysis.matchResult.improved}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis not found</h3>
            <p className="text-gray-500 mb-6">
              The analysis you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate('/analysis')}>
              Create New Analysis
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AnalysisResultPage;
