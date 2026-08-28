import { useEffect, useRef } from "react";

const SpeechRecognitionAPI =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// Browser-native speech-to-text (Chrome/Edge only). Only fires onResult for
// finalized phrases, not interim/partial results, to keep transcript chunks clean.
export default function useSpeechRecognition({ enabled, onResult }) {
  const supported = !!SpeechRecognitionAPI;
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!SpeechRecognitionAPI || !enabled) return;

    let stoppedIntentionally = false;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) onResult(text);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        console.error("[speech] recognition error:", event.error);
      }
    };

    recognition.onend = () => {
      // Browsers stop recognition after a period of silence - restart it while the call is still active
      if (!stoppedIntentionally) {
        try {
          recognition.start();
        } catch {
          // already running - ignore
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error("[speech] failed to start recognition:", err);
    }

    return () => {
      stoppedIntentionally = true;
      recognition.onend = null;
      recognition.stop();
    };
  }, [enabled, onResult]);

  return { supported };
}
