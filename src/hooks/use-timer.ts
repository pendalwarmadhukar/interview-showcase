import { useState, useEffect, useRef, useCallback } from "react";

const QUESTION_TIME_LIMIT = 120; // 2 minutes per question

export function useTimer(onTimeUp?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME_LIMIT);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(onTimeUp);
  callbackRef.current = onTimeUp;

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setSecondsLeft(QUESTION_TIME_LIMIT);
    setIsRunning(false);
  }, []);

  const restart = useCallback(() => {
    setSecondsLeft(QUESTION_TIME_LIMIT);
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          callbackRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const progress = secondsLeft / QUESTION_TIME_LIMIT;
  const isLow = secondsLeft <= 30;
  const isCritical = secondsLeft <= 10;

  return { secondsLeft, formatted, progress, isLow, isCritical, isRunning, start, pause, reset, restart };
}
