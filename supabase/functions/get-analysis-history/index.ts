
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

    // Get the userId from the request
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Fetching analysis history for user: ${userId}`);

    // Fetch the user's analysis history
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching analysis history:", error);
      throw new Error(`Error fetching analysis history: ${error.message}`);
    }

    // Format the response
    const formattedData = data.map(item => ({
      id: item.id,
      date: item.created_at,
      jobTitle: item.job_title,
      matchScore: item.match_score,
      matchResult: {
        matchingSkills: item.matching_skills,
        missingSkills: item.missing_skills,
        suggestions: item.suggestions,
        improved: item.improved_content,
        overallScore: item.match_score
      }
    }));

    return new Response(
      JSON.stringify(formattedData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-analysis-history function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch analysis history" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
