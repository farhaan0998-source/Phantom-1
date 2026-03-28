import { useEffect, useState, useRef } from "react";
import {
  CreateServiceWorkerMLCEngine,
  ServiceWorkerMLCEngine,
} from "@mlc-ai/web-llm";

export default function Popup() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [thinking, setThinking] = useState(false);
  const engineRef = useRef<ServiceWorkerMLCEngine | null>(null);

  useEffect(() => {
    async function loadEngine() {
      engineRef.current = await CreateServiceWorkerMLCEngine(
        "Llama-3.2-3B-Instruct-q4f32_1-MLC",
        {
          initProgressCallback: (p) => {
            setProgress(Math.round(p.progress * 100));
          },
        },
      );
      setReady(true);
      chrome.runtime.sendMessage({ type: "MODEL_READY" }).catch(() => {});
    }
    loadEngine();

    const listener = (message: any) => {
      if (message.type === "EXPLAIN_NOW") {
        setCode(message.code);
        setExplanation("");
        // Auto trigger explain
        handleExplainWithCode(message.code);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleExplainWithCode = async (selectedCode: string) => {
    if (!selectedCode.trim() || !engineRef.current) return;
    setThinking(true);
    setExplanation("");

    try {
      const response = await engineRef.current.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You explain code clearly and concisely in plain English. No fluff. No markdown.",
          },
          {
            role: "user",
            content: `Explain this code:\n\n${selectedCode}`,
          },
        ],
        stream: false,
      });
      setExplanation(
        response.choices[0].message.content ?? "No explanation returned.",
      );
    } catch (err: any) {
      setExplanation(`Error: ${err.message}`);
    }

    setThinking(false);
  };

  const handleExplain = async () => {
    handleExplainWithCode(code);
    if (!code.trim() || !engineRef.current) return;
    setThinking(true);
    setExplanation("");
    try {
      const response = await engineRef.current.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You explain code clearly and concisely in plain English. No fluff. No markdown.",
          },
          {
            role: "user",
            content: `Explain this code:\n\n${code}`,
          },
        ],
        stream: false,
      });
      setExplanation(
        response.choices[0].message.content ?? "No explanation returned.",
      );
    } catch (err: any) {
      setExplanation(`Error: ${err.message}`);
    }
    setThinking(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #1a1a1a",
          paddingBottom: "16px",
        }}
      >
        <h1
          style={{
            color: "#7b61ff",
            letterSpacing: "4px",
            fontSize: "18px",
            margin: 0,
          }}
        >
          PHANTOM
        </h1>
        {ready ? (
          <span style={{ color: "#4caf50", fontSize: "11px" }}>● READY</span>
        ) : (
          <span style={{ color: "#666", fontSize: "11px" }}>● LOADING</span>
        )}
      </div>

      {/* Loading Bar */}
      {!ready && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: "2px",
              height: "4px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                background: "#7b61ff",
                height: "100%",
                width: `${progress}%`,
                transition: "width 0.3s",
                borderRadius: "2px",
              }}
            />
          </div>
          <p style={{ color: "#666", fontSize: "11px", margin: 0 }}>
            Loading model... {progress}% — this only happens once
          </p>
        </div>
      )}

      {/* Code Input */}
      <div style={{ marginBottom: "12px" }}>
        <label
          style={{
            fontSize: "11px",
            color: "#666",
            letterSpacing: "2px",
            display: "block",
            marginBottom: "8px",
          }}
        >
          CODE
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Highlight code on any page, or paste here..."
          style={{
            width: "100%",
            height: "180px",
            background: "#1a1a1a",
            color: "#e0e0e0",
            border: "1px solid #2a2a2a",
            padding: "12px",
            fontFamily: "monospace",
            fontSize: "12px",
            resize: "none",
            boxSizing: "border-box",
            borderRadius: "4px",
            outline: "none",
          }}
        />
      </div>

      {/* Explain Button */}
      <button
        onClick={handleExplain}
        disabled={Boolean(!ready || thinking || !code.trim())}
        style={{
          background: thinking ? "#3d3075" : "#7b61ff",
          color: "white",
          border: "none",
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "13px",
          letterSpacing: "2px",
          cursor:
            !ready || thinking || !code.trim() ? "not-allowed" : "pointer",
          opacity: !ready || thinking || !code.trim() ? 0.5 : 1,
          borderRadius: "4px",
          marginBottom: "16px",
          transition: "all 0.2s",
        }}
      >
        {thinking ? "THINKING..." : "⚡ EXPLAIN"}
      </button>

      {/* Explanation Output */}
      {explanation && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <label
            style={{
              fontSize: "11px",
              color: "#666",
              letterSpacing: "2px",
              display: "block",
              marginBottom: "8px",
            }}
          >
            EXPLANATION
          </label>
          <div
            style={{
              background: "#1a1a1a",
              padding: "16px",
              borderLeft: "3px solid #7b61ff",
              borderRadius: "0 4px 4px 0",
              lineHeight: "1.7",
              fontSize: "13px",
              whiteSpace: "pre-wrap",
            }}
          >
            {explanation}
          </div>
        </div>
      )}

      {/* Hint */}
      {!explanation && ready && (
        <p
          style={{
            color: "#333",
            fontSize: "11px",
            textAlign: "center",
            marginTop: "auto",
            lineHeight: "1.6",
          }}
        >
          Highlight any code on a webpage
          <br />
          and it will appear here automatically
        </p>
      )}
    </div>
  );
}
