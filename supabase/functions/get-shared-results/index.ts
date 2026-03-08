import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interviewId } = await req.json();
    if (!interviewId) throw new Error("Missing interviewId");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: interview, error: intErr } = await supabase
      .from("interviews")
      .select("*")
      .eq("share_token", interviewId)
      .single();

    if (intErr || !interview) {
      return new Response(JSON.stringify({ error: "Shared results not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: answers, error: ansErr } = await supabase
      .from("interview_answers")
      .select("question_text, question_type, answer_text, score, overall_feedback, strengths, improvements, suggested_answer")
      .eq("interview_id", interview.id);

    if (ansErr) throw ansErr;

    return new Response(JSON.stringify({
      interview: {
        job_description: interview.job_description,
        average_score: interview.average_score,
        total_questions: interview.total_questions,
        completed_at: interview.completed_at,
        answers: answers || [],
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-shared-results error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
