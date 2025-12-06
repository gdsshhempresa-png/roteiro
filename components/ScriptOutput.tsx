import React, { useRef, useEffect } from 'react';
import { Copy, Check, Download, AlignLeft } from 'lucide-react';

interface ScriptOutputProps {
  content: string;
}

const ScriptOutput: React.FC<ScriptOutputProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for streaming content
  useEffect(() => {
    if (content && bottomRef.current) {
        // Only auto-scroll if user is near the bottom to avoid annoyance
        const threshold = 200;
        const container = bottomRef.current.parentElement;
        if(container) {
           const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
           if (isNearBottom) {
             bottomRef.current.scrollIntoView({ behavior: 'smooth' });
           }
        }
    }
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "roteiro-gerado.txt";
    document.body.appendChild(element);
    element.click();
  };

  if (!content) return null;

  // Simple word count approximation
  const wordCount = content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 150); // Average speaking pace

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
            <AlignLeft className="w-5 h-5" />
          </span>
          <div>
             <h2 className="text-white font-semibold">Roteiro Gerado</h2>
             <p className="text-xs text-slate-400">~{wordCount} palavras • {readTimeMinutes} min de leitura (fala)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Baixar .txt"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              copied 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/20'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar Texto'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-900/30 custom-scrollbar">
        <div className="prose prose-invert prose-lg max-w-none">
          {content.split('\n\n').map((paragraph, idx) => (
             paragraph.trim() ? (
                <p key={idx} className="mb-6 text-slate-300 leading-relaxed whitespace-pre-line text-justify">
                  {paragraph}
                </p>
             ) : null
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default ScriptOutput;