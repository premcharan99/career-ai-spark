
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { subscriptionTiers } from '@/services/SubscriptionService';

const Pricing = () => {
  const navigate = useNavigate();
  const [showPricingDialog, setShowPricingDialog] = useState(false);

  const handleUpgrade = () => {
    setShowPricingDialog(true);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Choose the plan that's right for you and take your resume to the next level with AI-powered analysis
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {subscriptionTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`flex flex-col ${tier.id === 'pro' ? 'border-primary shadow-lg' : ''}`}
            >
              {tier.id === 'pro' && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>
                  {tier.id === 'free' ? 'Basic resume analysis' : 
                   tier.id === 'lite' ? 'Enhanced analysis with ATS optimization' : 
                   'Complete AI-powered career toolkit'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mt-2 mb-6">
                  {tier.price === 0 ? (
                    <span className="text-4xl font-extrabold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-extrabold">${tier.price.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">/month</span>
                    </>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={tier.id === 'free' ? 'outline' : 'default'}
                  onClick={handleUpgrade}
                >
                  {tier.id === 'free' ? 'Get Started' : 'Upgrade'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <div className="flex items-start">
            <HelpCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
              <div className="mt-4 grid gap-6 grid-cols-1 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900">Can I cancel anytime?</h4>
                  <p className="mt-1 text-gray-500">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">What payment methods do you accept?</h4>
                  <p className="mt-1 text-gray-500">We accept all major credit cards through our secure payment processor.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Do you offer refunds?</h4>
                  <p className="mt-1 text-gray-500">We offer a 14-day money-back guarantee if you're not satisfied with our service.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">What happens when I reach my analysis limit?</h4>
                  <p className="mt-1 text-gray-500">You can upgrade your plan at any time to increase your analysis limit, or wait until your next billing cycle when your limit resets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pricing Features Coming Soon</DialogTitle>
            <DialogDescription>
              Our subscription services are currently under development. In the meantime, you can use the free tier with a limit of 15 analyses per day. Thank you for your patience!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => {
              setShowPricingDialog(false);
              navigate('/analysis');
            }}>
              Go to Analysis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Pricing;
