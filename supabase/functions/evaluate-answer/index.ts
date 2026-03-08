import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, answer, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a senior interviewer evaluating a candidate's answer. Be constructive, specific, and encouraging. Evaluate based on relevance, depth, clarity, and how well it addresses the question in the context of the job role.`,
          },
          {
            role: "user",
            content: `Job context: ${jobDescription}\n\nQuestion: ${question}\n\nCandidate's Answer: ${answer}\n\nProvide feedback with a score out of 10, strengths, areas for improvement, and a suggested better answer.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_evaluation",
              description: "Return the evaluation of the candidate's answer",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score out of 10" },
                  strengths: { type: "array", items: { type: "string" }, description: "List of strengths" },
                  improvements: { type: "array", items: { type: "string" }, description: "Areas for improvement" },
                  suggestedAnswer: { type: "string", description: "A model answer" },
                  overallFeedback: { type: "string", description: "Brief overall feedback" },
                },
                required: ["score", "strengths", "improvements", "suggestedAnswer", "overallFeedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_evaluation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const evaluation = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ evaluation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-answer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
