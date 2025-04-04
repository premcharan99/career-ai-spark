
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not found");
    }

    const { fileContent, fileName } = await req.json();

    if (!fileContent) {
      return new Response(
        JSON.stringify({ error: "No resume content provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Parsing resume: ${fileName || "unnamed"}, content length: ${fileContent.length}`);

    if (fileContent.length < 10) {
      return new Response(
        JSON.stringify({ error: "Resume content too short to parse" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

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

    // Call the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { "role": "system", "content": "You are a resume analysis expert that helps parse resumes. Extract only the requested information." },
          { "role": "user", "content": prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const openaiData = await response.json();
    
    if (!openaiData.choices || openaiData.choices.length === 0) {
      console.error("Unexpected OpenAI response:", openaiData);
      throw new Error("Failed to get a proper response from OpenAI");
    }

    let parsedData;
    try {
      const resultText = openaiData.choices[0].message.content;
      
      // Try to extract JSON from the response
      const jsonMatch = resultText.match(/```json\n([\s\S]*?)\n```/) || 
                       resultText.match(/```\n([\s\S]*?)\n```/) ||
                       resultText.match(/{[\s\S]*?}/);
                       
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : resultText;
      parsedData = JSON.parse(jsonStr.replace(/```/g, '').trim());
      
      // Ensure the response has the correct structure
      const expectedKeys = ['skills', 'experience', 'education', 'certifications'];
      for (const key of expectedKeys) {
        if (!parsedData[key] || !Array.isArray(parsedData[key])) {
          parsedData[key] = [];
        }
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.log("Raw response:", openaiData.choices[0].message.content);
      
      // Create a fallback response with empty arrays
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
      JSON.stringify({ 
        error: error.message || "Failed to parse resume",
        skills: [],
        experience: [],
        education: [],
        certifications: []
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
