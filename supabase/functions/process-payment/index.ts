
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the data from the request
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return new Response(
        JSON.stringify({ error: "User ID and plan are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Processing payment for user: ${userId}, plan: ${plan}`);

    // Map subscription tiers to their analysis limits
    const tierLimits = {
      free: 5,
      lite: 20,
      pro: 100
    };

    // In a real implementation, this would connect to Stripe API
    // For now, we'll simulate a successful payment and upgrade the user's account

    // Update the user's subscription tier
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: plan,
        max_analyses: tierLimits[plan as keyof typeof tierLimits],
        subscription_status: 'active'
      })
      .eq('id', userId);

    if (error) {
      console.error("Error updating subscription:", error);
      throw new Error(`Error updating subscription: ${error.message}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Payment processed successfully", plan }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-payment function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process payment" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
