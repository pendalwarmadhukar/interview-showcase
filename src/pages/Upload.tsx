import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Upload as UploadIcon, FileText, Loader2, Sparkles, AlertCircle, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    if (!text.trim()) throw new Error("Could not extract text from this PDF. Please paste the content manually.");
    return text.trim();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const Upload = () => {
  const navigate = useNavigate();
  const [jobText, setJobText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(120);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "text/plain" || droppedFile.name.endsWith(".txt") || droppedFile.name.endsWith(".pdf"))) {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a PDF or text file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleStart = async () => {
    let description = jobText.trim();

    if (!description && file) {
      try {
        description = await extractTextFromFile(file);
      } catch (e: any) {
        toast.error(e.message || "Failed to read file");
        return;
      }
    }

    if (!description) {
      toast.error("Please paste a job description or upload a file");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-questions", {
        body: { jobDescription: description, questionCount },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      sessionStorage.setItem("interview_data", JSON.stringify({
        jobDescription: description,
        questions: data.questions,
        timeLimit,
      }));

      navigate("/interview");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 max-w-2xl">
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Mock Interview
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Upload <span className="text-gradient-primary">Job Description</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Paste a job description or upload a file. Our AI will generate tailored interview questions for you to practice.
          </p>
        </div>

        <div className="space-y-6 animate-slide-up">
          {/* Text input */}
          <div className="rounded-lg border border-border/60 bg-card p-5 space-y-3">
            <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Paste Job Description
            </label>
            <Textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[200px] bg-secondary/40 border-border/40 text-sm font-mono resize-none"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground font-mono">OR</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* File upload */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
              dragOver
                ? "border-primary bg-primary/5"
                : file
                ? "border-primary/40 bg-primary/5"
                : "border-border/60 bg-card hover:border-primary/30"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-card-foreground">{file.name}</span>
              </div>
            ) : (
              <>
                <UploadIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Drop a <span className="text-primary font-medium">.pdf</span> or{" "}
                  <span className="text-primary font-medium">.txt</span> file here
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">or click to browse</p>
              </>
            )}
          </div>

          {/* Note about PDF */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground/70">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>PDF text extraction is supported. For scanned PDFs or images, paste the text content directly.</span>
          </div>

          {/* Start button */}
          <Button
            onClick={handleStart}
            disabled={loading || (!jobText.trim() && !file)}
            className="w-full h-12 text-base font-medium glow-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start Mock Interview
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
