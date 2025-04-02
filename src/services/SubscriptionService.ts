
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface SubscriptionData {
  used: number;
  limit: number;
  remaining: number;
  tier: string;
  status: string;
}

export const subscriptionTiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic resume analysis',
      '5 analyses per month',
      'Skills matching',
      'Basic improvement suggestions'
    ]
  },
  {
    id: 'lite',
    name: 'Lite',
    price: 9.99,
    features: [
      'Everything in Free',
      '20 analyses per month',
      'Advanced keyword optimization',
      'ATS compatibility score',
      'Priority support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    features: [
      'Everything in Lite',
      '100 analyses per month',
      'Industry-specific recommendations',
      'Advanced formatting suggestions',
      'Resume templates',
      'Phone consultation with career expert'
    ]
  }
];

// Get remaining analyses for a user
export const getRemainingAnalyses = async (userId: string): Promise<SubscriptionData> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('analyses_used, max_analyses, subscription_tier, subscription_status')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching subscription data:', error);
      throw new Error(`Error fetching subscription data: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No subscription data found for user');
    }
    
    const used = data.analyses_used;
    const limit = data.max_analyses;
    
    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      tier: data.subscription_tier,
      status: data.subscription_status
    };
  } catch (error) {
    console.error('Error in getRemainingAnalyses:', error);
    // Return default values for error case
    return {
      used: 0,
      limit: 5,
      remaining: 5,
      tier: 'free',
      status: 'active'
    };
  }
};

// Upgrade a user's subscription (would be connected to payment in a real implementation)
export const upgradeSubscription = async (userId: string, newTier: 'free' | 'lite' | 'pro'): Promise<boolean> => {
  try {
    // Map subscription tiers to their analysis limits
    const tierLimits = {
      free: 5,
      lite: 20,
      pro: 100
    };
    
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: newTier,
        max_analyses: tierLimits[newTier],
        subscription_status: 'active'
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error upgrading subscription:', error);
      throw new Error(`Error upgrading subscription: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in upgradeSubscription:', error);
    return false;
  }
};
