
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.17.3";

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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const { resumeData, jobData } = await req.json();

    if (!resumeData || !jobData) {
      return new Response(
        JSON.stringify({ error: "Resume data and job data are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing match between resume and job");

    // Calculate matching skills
    const resumeSkills = resumeData.skills || [];
    const requiredSkills = jobData.requiredSkills || [];
    const preferredSkills = jobData.preferredSkills || [];
    const allJobSkills = [...requiredSkills, ...preferredSkills];

    const matchingSkills = resumeSkills.filter(skill => 
      allJobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );

    const missingSkills = allJobSkills.filter(jobSkill => 
      !resumeSkills.some(skill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );

    // Calculate match score (simple algorithm)
    const requiredSkillsMatch = requiredSkills.filter(
      skill => resumeSkills.some(s => 
        s.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(s.toLowerCase())
      )
    ).length / (requiredSkills.length || 1);
    
    const preferredSkillsMatch = preferredSkills.filter(
      skill => resumeSkills.some(s => 
        s.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(s.toLowerCase())
      )
    ).length / (preferredSkills.length || 1);
    
    // Weight required skills more heavily
    const overallScore = Math.floor((requiredSkillsMatch * 0.7 + preferredSkillsMatch * 0.3) * 100);

    // Use OpenAI to generate suggestions and improved content
    const prompt = `
    I need to help a job applicant improve their resume for a specific job. 
    
    Resume skills: ${resumeSkills.join(", ")}
    Resume experience: ${resumeData.experience.join("\n")}
    Resume education: ${resumeData.education.join("\n")}
    Resume certifications: ${resumeData.certifications.join("\n")}
    
    Job required skills: ${requiredSkills.join(", ")}
    Job preferred skills: ${preferredSkills.join(", ")}
    Job responsibilities: ${jobData.responsibilities.join("\n")}
    Job requirements: ${jobData.requirements.join("\n")}
    
    Matching skills: ${matchingSkills.join(", ")}
    Missing skills: ${missingSkills.join(", ")}
    Match score: ${overallScore}%
    
    Based on this information, please provide:
    1. Four specific suggestions to improve the resume for this job (focusing on highlighting matching skills and addressing missing skills).
    2. A brief paragraph explaining how the resume should be improved overall.
    
    Format your response as a JSON object with these properties:
    {
      "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"],
      "improved": "paragraph about overall improvements"
    }
    
    Only include the JSON in your response, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides resume optimization advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    let aiData;
    
    try {
      // Try to parse the response as JSON
      aiData = JSON.parse(aiResponse);
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON:", error);
      // If parsing fails, extract JSON using regex (fallback)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse OpenAI response");
      }
    }

    const result = {
      overallScore,
      matchingSkills,
      missingSkills,
      suggestions: aiData.suggestions,
      improved: aiData.improved
    };

    console.log("Match analysis complete");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing match:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
