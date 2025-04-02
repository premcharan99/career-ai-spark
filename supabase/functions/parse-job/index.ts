
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
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      throw new Error("API key not found");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return new Response(
        JSON.stringify({ error: "No job description provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Parsing job description");

    const prompt = `
      You are a professional job description analyzer. Extract the following information from this job description:
      
      1. Required Skills (as an array of individual skills that are explicitly required)
      2. Preferred Skills (as an array of individual skills that are nice to have but not required)
      3. Responsibilities (as an array of job responsibilities)
      4. Requirements (as an array of job requirements like education, experience, etc.)
      
      Format your response as a JSON object with these keys: requiredSkills, preferredSkills, responsibilities, requirements.
      Each array should contain string items. Don't include any explanations, just the JSON object.
      
      Here's the job description:
      ${jobDescription}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    let parsedData;
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                       text.match(/```\n([\s\S]*?)\n```/) ||
                       text.match(/{[\s\S]*?}/);
                       
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      parsedData = JSON.parse(jsonStr.replace(/```/g, '').trim());
      
      // Ensure the response has the correct structure
      const expectedKeys = ['requiredSkills', 'preferredSkills', 'responsibilities', 'requirements'];
      for (const key of expectedKeys) {
        if (!parsedData[key] || !Array.isArray(parsedData[key])) {
          parsedData[key] = [];
        }
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", text);
      
      // Fallback with empty arrays
      parsedData = {
        requiredSkills: [],
        preferredSkills: [],
        responsibilities: [],
        requirements: []
      };
    }

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in parse-job function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to parse job description" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
