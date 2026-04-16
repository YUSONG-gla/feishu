"use client";

import { useState } from "react";

interface InputPageProps {
  onAnalyze: (text: string) => void;
  apiError?: string | null;
}

export function InputPage({ onAnalyze, apiError }: InputPageProps) {
  const [text, setText] = useState("");
  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) {
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setShowError(false);
    onAnalyze(text);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-[15vh] px-4">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl">
        {/* Logo Placeholder */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
            爆文潜力测试！
          </h1>
        </div>
        <p className="text-base md:text-lg text-gray-600 font-medium">
          你的文字，真的能击中ta们吗？
        </p>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-2xl relative">
        {/* Error Speech Bubble */}
        {(showError || apiError) && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-fade-in-up">
            <div className="relative bg-white border-2 border-black px-4 py-2">
              <span className="text-sm font-medium">
                {apiError || "哎呀，你还没给我投喂文字呢。"}
              </span>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black" />
              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white" />
            </div>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (showError) setShowError(false);
          }}
          placeholder="粘贴一段小红书文案，让我们通过 9 大维度探索它触动人心的原因..."
          className={`w-full h-48 md:h-56 p-4 border-2 border-black bg-white resize-none focus:outline-none focus:ring-0 text-base placeholder:text-gray-400 transition-all ${
            shake ? "animate-shake" : ""
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-4 bg-black text-white font-bold text-lg border-2 border-black hover:bg-white hover:text-black transition-colors duration-200"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          开始 AI 深度测评
        </button>
      </div>

      {/* Footer hint */}
      <p className="mt-8 text-sm text-gray-400">
        支持分析各类小红书笔记文案
      </p>
    </div>
  );
}
