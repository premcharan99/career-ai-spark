
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

    const url = new URL(req.url);
    const analysisId = url.searchParams.get('analysisId');

    if (!analysisId) {
      throw new Error('Analysis ID is required');
    }

    console.log(`Fetching analysis detail for ID: ${analysisId}`);

    // Get the analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (analysisError) {
      throw new Error(`Error fetching analysis: ${analysisError.message}`);
    }

    // Get the resume data
    const { data: resumeData, error: resumeDataError } = await supabase
      .from('resume_data')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (resumeDataError && resumeDataError.code !== 'PGRST116') {
      console.error(`Error fetching resume data: ${resumeDataError.message}`);
    }

    // Get the job data
    const { data: jobData, error: jobDataError } = await supabase
      .from('job_data')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (jobDataError && jobDataError.code !== 'PGRST116') {
      console.error(`Error fetching job data: ${jobDataError.message}`);
    }

    // Combine all the data
    const result = {
      analysis,
      resumeData: resumeData || null,
      jobData: jobData || null
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-analysis-detail function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
