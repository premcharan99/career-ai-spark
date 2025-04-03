
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface SubscriptionData {
  used: number;
  limit: number;
  remaining: number;
  tier: string;
  status: string;
}

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
    const limit = 15; // Fixed limit of 15 analyses per day
    
    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      tier: 'free',
      status: 'active'
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

// Legacy methods kept for backward compatibility
export const processPayment = async (): Promise<boolean> => {
  console.log('Payment processing is currently disabled');
  return true;
};

export const upgradeSubscription = async (): Promise<boolean> => {
  console.log('Subscription upgrades are currently disabled');
  return true;
};
