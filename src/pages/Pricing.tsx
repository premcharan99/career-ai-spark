
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features for job seekers',
    price: 0,
    features: [
      '5 Resume Analyses per Month',
      'Basic Match Score (%)',
      'Highlight Matching Skills',
      'Highlight Missing Skills',
      'Basic ATS Compatibility Check',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'lite',
    name: 'Lite',
    description: 'Everything in Free, plus more analyses',
    price: 5.99,
    features: [
      '10 Resume Analyses per Month',
      'Basic Match Score (%)',
      'Highlight Matching & Missing Skills',
      'Basic ATS Compatibility Check',
      'Resume Formatting Suggestions',
    ],
    cta: 'Subscribe',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced features for serious job seekers',
    price: 8.99,
    features: [
      '100 Resume Analyses per Month',
      'Advanced Match Score (%)',
      'Highlight Matching & Missing Skills',
      'Advanced ATS Compatibility Check',
      'AI-Powered Cover Letter Generator',
      'Priority Support',
    ],
    cta: 'Subscribe',
    popular: true,
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    setSelectedPlan(planId);
    
    // This will be replaced with Stripe checkout in the real implementation
    if (planId !== 'free') {
      toast({
        title: "Coming Soon",
        description: "Stripe payment integration will be available soon",
      });
    } else {
      toast({
        title: "Free Plan Selected",
        description: "You're now on the Free plan",
      });
      navigate('/dashboard');
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the plan that fits your needs
          </p>
        </div>
        
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`flex flex-col ${
                plan.popular ? 'border-brand-500 shadow-md relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-3 mr-3">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                    Popular
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mt-4 mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-base font-medium text-gray-500">
                      /month
                    </span>
                  )}
                </div>
                
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-brand-500" />
                      </div>
                      <span className="ml-3 text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-6">
                <Button
                  className={`w-full ${plan.popular ? 'bg-brand-600 hover:bg-brand-700' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Can I upgrade my plan later?</h3>
                <p className="mt-2 text-base text-gray-500">
                  Yes, you can upgrade your plan at any time. Your new benefits will be available immediately.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">How accurate is the matching algorithm?</h3>
                <p className="mt-2 text-base text-gray-500">
                  Our AI-powered matching algorithm has over 95% accuracy in identifying relevant skills and experience from both resumes and job descriptions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Do you offer refunds?</h3>
                <p className="mt-2 text-base text-gray-500">
                  Yes, we offer a 7-day money-back guarantee on all paid plans if you're not satisfied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pricing;
