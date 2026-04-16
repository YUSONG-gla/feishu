"use client";

import { useMemo, useState, useEffect } from "react";
import { RadarChart } from "./radar-chart";

interface Metrics {
  vividness_emotion: number;
  vividness_setting: number;
  vulnerability: number;
  cognition: number;
  tone: number;
  volume: number;
  resolution: number;
  development: number;
  emo_shift: number;
}

interface AnalysisResult {
  metrics: Metrics;
  totalScore: number;
  dimensionAnalysis: string;
  overallEvaluation: string;
}

interface ResultPageProps {
  result: AnalysisResult;
  onReset: () => void;
}

// Helper to generate random metrics within a range
function generateRandomMetrics(min: number, max: number): Metrics {
  const randomInRange = () => min + Math.random() * (max - min);
  return {
    vividness_emotion: randomInRange(),
    vividness_setting: randomInRange(),
    vulnerability: randomInRange(),
    cognition: randomInRange(),
    tone: randomInRange(),
    volume: randomInRange(),
    resolution: randomInRange(),
    development: randomInRange(),
    emo_shift: randomInRange(),
  };
}

export function ResultPage({ result, onReset }: ResultPageProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [testMode, setTestMode] = useState<"normal" | "high" | "low" | "mid">("normal");
  
  // Calculate effective result based on test mode
  const effectiveResult = useMemo(() => {
    if (testMode === "high") {
      return {
        ...result,
        totalScore: 9.2,
        metrics: generateRandomMetrics(8, 10),
        dimensionAnalysis: "文案在情感生动性、角色发展、情绪转变等维度表现极为突出。叙事结构层次分明，情感表达真实细腻，能够有效建立与读者的深度情感连接。DAG 算法识别出多个高强度共情触发节点，形成了完整且动人的情感闭环。",
        overallEvaluation: "这是一篇极具感染力的文案！通过 HEART 叙事理论分析，该文案成功构建了完整的情感叙事弧线，角色塑造立体丰富，情感转折自然流畅。预计能够在小红书平台获得极高的互动率和传播度。"
      };
    } else if (testMode === "low") {
      return {
        ...result,
        totalScore: 3.5,
        metrics: generateRandomMetrics(1, 5),
        dimensionAnalysis: "文案整体表达较为平淡，各维度得分相对偏低。叙事缺乏起伏，情感表达较为浅显，难以与读者建立有效的情感连接。",
        overallEvaluation: "文案需要较大幅度的优化。当前叙事过于平铺直叙，缺乏能够引发读者共鸣的核心情感元素。建议重新思考文案的情感定位，找到能够触动目标受众的痛点或共鸣点。"
      };
    } else if (testMode === "mid") {
      return {
        ...result,
        totalScore: 5.8,
        metrics: generateRandomMetrics(4, 7),
        dimensionAnalysis: "文案各维度表现较为均衡，具备基础的叙事框架和情感表达。部分维度有一定亮点，但整体缺乏突破性的情感触发点。",
        overallEvaluation: "文案具备一定的共情潜力，叙事逻辑清晰，情感表达有一定深度。建议在细节描写和情感高潮部分进一步打磨，增加更多能够触动读者内心的元素。"
      };
    }
    return result;
  }, [result, testMode]);
  
  const isHighScore = effectiveResult.totalScore >= 8;
  const isLowScore = effectiveResult.totalScore < 4;

  useEffect(() => {
    if (isHighScore) {
      setShowCelebration(false);
      setTimeout(() => setShowCelebration(true), 300);
    } else {
      setShowCelebration(false);
    }
  }, [isHighScore, testMode]);

  const radarData = useMemo(() => [
    { label: "情感", value: effectiveResult.metrics.vividness_emotion, fullLabel: "情感生动性" },
    { label: "环境", value: effectiveResult.metrics.vividness_setting, fullLabel: "环境生动性" },
    { label: "脆弱", value: effectiveResult.metrics.vulnerability, fullLabel: "角色情感脆弱程度" },
    { label: "认知", value: effectiveResult.metrics.cognition, fullLabel: "认知思考表述" },
    { label: "语气", value: effectiveResult.metrics.tone, fullLabel: "语气情绪" },
    { label: "情节", value: effectiveResult.metrics.volume, fullLabel: "情节体量" },
    { label: "解决", value: effectiveResult.metrics.resolution, fullLabel: "矛盾解决" },
    { label: "发展", value: effectiveResult.metrics.development, fullLabel: "角色发展" },
    { label: "转变", value: effectiveResult.metrics.emo_shift, fullLabel: "情绪转变" },
  ], [effectiveResult.metrics]);

  const cardBaseClass = `bg-white border-2 border-black p-4 md:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`;
  // High score uses inner shadow instead of thicker border to maintain consistent sizing
  const highScoreCardClass = isHighScore ? "ring-1 ring-black ring-inset" : "";

  return (
    <div 
      className={`min-h-screen px-4 py-8 md:py-12 transition-colors duration-500 ${
        isLowScore ? "bg-[#FAF9F6]" : "bg-white"
      }`}
      style={{ opacity: isLowScore ? 0.9 : 1 }}
    >
      {/* Celebration Animation for High Score */}
      {showCelebration && isHighScore && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(16)].map((_, i) => {
            // Generate stable positions for each shape
            const positions = [
              { left: 10, top: 15 }, { left: 85, top: 10 }, { left: 20, top: 70 },
              { left: 75, top: 80 }, { left: 50, top: 5 }, { left: 5, top: 45 },
              { left: 90, top: 50 }, { left: 60, top: 85 }, { left: 30, top: 25 },
              { left: 70, top: 35 }, { left: 15, top: 90 }, { left: 80, top: 65 },
              { left: 45, top: 55 }, { left: 25, top: 45 }, { left: 65, top: 20 },
              { left: 40, top: 75 }
            ];
            const pos = positions[i];
            const shapeType = i % 4;
            
            return (
              <div
                key={i}
                className="absolute animate-pop"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                {shapeType === 0 ? (
                  // Circle - HeyTea style hollow
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ) : shapeType === 1 ? (
                  // Star - HeyTea style hollow
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                    <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
                  </svg>
                ) : shapeType === 2 ? (
                  // Diamond - HeyTea style hollow
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                    <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
                  </svg>
                ) : (
                  // Triangle - HeyTea style hollow
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                    <polygon points="12,3 22,21 2,21" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            测评结果
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {/* Test Mode Buttons */}
            <div className="flex items-center gap-1 mr-4">
              <span className="text-xs text-gray-400 mr-1">测试模式:</span>
              <button
                onClick={() => setTestMode("high")}
                className={`px-2 py-1 text-xs border transition-colors duration-200 ${
                  testMode === "high" 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 bg-white text-gray-600 hover:border-black"
                }`}
              >
                模拟高分
              </button>
              <button
                onClick={() => setTestMode("mid")}
                className={`px-2 py-1 text-xs border transition-colors duration-200 ${
                  testMode === "mid" 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 bg-white text-gray-600 hover:border-black"
                }`}
              >
                模拟中间分
              </button>
              <button
                onClick={() => setTestMode("low")}
                className={`px-2 py-1 text-xs border transition-colors duration-200 ${
                  testMode === "low" 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 bg-white text-gray-600 hover:border-black"
                }`}
              >
                模拟低分
              </button>
              {testMode !== "normal" && (
                <button
                  onClick={() => setTestMode("normal")}
                  className="px-2 py-1 text-xs border border-gray-300 bg-white text-gray-400 hover:border-black hover:text-black transition-colors duration-200"
                >
                  还原
                </button>
              )}
            </div>
            <button
              onClick={onReset}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 font-medium"
            >
              重新测评
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Radar Chart - 2x2 */}
          <div className={`md:col-span-2 md:row-span-2 ${cardBaseClass} ${highScoreCardClass} overflow-hidden`}>
            <h2 className="text-lg font-bold mb-2 md:mb-4" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              HEART 叙事维度解析
            </h2>
            <div className="w-full flex justify-center items-center">
              <RadarChart data={radarData} />
            </div>
          </div>

          {/* Total Score - 1x1 */}
          <div className={`${cardBaseClass} ${highScoreCardClass} flex flex-col justify-center items-center`}>
            <h2 className="text-sm font-medium text-gray-600 mb-2">共情力指数</h2>
            <div 
              className="text-6xl md:text-7xl font-black"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              {effectiveResult.totalScore.toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              基于 9 大维度加权计算得出
            </p>
            {isHighScore && (
              <p className="mt-4 text-sm font-bold text-center" style={{ fontFamily: 'cursive, sans-serif' }}>
                这篇文案，自带引力！
              </p>
            )}
            {isLowScore && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                {"文字还在沉睡，再多给它一点灵魂吧。"}
              </p>
            )}
          </div>

          {/* Traffic Predictor - 1x1 */}
          <div className={`${cardBaseClass} flex flex-col justify-center items-center`} style={{ opacity: 0.6 }}>
            <h2 className="text-sm font-medium text-gray-400 mb-2">爆文潜力预估</h2>
            <div className="text-2xl font-bold text-gray-400">Beta</div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              功能开发中 / Under Testing
            </p>
          </div>

          {/* Analysis Reports - 2x1 */}
          <div className={`md:col-span-2 ${cardBaseClass} ${highScoreCardClass}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-black" />
                  维度判定理由
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {effectiveResult.dimensionAnalysis}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-black" />
                  综合评价
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {effectiveResult.overallEvaluation}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Detail Cards */}
          {radarData.slice(0, 3).map((metric, i) => (
            <div key={i} className={`${cardBaseClass} ${highScoreCardClass}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.fullLabel}</h3>
                <span className="text-xl font-bold">{metric.value.toFixed(1)}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 border border-black">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${metric.value * 10}%` }}
                />
              </div>
            </div>
          ))}

          {/* Remaining Metrics */}
          <div className={`md:col-span-4 ${cardBaseClass} ${highScoreCardClass}`}>
            <h3 className="text-sm font-bold mb-4">更多维度得分</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {radarData.slice(3).map((metric, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold">{metric.value.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-1">{metric.fullLabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Score Character Icon */}
        {isLowScore && (
          <div className="fixed bottom-8 right-8 opacity-60">
            <div className="w-16 h-16 border-2 border-black bg-white flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="20" cy="20" r="15" />
                <circle cx="14" cy="17" r="1.5" fill="currentColor" />
                <circle cx="26" cy="17" r="1.5" fill="currentColor" />
                <path d="M14 26 Q20 23 26 26" />
                <circle cx="32" cy="8" r="1" fill="currentColor" />
                <circle cx="35" cy="5" r="1.5" fill="currentColor" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
