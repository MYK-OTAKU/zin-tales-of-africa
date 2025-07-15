import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-CONTE-IMAGE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) throw new Error("OPENAI_API_KEY is not set");
    logStep("OpenAI key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { prompt, culturalContext, style = "traditional African art" } = await req.json();
    if (!prompt) throw new Error("Prompt is required");
    logStep("Request parsed", { prompt, culturalContext, style });

    // Créer un prompt enrichi pour l'image
    const enrichedPrompt = `${prompt}. Style: ${style}. ${culturalContext ? `Cultural context: ${culturalContext}.` : ''} 
    Traditional Malian art style, vibrant colors, cultural authenticity, storytelling illustration, 
    warm earth tones, traditional African patterns and motifs. High quality, detailed artwork.`;

    logStep("Generating image with OpenAI", { enrichedPrompt });

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enrichedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    logStep("Image generated successfully", { imageUrl });

    return new Response(JSON.stringify({ imageUrl, prompt: enrichedPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in generate-conte-image", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});