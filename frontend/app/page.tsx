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

// Generate realistic random values for demo
function generateAnalysisResult(text: string): AnalysisResult {
  // Use text length and content to influence scores slightly
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(text);
  const hasQuestion = text.includes("?") || text.includes("？");
  const hasExclamation = text.includes("!") || text.includes("！");
  const textLength = text.length;
  
  // Base randomness with slight influence from text characteristics
  const baseScore = 4 + Math.random() * 4;
  const lengthBonus = Math.min(textLength / 500, 1) * 1.5;
  const emojiBonus = hasEmoji ? 0.5 : 0;
  const questionBonus = hasQuestion ? 0.3 : 0;
  const exclamationBonus = hasExclamation ? 0.3 : 0;
  
  const generateMetric = () => {
    const value = baseScore + lengthBonus + emojiBonus + questionBonus + exclamationBonus + (Math.random() - 0.5) * 3;
    return Math.max(1, Math.min(10, value));
  };

  const metrics = {
    vividness_emotion: generateMetric(),
    vividness_setting: generateMetric(),
    vulnerability: generateMetric(),
    cognition: generateMetric(),
    tone: generateMetric(),
    volume: generateMetric(),
    resolution: generateMetric(),
    development: generateMetric(),
    emo_shift: generateMetric(),
  };

  // Calculate weighted total score
  const weights = {
    vividness_emotion: 0.12,
    vividness_setting: 0.10,
    vulnerability: 0.15,
    cognition: 0.10,
    tone: 0.10,
    volume: 0.10,
    resolution: 0.10,
    development: 0.12,
    emo_shift: 0.11,
  };

  const totalScore = Object.entries(metrics).reduce(
    (sum, [key, value]) => sum + value * weights[key as keyof typeof weights],
    0
  );

  // Generate analysis text based on scores
  const highMetrics = Object.entries(metrics)
    .filter(([, value]) => value >= 7)
    .map(([key]) => {
      const labels: Record<string, string> = {
        vividness_emotion: "情感生动性",
        vividness_setting: "环境生动性",
        vulnerability: "角色情感脆弱程度",
        cognition: "认知思考表述",
        tone: "语气情绪",
        volume: "情节体量",
        resolution: "矛盾解决",
        development: "角色发展",
        emo_shift: "情绪转变",
      };
      return labels[key];
    });

  const dimensionAnalysis = highMetrics.length > 0
    ? `文案在${highMetrics.slice(0, 3).join("、")}等维度表现突出。叙事结构层次分明，情感表达真实细腻，能够有效建立与读者的情感连接。DAG 算法识别出多个共情触发节点，形成了完整的情感闭环。`
    : `文案整体表达较为平淡，各维度得分相对均衡但缺乏亮点。建议增强情感表达的深度和细节描写，通过具体场景和个人经历来提升共情效果。`;

  const overallEvaluation = totalScore >= 8
    ? `这是一篇极具感染力的文案！通过 HEART 叙事理论分析，该文案成功构建了完整的情感叙事弧线，角色塑造立体丰富，情感转折自然流畅。预计能够在小红书平台获得较高的互动率和传播度。`
    : totalScore >= 6
    ? `文案具备一定的共情潜力，叙事逻辑清晰，情感表达有一定深度。建议在细节描写和情感高潮部分进一步打磨，增加更多能够触动读者内心的元素。`
    : totalScore >= 4
    ? `文案基础框架完整，但共情元素相对薄弱。建议：1) 增加个人真实经历的细节；2) 强化情感转折的戏剧性；3) 使用更具画面感的语言描述。`
    : `文案需要较大幅度的优化。当前叙事过于平铺直叙，缺乏能够引发读者共鸣的核心情感元素。建议重新思考文案的情感定位，找到能够触动目标受众的痛点或共鸣点。`;

  return {
    metrics,
    totalScore,
    dimensionAnalysis,
    overallEvaluation,
  };
}

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (text: string) => {
    setPageState("loading");
    
    // Simulate 2-second loading
    setTimeout(() => {
      const result = generateAnalysisResult(text);
      setAnalysisResult(result);
      setPageState("result");
    }, 2000);
  };

  const handleReset = () => {
    setPageState("input");
    setAnalysisResult(null);
  };

  return (
    <main>
      {pageState === "input" && <InputPage onAnalyze={handleAnalyze} />}
      {pageState === "loading" && <LoadingPage />}
      {pageState === "result" && analysisResult && (
        <ResultPage result={analysisResult} onReset={handleReset} />
      )}
    </main>
  );
}
