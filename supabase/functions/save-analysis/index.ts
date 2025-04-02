
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

    const { 
      userId, 
      jobTitle, 
      matchResult, 
      resumeData, 
      jobData, 
      jobDescription,
      resumeUrl 
    } = await req.json();

    if (!userId || !jobTitle || !matchResult || !resumeData || !jobData || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Saving analysis for user: ${userId}, job: ${jobTitle}`);

    // Insert the analysis record
    const { data: analysisData, error: analysisError } = await supabase
      .from('resume_analyses')
      .insert({
        user_id: userId,
        job_title: jobTitle,
        job_description: jobDescription,
        resume_url: resumeUrl || null,
        match_score: matchResult.overallScore,
        matching_skills: matchResult.matchingSkills,
        missing_skills: matchResult.missingSkills,
        suggestions: matchResult.suggestions,
        improved_content: matchResult.improved
      })
      .select('id')
      .single();

    if (analysisError) {
      console.error("Error saving analysis:", analysisError);
      throw new Error(`Error saving analysis: ${analysisError.message}`);
    }

    const analysisId = analysisData.id;

    // Insert the resume data
    const { error: resumeError } = await supabase
      .from('resume_data')
      .insert({
        user_id: userId,
        analysis_id: analysisId,
        skills: resumeData.skills,
        experience: resumeData.experience,
        education: resumeData.education,
        certifications: resumeData.certifications
      });

    if (resumeError) {
      console.error("Error saving resume data:", resumeError);
      // Don't throw here, continue to save job data
    }

    // Insert the job data
    const { error: jobError } = await supabase
      .from('job_data')
      .insert({
        user_id: userId,
        analysis_id: analysisId,
        required_skills: jobData.requiredSkills,
        preferred_skills: jobData.preferredSkills,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements
      });

    if (jobError) {
      console.error("Error saving job data:", jobError);
      // Don't throw here, we already saved the main analysis
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        analysisId
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in save-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to save analysis" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
