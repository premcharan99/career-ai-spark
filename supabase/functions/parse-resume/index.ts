
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

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
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { fileContent, fileName } = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "Resume content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Parsing resume: ${fileName}`);

    // Prompt for Gemini to extract resume data
    const prompt = `Extract the following information from this resume. Format the response as a valid JSON object with these keys:
    - skills: An array of technical and soft skills
    - experience: An array of work experiences (company, role, dates, responsibilities)
    - education: An array of educational experiences (degree, institution, dates)
    - certifications: An array of professional certifications
    
    Here's the resume content:
    ${fileContent}
    
    Format the response as a valid JSON object only, with no additional text or explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    let jsonStart = text.indexOf('{');
    let jsonEnd = text.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Failed to parse resume: Invalid response format");
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const resumeData = JSON.parse(jsonString);

    console.log("Resume successfully parsed");

    return new Response(
      JSON.stringify(resumeData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error parsing resume:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
