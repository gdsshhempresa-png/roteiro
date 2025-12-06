import React from 'react';
import { ScriptItem, GenerationStatus } from '../types';
import { Clock, CheckCircle2, Loader2, AlertCircle, PlayCircle, FileText } from 'lucide-react';

interface ScriptListProps {
  items: ScriptItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ScriptList: React.FC<ScriptListProps> = ({ items, selectedId, onSelect }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-700 bg-slate-900/40">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-400" />
          Fila de Produção
        </h3>
      </div>
      <div className="divide-y divide-slate-700/50 max-h-[400px] overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full text-left p-4 transition-all hover:bg-slate-700/30 flex items-center justify-between group ${
              selectedId === item.id ? 'bg-brand-500/10 border-l-4 border-brand-500' : 'border-l-4 border-transparent'
            }`}
          >
            <div className="min-w-0 flex-1 pr-4">
              <p className={`font-medium truncate ${selectedId === item.id ? 'text-brand-300' : 'text-slate-300'}`}>
                {item.topic}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{item.tone}</span>
                {item.wordCount && (
                  <>
                    <span>•</span>
                    <span>~{item.wordCount} palavras</span>
                  </>
                )}
              </div>
            </div>

            <div className="shrink-0">
              {item.status === GenerationStatus.QUEUED && (
                <div className="flex items-center gap-1.5 text-slate-500 bg-slate-800/80 px-2 py-1 rounded text-xs font-medium">
                  <Clock className="w-3 h-3" /> Fila
                </div>
              )}
              {(item.status === GenerationStatus.LOADING || item.status === GenerationStatus.STREAMING) && (
                <div className="flex items-center gap-1.5 text-brand-400 bg-brand-500/10 px-2 py-1 rounded text-xs font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" /> Gerando
                </div>
              )}
              {item.status === GenerationStatus.COMPLETED && (
                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Pronto
                </div>
              )}
              {item.status === GenerationStatus.ERROR && (
                <div className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs font-medium">
                  <AlertCircle className="w-3 h-3" /> Erro
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScriptList;