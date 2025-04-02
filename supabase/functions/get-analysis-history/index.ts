
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
    const userId = url.searchParams.get('userId');

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log(`Fetching analysis history for user: ${userId}`);

    // Get all analyses for the user, ordered by creation date descending
    const { data: analyses, error: analysesError } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (analysesError) {
      throw new Error(`Error fetching analyses: ${analysesError.message}`);
    }

    return new Response(
      JSON.stringify(analyses),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-analysis-history function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
