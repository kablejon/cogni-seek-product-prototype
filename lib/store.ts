import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchSession, initialSearchSession } from './types';
import { AIAnalysisResult } from './ai-service';

interface SearchStore {
  session: SearchSession;
  analysisResult: AIAnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  updateSession: (data: Partial<SearchSession>) => void;
  setAnalysisResult: (result: AIAnalysisResult | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  resetSession: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      session: initialSearchSession,
      analysisResult: null,
      isAnalyzing: false,
      analysisError: null,
      updateSession: (data) =>
        set((state) => ({
          session: { ...state.session, ...data },
        })),
      setAnalysisResult: (result) =>
        set({ analysisResult: result }),
      setIsAnalyzing: (isAnalyzing) =>
        set({ isAnalyzing }),
      setAnalysisError: (error) =>
        set({ analysisError: error }),
      resetSession: () =>
        set({
          session: initialSearchSession,
          analysisResult: null,
          isAnalyzing: false,
          analysisError: null,
        }),
    }),
    {
      name: 'cogniseek-search-session',
    }
  )
);
