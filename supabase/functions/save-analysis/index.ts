
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
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { 
      userId, 
      jobTitle, 
      matchResult, 
      resumeData, 
      jobData, 
      jobDescription, 
      resumeUrl, 
      resumeText 
    } = await req.json();
    
    if (!userId || !matchResult) {
      return new Response(
        JSON.stringify({ error: "userId and matchResult are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Saving analysis for user ${userId}, job: ${jobTitle}`);
    
    // Generate a UUID for the analysis
    const analysisId = crypto.randomUUID();
    
    // Save the analysis to the resume_analyses table
    const { error: analysisError } = await supabase
      .from('resume_analyses')
      .insert({
        id: analysisId,
        user_id: userId,
        job_title: jobTitle || 'Untitled Position',
        match_score: matchResult.overallScore,
        matching_skills: matchResult.matchingSkills,
        missing_skills: matchResult.missingSkills,
        suggestions: matchResult.suggestions,
        improved_content: matchResult.improved,
        job_description: jobDescription,
        resume_url: resumeUrl,
        created_at: new Date().toISOString()
      });
    
    if (analysisError) {
      console.error("Error saving analysis:", analysisError);
      throw new Error(`Error saving analysis: ${analysisError.message}`);
    }
    
    // Save resume data
    if (resumeData) {
      const { error: resumeDataError } = await supabase
        .from('resume_data')
        .insert({
          user_id: userId,
          analysis_id: analysisId,
          skills: resumeData.skills,
          experience: resumeData.experience,
          education: resumeData.education,
          certifications: resumeData.certifications
        });
      
      if (resumeDataError) {
        console.error("Error saving resume data:", resumeDataError);
        // Continue even if this fails
      }
    }
    
    // Save job data
    if (jobData) {
      const { error: jobDataError } = await supabase
        .from('job_data')
        .insert({
          user_id: userId,
          analysis_id: analysisId,
          required_skills: jobData.requiredSkills,
          preferred_skills: jobData.preferredSkills,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements
        });
      
      if (jobDataError) {
        console.error("Error saving job data:", jobDataError);
        // Continue even if this fails
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, analysisId }),
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
