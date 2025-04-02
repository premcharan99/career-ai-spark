
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import FeaturesCard from '@/components/FeaturesCard';
import { Award, FileSearch, FileText, Gem, TrendingUp } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              AI-Powered Resume Analysis
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Get your resume analyzed by AI and improve your chances of landing your dream job
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="px-8">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/signin">
                    <Button size="lg" variant="outline" className="px-8">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform uses advanced AI to analyze your resume against job descriptions and provide actionable insights
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeaturesCard
              icon={FileText}
              title="Upload Resume"
              description="Upload your resume in PDF or DOCX format and our AI will extract your skills and experience"
            />
            <FeaturesCard
              icon={FileSearch}
              title="Add Job Description"
              description="Paste a job description or provide a link to a job posting you're interested in"
            />
            <FeaturesCard
              icon={TrendingUp}
              title="Get Analysis"
              description="Receive a comprehensive analysis with a match score, highlighted skills, and ATS optimization tips"
            />
            <FeaturesCard
              icon={Award}
              title="Improve & Apply"
              description="Follow our personalized suggestions to improve your resume and increase your chances of getting hired"
            />
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Subscription Plans</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for you and take your job search to the next level
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6 mx-auto">
                <Gem className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Free</h3>
              <p className="text-3xl font-bold text-center mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>5 Resume Analyses</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic Match Score</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic Skill Matching</span>
                </li>
              </ul>
              <Link to="/signup" className="block w-full">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-primary transform scale-105">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-sm font-bold py-1 px-4 rounded-full">
                MOST POPULAR
              </div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 text-brand-600 mb-6 mx-auto">
                <Gem className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Lite</h3>
              <p className="text-3xl font-bold text-center mb-6">$5.99<span className="text-base font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10 Resume Analyses per Month</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic Match Score (%)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Highlight Matching & Missing Skills</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic ATS Compatibility Check</span>
                </li>
              </ul>
              <Link to="/pricing" className="block w-full">
                <Button className="w-full">Choose Plan</Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6 mx-auto">
                <Gem className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Pro</h3>
              <p className="text-3xl font-bold text-center mb-6">$8.99<span className="text-base font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>100 Resume Analyses per Month</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced Match Score (%)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced ATS Compatibility Check</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-Powered Cover Letter Generator</span>
                </li>
              </ul>
              <Link to="/pricing" className="block w-full">
                <Button variant="outline" className="w-full">Choose Plan</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-brand-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to supercharge your job search?</h2>
            <p className="text-xl opacity-90 mb-8">
              Get started today and let our AI help you land your dream job
            </p>
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button size="lg" variant="secondary" className="px-8">
                {user ? 'Go to Dashboard' : 'Get Started for Free'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
