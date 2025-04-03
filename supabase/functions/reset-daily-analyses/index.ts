
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

    console.log("Resetting daily analyses count for all users");

    // Reset all users' analyses_used to 0
    const { error } = await supabase
      .from('profiles')
      .update({ analyses_used: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all profiles except the placeholder

    if (error) {
      console.error("Error resetting analyses count:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Daily analyses count reset for all users" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in reset-daily-analyses function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to reset daily analyses" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
