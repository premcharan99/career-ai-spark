
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
      '15 analyses per day',
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
      'Unlimited analyses',
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
      'Unlimited analyses',
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
      limit: 15,
      remaining: 15,
      tier: 'free',
      status: 'active'
    };
  }
};

// Simulate payment and upgrade subscription
export const processPayment = async (userId: string, plan: 'free' | 'lite' | 'pro'): Promise<boolean> => {
  try {
    console.log(`Payment processing is currently disabled. Plan: ${plan}`);
    return false; // Always return false as payment processing is disabled
  } catch (error) {
    console.error('Error in processPayment:', error);
    return false;
  }
};

// Upgrade a user's subscription (for backward compatibility)
export const upgradeSubscription = async (userId: string, newTier: 'free' | 'lite' | 'pro'): Promise<boolean> => {
  return processPayment(userId, newTier);
};

// Reset daily analysis count
export const resetDailyAnalysisCount = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ analyses_used: 0 })
      .eq('id', userId);
    
    if (error) {
      console.error('Error resetting daily analysis count:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in resetDailyAnalysisCount:', error);
    return false;
  }
};
