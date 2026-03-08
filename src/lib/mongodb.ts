import { supabase } from "@/integrations/supabase/client";

export const mongodb = {
  saveInterview: async (data: {
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
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: interview, error: intError } = await supabase
      .from("interviews")
      .insert({
        user_id: user.id,
        job_description: data.job_description,
        average_score: data.average_score,
        total_questions: data.total_questions,
      })
      .select("id")
      .single();

    if (intError) throw intError;

    const answers = data.answers.map((a) => ({
      interview_id: interview.id,
      user_id: user.id,
      question_text: a.question_text,
      question_type: a.question_type,
      answer_text: a.answer_text,
      score: a.score,
      strengths: a.strengths,
      improvements: a.improvements,
      suggested_answer: a.suggested_answer,
      overall_feedback: a.overall_feedback,
    }));

    const { error: ansError } = await supabase
      .from("interview_answers")
      .insert(answers);

    if (ansError) throw ansError;

    return { id: interview.id };
  },

  getInterviews: async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select("id, job_description, average_score, total_questions, completed_at, share_token")
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return { data };
  },

  getAnswers: async (interview_id: string) => {
    const { data, error } = await supabase
      .from("interview_answers")
      .select("id, question_text, question_type, answer_text, score, strengths, improvements, suggested_answer, overall_feedback")
      .eq("interview_id", interview_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data };
  },

  getDashboard: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const [{ data: interviews }, { data: answers }] = await Promise.all([
      supabase
        .from("interviews")
        .select("id, average_score, total_questions, completed_at")
        .order("completed_at", { ascending: true }),
      supabase
        .from("interview_answers")
        .select("question_type, score"),
    ]);

    return { interviews: interviews || [], answers: answers || [] };
  },

  shareInterview: async (interview_id: string) => {
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
    const { error } = await supabase
      .from("interviews")
      .update({ share_token: token })
      .eq("id", interview_id);

    if (error) throw error;
    return { token };
  },

  getShared: async (token: string) => {
    const { data: interview, error: intError } = await supabase
      .from("interviews")
      .select("id, job_description, average_score, total_questions, completed_at")
      .eq("share_token", token)
      .maybeSingle();

    if (!interview) throw new Error("Shared interview not found");

    if (intError) throw intError;

    const { data: answers, error: ansError } = await supabase
      .from("interview_answers")
      .select("id, question_text, question_type, answer_text, score, strengths, improvements, suggested_answer, overall_feedback")
      .eq("interview_id", interview.id)
      .order("created_at", { ascending: true });

    if (ansError) throw ansError;

    return { interview, answers: answers || [] };
  },
};
