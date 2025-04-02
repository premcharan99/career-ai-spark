
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

    const { fileContent, fileName } = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "No resume content provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Parsing resume: ${fileName || "unnamed"}`);

    const prompt = `
      You are a professional resume parser. Extract the following information from this resume:
      
      1. Skills (as an array of individual skills)
      2. Experience (as an array of work experiences)
      3. Education (as an array of educational qualifications)
      4. Certifications (as an array of certifications)
      
      Format your response as a JSON object with these keys: skills, experience, education, certifications.
      Each array should contain string items. Don't include any explanations, just the JSON object.
      
      Here's the resume:
      ${fileContent}
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
      const expectedKeys = ['skills', 'experience', 'education', 'certifications'];
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
        skills: [],
        experience: [],
        education: [],
        certifications: []
      };
    }

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in parse-resume function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to parse resume" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
