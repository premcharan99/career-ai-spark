
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, HelpCircle } from 'lucide-react';
import { upgradeSubscription, subscriptionTiers } from '@/services/SubscriptionService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const Pricing = () => {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tierId: 'free' | 'lite' | 'pro') => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to upgrade your subscription",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    // If user already has this plan
    if (profile?.subscription_tier === tierId) {
      toast({
        title: "Already subscribed",
        description: `You are already on the ${tierId.toUpperCase()} plan`,
      });
      navigate('/account');
      return;
    }

    setIsUpgrading(tierId);
    
    try {
      const success = await upgradeSubscription(user.id, tierId);
      
      if (success) {
        await updateProfile();
        toast({
          title: "Subscription upgraded",
          description: `Your subscription has been upgraded to ${tierId.toUpperCase()}`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error upgrading:', error);
      toast({
        title: "Upgrade failed",
        description: "There was an error upgrading your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(null);
    }
  };

  // Calculate yearly prices (20% discount)
  const getPrice = (monthlyPrice: number) => {
    if (billingPeriod === 'yearly') {
      const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
      return yearlyPrice.toFixed(2);
    }
    return monthlyPrice.toFixed(2);
  };

  const isCurrentPlan = (tierId: string) => {
    return profile?.subscription_tier === tierId;
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
          
          <div className="mt-8 flex justify-center">
            <Tabs
              defaultValue="monthly"
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
              className="w-72"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly <span className="ml-1 text-xs text-green-600 font-semibold">Save 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
                      <span className="text-4xl font-extrabold">${getPrice(tier.price)}</span>
                      <span className="text-gray-500 ml-2">
                        {billingPeriod === 'monthly' ? '/month' : '/year'}
                      </span>
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
                  onClick={() => handleUpgrade(tier.id as 'free' | 'lite' | 'pro')}
                  disabled={isCurrentPlan(tier.id) || !!isUpgrading}
                >
                  {isUpgrading === tier.id ? 'Processing...' : 
                   isCurrentPlan(tier.id) ? 'Current Plan' : 
                   tier.id === 'free' ? 'Get Started' : 'Upgrade'}
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
                  <p className="mt-1 text-gray-500">We accept all major credit cards, debit cards, and PayPal.</p>
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
    </PageLayout>
  );
};

export default Pricing;
