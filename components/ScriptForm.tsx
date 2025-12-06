import React, { useState } from 'react';
import { ScriptRequest, TONE_OPTIONS, GenerationStatus } from '../types';
import { Layers, Loader2, Plus, Info } from 'lucide-react';

interface ScriptFormProps {
  onSubmit: (topics: string[], tone: string, targetAudience: string) => void;
  isGenerating: boolean;
}

const ScriptForm: React.FC<ScriptFormProps> = ({ onSubmit, isGenerating }) => {
  const [topicsInput, setTopicsInput] = useState('');
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  const [targetAudience, setTargetAudience] = useState('');

  const getTopics = () => topicsInput.split('\n').filter(t => t.trim().length > 0);
  const topicsCount = getTopics().length;
  const isOverLimit = topicsCount > 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topics = getTopics();
    if (topics.length === 0 || isOverLimit) return;
    onSubmit(topics, tone, targetAudience || 'Geral');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">1</span>
        Configuração em Lote
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Tópicos dos Vídeos (1 por linha)
            </label>
            <span className={`text-xs px-2 py-0.5 rounded-full ${isOverLimit ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
              {topicsCount} / 10
            </span>
          </div>
          <textarea
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            placeholder={`Exemplo:\nA História da Apple\nComo investir em Bitcoin\nMistérios do Egito...`}
            className={`w-full h-40 bg-slate-900/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none ${
              isOverLimit ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-brand-500'
            }`}
            disabled={isGenerating}
          />
          {isOverLimit && (
            <p className="text-red-400 text-xs mt-1">Limite máximo de 10 tópicos por vez.</p>
          )}
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Cada linha será um roteiro separado de ~5000 palavras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tom de Voz
            </label>
            <div className="relative">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none transition-all"
                disabled={isGenerating}
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Público Alvo
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex: Curiosos, Jovens..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating || topicsCount === 0 || isOverLimit}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              isGenerating || topicsCount === 0 || isOverLimit
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processando Fila...
              </>
            ) : (
              <>
                <Layers className="w-5 h-5" />
                Gerar {topicsCount > 0 ? topicsCount : ''} Roteiro{topicsCount !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScriptForm;