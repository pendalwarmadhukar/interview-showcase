import { supabase } from "@/integrations/supabase/client";

async function callMongo(action: string, data: Record<string, any> = {}) {
  const { data: result, error } = await supabase.functions.invoke("mongodb-proxy", {
    body: { action, data },
  });
  if (error) throw error;
  if (result?.error) throw new Error(result.error);
  return result;
}

export const mongodb = {
  saveInterview: (data: {
    job_description: string;
    average_score: number;
    total_questions: number;
    answers: Array<{
      question_text: string;
      question_type: string;
      answer_text: string;
      score: number | null;
      strengths: string[];
      improvements: string[];
      suggested_answer: string | null;
      overall_feedback: string | null;
    }>;
  }) => callMongo("save_interview", data),

  getInterviews: () => callMongo("get_interviews"),

  getAnswers: (interview_id: string) => callMongo("get_answers", { interview_id }),

  getDashboard: () => callMongo("get_dashboard"),

  shareInterview: (interview_id: string) => callMongo("share_interview", { interview_id }),

  getShared: (token: string) => callMongo("get_shared", { token }),
};
