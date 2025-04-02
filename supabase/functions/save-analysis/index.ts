
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create a Supabase client with the user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://ghekizltpiqfstegzgyu.supabase.co';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZWtpemx0cGlxZnN0ZWd6Z3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1OTA0NTAsImV4cCI6MjA1OTE2NjQ1MH0.hXBCO152N8TFzJnV8vJtyI426yG9VO5QbAdHcKxI6zI';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      userId,
      jobTitle,
      matchResult,
      resumeData,
      jobData,
      jobDescription,
      resumeUrl
    } = await req.json();

    console.log(`Saving analysis for user: ${userId}`);

    // Begin a Supabase transaction
    // Since we can't use actual transactions in edge functions, we'll use sequential operations
    // and handle errors appropriately

    // 1. Insert the analysis record
    const { data: analysisData, error: analysisError } = await supabase
      .from('resume_analyses')
      .insert({
        user_id: userId,
        job_title: jobTitle,
        job_description: jobDescription,
        resume_url: resumeUrl,
        match_score: matchResult.overallScore,
        matching_skills: matchResult.matchingSkills,
        missing_skills: matchResult.missingSkills,
        suggestions: matchResult.suggestions,
        improved_content: matchResult.improved
      })
      .select()
      .single();

    if (analysisError) {
      throw new Error(`Error saving analysis: ${analysisError.message}`);
    }

    const analysisId = analysisData.id;

    // 2. Insert resume data with the analysis ID
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
      console.error(`Error saving resume data: ${resumeDataError.message}`);
      // We continue despite this error to save partial data
    }

    // 3. Insert job data with the analysis ID
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
      console.error(`Error saving job data: ${jobDataError.message}`);
      // We continue despite this error to save partial data
    }

    // 4. Update the user's analyses count
    const { error: profileError } = await supabase.rpc('increment_analyses_used', { user_id: userId });

    if (profileError) {
      console.error(`Error updating analyses count: ${profileError.message}`);
      // We continue despite this error
    }

    console.log(`Analysis saved successfully with ID: ${analysisId}`);

    return new Response(
      JSON.stringify({ success: true, analysisId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in save-analysis function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
