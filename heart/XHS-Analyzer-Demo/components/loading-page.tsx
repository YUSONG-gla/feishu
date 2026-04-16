"use client";

import { useState, useEffect } from "react";

const loadingMessages = [
  "正在识别叙事元素...",
  "正在扫描：环境与情感生动性...",
  "正在评估：角色情感脆弱程度...",
  "正在抓取：认知思考表述...",
  "正在解析：情节体量与矛盾解决...",
  "正在计算：角色发展与情绪转变...",
  "正在通过 DAG 逻辑构建打分矩阵...",
  "正在应用权重公式生成共情指数...",
];

export function LoadingPage() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Floating Avatar */}
      <div className="animate-float mb-8">
        <div className="w-24 h-24 border-2 border-black flex items-center justify-center bg-white">
          {/* HeyTea style character placeholder */}
          <svg
            className="w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Simple face */}
            <circle cx="32" cy="32" r="24" />
            {/* Eyes */}
            <circle cx="24" cy="28" r="2" fill="currentColor" />
            <circle cx="40" cy="28" r="2" fill="currentColor" />
            {/* Thinking expression */}
            <path d="M24 40 Q32 44 40 40" strokeLinecap="round" />
            {/* Thinking dots */}
            <circle cx="50" cy="12" r="2" fill="currentColor" />
            <circle cx="56" cy="8" r="3" fill="currentColor" />
            <circle cx="54" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Scanning Line Container */}
      <div className="relative w-64 h-1 bg-gray-100 border border-black overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black animate-scan" />
      </div>

      {/* Scrolling Text */}
      <div className="h-8 overflow-hidden">
        <p
          key={currentMessageIndex}
          className="text-base font-medium text-black animate-slide-in"
        >
          {loadingMessages[currentMessageIndex]}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 border border-black"
            style={{
              backgroundColor: i <= Math.floor(currentMessageIndex / 3) ? "black" : "white",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
