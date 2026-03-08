import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

let client: MongoClient | null = null;

async function getDb() {
  if (!client) {
    const uri = Deno.env.get("MONGODB_URI");
    if (!uri) throw new Error("MONGODB_URI is not configured");
    client = new MongoClient();
    await client.connect(uri);
  }
  return client.database("interview_app");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const db = await getDb();

    // Validate user from auth header
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error } = await supabase.auth.getClaims(token);
      if (!error && claimsData?.claims) {
        userId = claimsData.claims.sub;
      }
    }

    switch (action) {
      // ─── Save interview + answers ───
      case "save_interview": {
        if (!userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const interviews = db.collection("interviews");
        const interviewDoc = {
          user_id: userId,
          job_description: data.job_description,
          average_score: data.average_score,
          total_questions: data.total_questions,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          share_token: null,
        };
        const insertId = await interviews.insertOne(interviewDoc);

        const answersCol = db.collection("interview_answers");
        const answers = data.answers.map((a: any) => ({
          interview_id: insertId.toString(),
          user_id: userId,
          question_text: a.question_text,
          question_type: a.question_type,
          answer_text: a.answer_text,
          score: a.score,
          strengths: a.strengths,
          improvements: a.improvements,
          suggested_answer: a.suggested_answer,
          overall_feedback: a.overall_feedback,
          created_at: new Date().toISOString(),
        }));
        await answersCol.insertMany(answers);

        return new Response(
          JSON.stringify({ id: insertId.toString() }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ─── Get user interviews ───
      case "get_interviews": {
        if (!userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const interviews = db.collection("interviews");
        const docs = await interviews
          .find({ user_id: userId })
          .sort({ completed_at: -1 })
          .toArray();

        const result = docs.map((d: any) => ({
          id: d._id.toString(),
          job_description: d.job_description,
          average_score: d.average_score,
          total_questions: d.total_questions,
          completed_at: d.completed_at,
          share_token: d.share_token,
        }));

        return new Response(JSON.stringify({ data: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── Get answers for an interview ───
      case "get_answers": {
        if (!userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const answersCol = db.collection("interview_answers");
        const answers = await answersCol
          .find({ interview_id: data.interview_id, user_id: userId })
          .sort({ created_at: 1 })
          .toArray();

        const result = answers.map((a: any) => ({
          id: a._id.toString(),
          question_text: a.question_text,
          question_type: a.question_type,
          answer_text: a.answer_text,
          score: a.score,
          strengths: a.strengths,
          improvements: a.improvements,
          suggested_answer: a.suggested_answer,
          overall_feedback: a.overall_feedback,
        }));

        return new Response(JSON.stringify({ data: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── Get dashboard data ───
      case "get_dashboard": {
        if (!userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const interviewsCol = db.collection("interviews");
        const answersCol = db.collection("interview_answers");

        const [interviewDocs, answerDocs] = await Promise.all([
          interviewsCol.find({ user_id: userId }).sort({ completed_at: 1 }).toArray(),
          answersCol.find({ user_id: userId }).toArray(),
        ]);

        return new Response(
          JSON.stringify({
            interviews: interviewDocs.map((d: any) => ({
              id: d._id.toString(),
              average_score: d.average_score,
              total_questions: d.total_questions,
              completed_at: d.completed_at,
            })),
            answers: answerDocs.map((a: any) => ({
              question_type: a.question_type,
              score: a.score,
            })),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ─── Share interview ───
      case "share_interview": {
        if (!userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { ObjectId } = await import("https://deno.land/x/mongo@v0.33.0/mod.ts");
        const interviewsCol = db.collection("interviews");
        const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
        await interviewsCol.updateOne(
          { _id: new ObjectId(data.interview_id), user_id: userId },
          { $set: { share_token: token } }
        );
        return new Response(JSON.stringify({ token }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── Get shared results (public) ───
      case "get_shared": {
        const interviewsCol = db.collection("interviews");
        const interview = await interviewsCol.findOne({ share_token: data.token });
        if (!interview) {
          return new Response(JSON.stringify({ error: "Not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const answersCol = db.collection("interview_answers");
        const answers = await answersCol
          .find({ interview_id: interview._id.toString() })
          .sort({ created_at: 1 })
          .toArray();

        return new Response(
          JSON.stringify({
            interview: {
              id: interview._id.toString(),
              job_description: interview.job_description,
              average_score: interview.average_score,
              total_questions: interview.total_questions,
              completed_at: interview.completed_at,
            },
            answers: answers.map((a: any) => ({
              id: a._id.toString(),
              question_text: a.question_text,
              question_type: a.question_type,
              answer_text: a.answer_text,
              score: a.score,
              strengths: a.strengths,
              improvements: a.improvements,
              suggested_answer: a.suggested_answer,
              overall_feedback: a.overall_feedback,
            })),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (e) {
    console.error("mongodb-proxy error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
