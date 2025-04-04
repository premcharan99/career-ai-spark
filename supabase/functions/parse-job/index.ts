
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
          { "role": "system", "content": "You are a job description analysis expert. Extract only the requested information." },
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
      const expectedKeys = ['requiredSkills', 'preferredSkills', 'responsibilities', 'requirements'];
      for (const key of expectedKeys) {
        if (!parsedData[key] || !Array.isArray(parsedData[key])) {
          parsedData[key] = [];
        }
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.log("Raw response:", openaiData.choices[0].message.content);
      
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
      JSON.stringify({ 
        error: error.message || "Failed to parse job description",
        requiredSkills: [],
        preferredSkills: [],
        responsibilities: [],
        requirements: []
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
