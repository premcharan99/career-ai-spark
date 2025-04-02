
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

    // Get the analysisId from the request
    const { analysisId } = await req.json();

    if (!analysisId) {
      return new Response(
        JSON.stringify({ error: "Analysis ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Fetching analysis detail for ID: ${analysisId}`);

    // Fetch the analysis details
    const { data: analysisData, error: analysisError } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (analysisError) {
      console.error("Error fetching analysis:", analysisError);
      throw new Error(`Error fetching analysis: ${analysisError.message}`);
    }

    // Fetch the resume data
    const { data: resumeData, error: resumeError } = await supabase
      .from('resume_data')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (resumeError && resumeError.code !== 'PGRST116') { // Not found error code
      console.error("Error fetching resume data:", resumeError);
      // Continue without throwing
    }

    // Fetch the job data
    const { data: jobData, error: jobError } = await supabase
      .from('job_data')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (jobError && jobError.code !== 'PGRST116') { // Not found error code
      console.error("Error fetching job data:", jobError);
      // Continue without throwing
    }

    // Combine all data into a single response
    const detailResponse = {
      id: analysisData.id,
      jobTitle: analysisData.job_title,
      jobDescription: analysisData.job_description,
      date: analysisData.created_at,
      resumeUrl: analysisData.resume_url,
      matchScore: analysisData.match_score,
      matchingSkills: analysisData.matching_skills,
      missingSkills: analysisData.missing_skills,
      suggestions: analysisData.suggestions,
      improvedContent: analysisData.improved_content,
      resumeData: resumeData ? {
        skills: resumeData.skills,
        experience: resumeData.experience,
        education: resumeData.education,
        certifications: resumeData.certifications
      } : null,
      jobData: jobData ? {
        requiredSkills: jobData.required_skills,
        preferredSkills: jobData.preferred_skills,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements
      } : null
    };

    return new Response(
      JSON.stringify(detailResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-analysis-detail function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch analysis detail" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
