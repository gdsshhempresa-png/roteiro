import React, { useState, useRef } from 'react';
import ScriptForm from './components/ScriptForm';
import ScriptOutput from './components/ScriptOutput';
import ScriptList from './components/ScriptList';
import { generateScriptStream } from './services/geminiService';
import { ScriptItem, GenerationStatus, ScriptRequest } from './types';
import { Sparkles, AlertCircle, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<ScriptItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use ref to track active processing to avoid closure staleness issues in loops if needed, 
  // though we will use a functional approach for queue processing.

  const handleBatchSubmit = async (topics: string[], tone: string, targetAudience: string) => {
    // Create new items
    const newItems: ScriptItem[] = topics.map(topic => ({
      id: crypto.randomUUID(),
      topic,
      tone,
      targetAudience,
      content: '',
      status: GenerationStatus.QUEUED,
    }));

    // Add to state
    setItems(prev => [...newItems, ...prev]);
    
    // Select the first new item automatically if nothing is selected
    if (!selectedId && newItems.length > 0) {
      setSelectedId(newItems[0].id);
    }

    // Start processing queue if not already running
    if (!isGenerating) {
      processQueue([...newItems]); // Pass the new items to start processing
    }
  };

  const processQueue = async (queue: ScriptItem[]) => {
    setIsGenerating(true);
    
    // We process sequentially to ensure quality and avoid rate limits with massive contexts
    for (const item of queue) {
      await generateItem(item.id, {
        topic: item.topic,
        tone: item.tone,
        targetAudience: item.targetAudience
      });
    }

    setIsGenerating(false);
  };

  const generateItem = async (id: string, request: ScriptRequest) => {
    // Update status to LOADING
    updateItemStatus(id, GenerationStatus.LOADING);

    try {
      // Switch to STREAMING once we start
      updateItemStatus(id, GenerationStatus.STREAMING);
      
      await generateScriptStream(request, (chunk) => {
        setItems(prev => prev.map(item => {
          if (item.id === id) {
            const newContent = item.content + chunk;
            return {
              ...item,
              content: newContent,
              // Update word count estimate roughly every chunk
              wordCount: newContent.split(/\s+/).length
            };
          }
          return item;
        }));
      });

      updateItemStatus(id, GenerationStatus.COMPLETED);
    } catch (error) {
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: GenerationStatus.ERROR, error: error instanceof Error ? error.message : "Erro desconhecido" } 
          : item
      ));
    }
  };

  const updateItemStatus = (id: string, status: GenerationStatus) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-brand-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              RoteiroFlow AI <span className="text-xs font-normal text-brand-400 border border-brand-500/30 rounded px-1.5 py-0.5 ml-2">PRO</span>
            </h1>
          </div>
          <div className="text-sm text-slate-400 hidden sm:flex items-center gap-4">
             <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Batch Mode Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full gap-6 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Input & Queue */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-[calc(100vh-8rem)] sticky top-24">
          <ScriptForm onSubmit={handleBatchSubmit} isGenerating={isGenerating} />
          
          <div className="flex-1 overflow-hidden min-h-[300px] flex flex-col">
             <ScriptList items={items} selectedId={selectedId} onSelect={handleSelect} />
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8 h-[calc(100vh-8rem)] flex flex-col">
          {selectedItem ? (
            <>
              {selectedItem.status === GenerationStatus.ERROR && (
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-400 mb-4 shrink-0">
                   <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                   <div>
                     <h3 className="font-semibold text-red-300">Erro na Geração</h3>
                     <p className="text-sm">{selectedItem.error}</p>
                   </div>
                 </div>
              )}
              <div className="flex-1 overflow-hidden rounded-2xl shadow-2xl border border-slate-700/50">
                 <ScriptOutput content={selectedItem.content} />
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-800/30 border border-slate-700/50 rounded-2xl border-dashed p-12 text-center text-slate-500">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                <Layers className="w-8 h-8 opacity-20" />
              </div>
              <h3 className="text-xl font-medium text-slate-300">Pronto para Produzir</h3>
              <p className="max-w-md mx-auto mt-3 text-slate-400">
                Adicione até 10 tópicos na lista ao lado para gerar múltiplos roteiros massivos (5000+ palavras) em sequência.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;