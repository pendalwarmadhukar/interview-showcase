-- Add share_token column to interviews for public sharing
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS share_token text UNIQUE;

-- Allow public read access to shared interviews via share_token
CREATE POLICY "Anyone can view shared interviews" ON public.interviews
  FOR SELECT USING (share_token IS NOT NULL);

-- Allow public read of answers for shared interviews
CREATE POLICY "Anyone can view answers of shared interviews" ON public.interview_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.interviews 
      WHERE interviews.id = interview_answers.interview_id 
      AND interviews.share_token IS NOT NULL
    )
  );

-- Allow users to update their own interviews (for adding share token)
CREATE POLICY "Users can update own interviews" ON public.interviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);