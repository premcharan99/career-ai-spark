
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, Download, Eye, FileText, Search } from 'lucide-react';
import { getAnalysisHistory } from '@/services/AIService';
import { format } from 'date-fns';

interface AnalysisItem {
  id: string;
  date: string;
  jobTitle: string;
  matchScore: number;
  matchResult: any;
}

const AnalysisHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<AnalysisItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const historyData = await getAnalysisHistory(user.id);
          setAnalyses(historyData);
          setFilteredAnalyses(historyData);
        } catch (error) {
          console.error('Error loading analysis history:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadHistory();
  }, [user?.id]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredAnalyses(analyses);
      return;
    }
    
    const filtered = analyses.filter(analysis =>
      analysis.jobTitle.toLowerCase().includes(query)
    );
    setFilteredAnalyses(filtered);
  };

  const sortByDate = (a: AnalysisItem, b: AnalysisItem) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };

  const sortByScore = (a: AnalysisItem, b: AnalysisItem) => {
    return b.matchScore - a.matchScore;
  };

  const viewAnalysis = (id: string) => {
    navigate(`/analysis-result/${id}`);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return dateStr;
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
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resume Analysis History</h1>
          <Link to="/analysis">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Find previous resume analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by job title..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="recent">
          <TabsList className="mb-6">
            <TabsTrigger value="recent">Most Recent</TabsTrigger>
            <TabsTrigger value="highest">Highest Match</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading your analysis history...</p>
                </div>
              ) : filteredAnalyses.length > 0 ? (
                filteredAnalyses.sort(sortByDate).map(analysis => (
                  <AnalysisCard 
                    key={analysis.id} 
                    analysis={analysis} 
                    onView={() => viewAnalysis(analysis.id)}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No analysis history found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'No results match your search criteria.' : 'You haven\'t analyzed any resumes yet.'}
                  </p>
                  {!searchQuery && (
                    <Link to="/analysis">
                      <Button>Create Your First Analysis</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="highest">
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading your analysis history...</p>
                </div>
              ) : filteredAnalyses.length > 0 ? (
                filteredAnalyses.sort(sortByScore).map(analysis => (
                  <AnalysisCard 
                    key={analysis.id} 
                    analysis={analysis} 
                    onView={() => viewAnalysis(analysis.id)}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No analysis history found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'No results match your search criteria.' : 'You haven\'t analyzed any resumes yet.'}
                  </p>
                  {!searchQuery && (
                    <Link to="/analysis">
                      <Button>Create Your First Analysis</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

interface AnalysisCardProps {
  analysis: AnalysisItem;
  onView: () => void;
  formatDate: (date: string) => string;
}

const AnalysisCard = ({ analysis, onView, formatDate }: AnalysisCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{analysis.jobTitle}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(analysis.matchScore)}`}>
            {analysis.matchScore}% Match
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
          <span>{formatDate(analysis.date)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {analysis.matchResult.matchingSkills.slice(0, 3).map((skill: string, index: number) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {analysis.matchResult.matchingSkills.length > 3 && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              +{analysis.matchResult.matchingSkills.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
