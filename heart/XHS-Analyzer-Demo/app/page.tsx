"use client";

import { useState } from "react";
import { InputPage } from "@/components/input-page";
import { LoadingPage } from "@/components/loading-page";
import { ResultPage } from "@/components/result-page";

type PageState = "input" | "loading" | "result";

interface AnalysisResult {
  metrics: {
    vividness_emotion: number;
    vividness_setting: number;
    vulnerability: number;
    cognition: number;
    tone: number;
    volume: number;
    resolution: number;
    development: number;
    emo_shift: number;
  };
  totalScore: number;
  dimensionAnalysis: string;
  overallEvaluation: string;
}

interface DimensionScore {
  name: string;
  key: string;
  score: number;
  reason: string;
}

interface BackendResponse {
  success: boolean;
  dimensions: DimensionScore[];
  total_score: number;
  calculation_process: string;
  evaluation: string;
  model_used: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setApiError(null);
    setPageState("loading");

    try {
      const response = await fetch(`${API_BASE}/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.detail || `请求失败 (${response.status})`;
        throw new Error(msg);
      }

      const data: BackendResponse = await response.json();

      const metricsMap = data.dimensions.reduce<Record<string, number>>(
        (acc, dim) => { acc[dim.key] = dim.score; return acc; },
        {}
      );

      setAnalysisResult({
        metrics: {
          vividness_emotion: metricsMap.vividness_emotion ?? 0,
          vividness_setting: metricsMap.vividness_setting ?? 0,
          vulnerability: metricsMap.vulnerability ?? 0,
          cognition: metricsMap.cognition ?? 0,
          tone: metricsMap.tone ?? 0,
          volume: metricsMap.volume ?? 0,
          resolution: metricsMap.resolution ?? 0,
          development: metricsMap.development ?? 0,
          emo_shift: metricsMap.emo_shift ?? 0,
        },
        totalScore: data.total_score,
        dimensionAnalysis: data.calculation_process,
        overallEvaluation: data.evaluation,
      });
      setPageState("result");
    } catch (error) {
      const message = error instanceof Error ? error.message : "评分失败，请稍后再试";
      setApiError(message);
      setPageState("input");
    }
  };

  const handleReset = () => {
    setPageState("input");
    setAnalysisResult(null);
    setApiError(null);
  };

  return (
    <main>
      {pageState === "input" && (
        <InputPage onAnalyze={handleAnalyze} apiError={apiError} />
      )}
      {pageState === "loading" && <LoadingPage />}
      {pageState === "result" && analysisResult && (
        <ResultPage result={analysisResult} onReset={handleReset} />
      )}
    </main>
  );
}
