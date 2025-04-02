
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import FeatureCard from '@/components/FeaturesCard';
import { FileUp, BarChart3, Zap, PenTool, Star, SparkleIcon } from 'lucide-react';

const Index = () => {
  return (
    <PageLayout>
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="fancy-blur-gradient top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="fancy-blur-gradient bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            <span className="block">AI-Powered Resume</span>
            <span className="block bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              Job Match Analysis
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Optimize your resume for each job application with AI-driven insights and personalized suggestions.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-6 rounded-md text-base">
                Get Started
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-6 rounded-md text-base">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-8 shadow-sm border border-gray-100">
              <p className="text-4xl font-bold text-brand-600">95%</p>
              <p className="mt-2 text-gray-500">Accuracy in skills matching</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-8 shadow-sm border border-gray-100">
              <p className="text-4xl font-bold text-brand-600">3x</p>
              <p className="mt-2 text-gray-500">Higher interview chance</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-8 shadow-sm border border-gray-100">
              <p className="text-4xl font-bold text-brand-600">2M+</p>
              <p className="mt-2 text-gray-500">Resumes analyzed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Advanced Features
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our AI-powered platform provides everything you need to optimize your resume
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Resume Upload"
              description="Upload your resume in PDF or Word format and let our AI extract and analyze your skills and experience."
              icon={FileUp}
            />
            <FeatureCard
              title="Match Analysis"
              description="Get a detailed match percentage showing how well your resume aligns with the job description."
              icon={BarChart3}
            />
            <FeatureCard
              title="Real-time Processing"
              description="Receive lightning-fast analysis results in seconds, powered by cutting-edge AI."
              icon={Zap}
            />
            <FeatureCard
              title="Optimization Suggestions"
              description="Get personalized suggestions to improve your resume for each specific job application."
              icon={PenTool}
            />
            <FeatureCard
              title="ATS Compatibility"
              description="Ensure your resume passes through Applicant Tracking Systems with our ATS optimization."
              icon={Star}
            />
            <FeatureCard
              title="AI-Powered Insights"
              description="Leverage the power of Google Gemini and OpenAI for the most accurate resume analysis."
              icon={SparkleIcon}
            />
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-brand-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to boost your job search?</span>
            <span className="block text-brand-200">Start analyzing your resume today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-base bg-white text-brand-600 hover:bg-gray-100 border-transparent"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-base bg-transparent text-white border-white hover:bg-brand-700"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
