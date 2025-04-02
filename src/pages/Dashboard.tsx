
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, FileText, Clock, ChevronRight } from 'lucide-react';

interface AnalysisHistory {
  id: string;
  date: string;
  jobTitle: string;
  matchScore: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);

  // Mock history data - this would come from Supabase in real implementation
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setAnalyses([
        {
          id: '1',
          date: '2023-11-15',
          jobTitle: 'Senior Frontend Developer',
          matchScore: 85,
        },
        {
          id: '2',
          date: '2023-11-10',
          jobTitle: 'UI/UX Designer',
          matchScore: 72,
        },
        {
          id: '3',
          date: '2023-11-05',
          jobTitle: 'Product Manager',
          matchScore: 68,
        },
      ]);
    }, 1000);
  }, []);

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/analysis">
              <Button className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Subscription Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Your current plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Current Plan</span>
                <span className="font-semibold text-brand-600 capitalize">{user?.subscription}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyses Used</span>
                  <span>{user?.analysesCount} / {user?.analysesLimit}</span>
                </div>
                <Progress value={(user?.analysesCount || 0) / (user?.analysesLimit || 1) * 100} />
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/pricing" className="w-full">
                <Button variant="outline" className="w-full">
                  Upgrade Plan
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with these actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/analysis" className="block">
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-100 text-brand-600">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">New Resume Analysis</h4>
                    <p className="text-xs text-gray-500">Analyze your resume against a job</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
              <Link to="/account" className="block">
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">Account Settings</h4>
                    <p className="text-xs text-gray-500">Manage your account preferences</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
              <CardDescription>Best practices for your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Quantify Achievements</h4>
                <p className="text-sm text-gray-600">
                  Use numbers and metrics to showcase your impact (e.g., "Increased sales by 30%").
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Use Action Verbs</h4>
                <p className="text-sm text-gray-600">
                  Start bullets with powerful action verbs like "Implemented," "Developed," "Led."
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Customize for Each Job</h4>
                <p className="text-sm text-gray-600">
                  Tailor your resume keywords to match each specific job description.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Analyses</h3>
          <div className="bg-white shadow overflow-hidden rounded-md">
            {analyses.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {analyses.map((analysis) => (
                  <li key={analysis.id}>
                    <div className="px-6 py-4 flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                          <FileText className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {analysis.jobTitle}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-3 w-3" />
                          <span>{new Date(analysis.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {analysis.matchScore}% Match
                        </span>
                        <Button variant="ghost" size="sm" className="mt-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-10 text-center">
                <p className="text-gray-500">No resume analyses yet</p>
                <div className="mt-4">
                  <Link to="/analysis">
                    <Button variant="default" size="sm">
                      Create Your First Analysis
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
