import React, { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { analyzeDashboardData } from '../services/geminiService';
import { GeminiAnalysisResult } from '../types';

const GeminiInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeDashboardData();
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to analyze data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-xl shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Sparkles size={18} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold">Gemini AI Insights</h3>
          </div>
          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {loading ? 'Đang phân tích...' : 'Phân tích dữ liệu'}
            </button>
          )}
        </div>

        {!analysis && !loading && (
           <div className="text-slate-400 text-sm">
             Bấm nút trên để Gemini phân tích dữ liệu bán hàng, giao dịch và xu hướng hiện tại của bạn để đưa ra lời khuyên chiến lược.
           </div>
        )}

        {analysis && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/5">
                <div className="flex items-start gap-3">
                    <TrendingUp className="text-emerald-400 mt-0.5 shrink-0" size={18}/>
                    <div>
                        <h4 className="text-sm font-semibold text-emerald-100 mb-1">Tổng Quan</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/5">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="text-amber-400 mt-0.5 shrink-0" size={18}/>
                        <div>
                            <h4 className="text-sm font-semibold text-amber-100 mb-1">Đề Xuất</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{analysis.suggestion}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-rose-400 mt-0.5 shrink-0" size={18}/>
                        <div>
                            <h4 className="text-sm font-semibold text-rose-100 mb-1">Rủi Ro</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{analysis.risk}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <button
              onClick={() => setAnalysis(null)}
              className="mt-2 text-xs text-slate-400 hover:text-white underline underline-offset-2"
            >
              Đặt lại phân tích
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiInsights;