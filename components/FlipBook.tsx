
import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, Square, Loader2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Book } from '../types';

// Helpers para decodificação de áudio
function decodeBase64ToUint8(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeRawPCM(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Added FlipBookProps interface to fix "Cannot find name 'FlipBookProps'" error
interface FlipBookProps {
  book: Book;
  onClose: () => void;
}

const FlipBook: React.FC<FlipBookProps> = ({ book, onClose }) => {
  const [viewIndex, setViewIndex] = useState(0); 
  const [dragProgress, setDragProgress] = useState(0); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragSide, setDragSide] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);

  const totalViews = Math.ceil((book.pages.length + 1) / 2) + 1;
  const isBackCoverState = viewIndex === totalViews - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && viewIndex < totalViews - 1) handleNext();
      if (e.key === 'ArrowLeft' && viewIndex > 0) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopSpeaking();
    };
  }, [viewIndex, totalViews, onClose]);

  const stopSpeaking = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  const handleReadAloud = async () => {
    if (isSpeaking) { stopSpeaking(); return; }
    
    setIsTtsLoading(true);
    try {
      const p1 = getPageContent(viewIndex * 2 - 1);
      const p2 = getPageContent(viewIndex * 2);
      let textToRead = viewIndex === 0 ? `Capa: ${book.title}` : `${p1 !== 'empty' ? p1 : ''} ${p2 !== 'empty' ? p2 : ''}`;
      
      // Initializing GoogleGenAI with direct process.env.API_KEY as per guidelines.
      // Removed manual environment checks and alerts to comply with SDK rules.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Leia com voz narrativa: ${textToRead}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeRawPCM(decodeBase64ToUint8(base64Audio), ctx, 24000, 1);
        stopSpeaking();
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        audioSourceRef.current = source;
        source.start();
        setIsSpeaking(true);
      }
    } catch (e) { console.error(e); } finally { setIsTtsLoading(false); }
  };

  const getPageContent = (index: number) => {
    if (index < 0) return "empty";
    if (index === 0) return "cover";
    if (index === book.pages.length + 1) return "back-cover";
    if (index > book.pages.length + 1) return "empty";
    return book.pages[index - 1];
  };

  const handleStart = (clientX: number) => {
    if (isAnimating) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = clientX - rect.left;
    const mid = rect.width / 2;

    if (relX > mid && viewIndex < totalViews - 1) {
      startX.current = clientX;
      setDragSide('next');
      setIsDragging(true);
    } else if (relX < mid && viewIndex > 0) {
      startX.current = clientX;
      setDragSide('prev');
      setIsDragging(true);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !dragSide) return;
    const delta = clientX - startX.current;
    const rectWidth = containerRef.current?.offsetWidth || 800;
    const progress = Math.min(Math.max((Math.abs(delta) / (rectWidth / 2)) * 100, 0), 100);
    setDragProgress(progress);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsAnimating(true);
    if (dragProgress > 25) {
      setDragProgress(100);
      setTimeout(() => {
        setViewIndex(prev => dragSide === 'next' ? prev + 1 : prev - 1);
        setDragProgress(0);
        setIsAnimating(false);
        setDragSide(null);
      }, 600);
    } else {
      setDragProgress(0);
      setTimeout(() => {
        setIsAnimating(false);
        setDragSide(null);
      }, 600);
    }
  };

  const handleNext = () => { if(viewIndex < totalViews - 1) { setDragSide('next'); setIsAnimating(true); setDragProgress(100); setTimeout(() => { setViewIndex(v => v+1); setDragProgress(0); setIsAnimating(false); setDragSide(null); }, 600); } };
  const handlePrev = () => { if(viewIndex > 0) { setDragSide('prev'); setIsAnimating(true); setDragProgress(100); setTimeout(() => { setViewIndex(v => v-1); setDragProgress(0); setIsAnimating(false); setDragSide(null); }, 600); } };

  const PageFace = ({ content, side, shadowIntensity = 0 }: { content: string, side: 'left' | 'right', shadowIntensity?: number }) => (
    <div className={`absolute inset-0 bg-white shadow-inner flex flex-col overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10"></div>
      <div className={`absolute inset-0 pointer-events-none z-20 bg-gradient-to-${side === 'right' ? 'r' : 'l'} from-black/5 to-transparent`}></div>
      {shadowIntensity > 0 && (
        <div className="absolute inset-0 pointer-events-none z-30" style={{ background: `rgba(0,0,0,${shadowIntensity * 0.15})` }}></div>
      )}
      
      <div className={`relative flex-1 p-8 md:p-14 flex flex-col ${side === 'left' ? 'border-r' : 'border-l'} border-stone-100`}>
        {content === "cover" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img src={book.coverImage} className="w-full max-h-80 object-cover shadow-2xl rounded-sm mb-8" />
            <h2 className="text-3xl font-bold serif">{book.title}</h2>
            <p className="text-stone-400 italic text-sm mt-2">{book.subtitle}</p>
          </div>
        ) : content === "back-cover" ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="w-16 h-16 rounded-full bg-stone-100 mb-6 flex items-center justify-center font-bold text-stone-300">EC</div>
             <p className="book-font italic text-stone-500">"As palavras são pontes para o invisível."</p>
          </div>
        ) : content === "empty" ? (
          <div className="flex-1"></div>
        ) : (
          <div className="flex-1 flex flex-col">
            <p className="book-font text-xl leading-relaxed text-stone-800 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
              {content}
            </p>
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-stone-50 flex justify-between text-[10px] text-stone-300 uppercase tracking-widest">
           <span>{book.title}</span>
           <span>{content !== "cover" && content !== "back-cover" && content !== "empty" ? (side === "left" ? "Verso" : "Frente") : ""}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-stone-950/95 backdrop-blur-3xl overflow-hidden select-none">
      
      <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-8 bg-gradient-to-b from-black/20 to-transparent">
        <div className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-4">
           <span className="serif italic text-lg text-white/80">{book.title}</span>
           <span className="h-4 w-px bg-white/10"></span>
           <span>Leitura Interativa</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-all bg-white/5 p-3 rounded-full hover:bg-white/10 flex items-center gap-2 group">
           <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">FECHAR (ESC)</span>
           <X size={20} />
        </button>
      </div>

      <div className="relative w-full max-w-6xl flex-1 flex flex-col items-center justify-center">
        
        <div 
          ref={containerRef}
          className="relative w-full h-[650px] flex items-center justify-center perspective-2000 touch-none"
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div className="absolute bottom-[5%] w-3/4 h-12 bg-black/50 blur-[120px] rounded-full"></div>

          <div className={`relative w-[840px] h-full preserve-3d flex transition-transform duration-700 ease-in-out
            ${viewIndex === 0 ? 'translate-x-[210px]' : isBackCoverState ? '-translate-x-[210px]' : ''}
          `}>
            
            <div className={`relative flex-1 transition-opacity duration-300 ${viewIndex === 0 && dragSide !== 'prev' ? 'opacity-0' : 'opacity-100'}`}>
              <PageFace 
                content={dragSide === 'prev' ? getPageContent((viewIndex - 1) * 2 - 1) : getPageContent(viewIndex * 2 - 1)} 
                side="left" 
                shadowIntensity={dragSide === 'prev' ? dragProgress / 100 : 0}
              />
            </div>

            <div className={`relative flex-1 transition-opacity duration-300 ${isBackCoverState && dragSide !== 'next' ? 'opacity-0' : 'opacity-100'}`}>
              <PageFace 
                content={dragSide === 'next' ? getPageContent((viewIndex + 1) * 2) : getPageContent(viewIndex * 2)} 
                side="right" 
                shadowIntensity={dragSide === 'next' ? dragProgress / 100 : 0}
              />
            </div>

            {(dragSide || isAnimating) && (
              <div 
                className={`absolute top-0 h-full w-1/2 preserve-3d z-50 ${dragSide === 'next' ? 'right-0 origin-left' : 'left-0 origin-right'}`}
                style={{ 
                  transform: `rotateY(${dragSide === 'next' ? -dragProgress * 1.8 : dragProgress * 1.8}deg) translateZ(1px)`,
                  transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="absolute inset-0 backface-hidden z-20">
                  <PageFace 
                    content={dragSide === 'next' ? getPageContent(viewIndex * 2) : getPageContent(viewIndex * 2 - 1)} 
                    side={dragSide === 'next' ? 'right' : 'left'} 
                    shadowIntensity={dragProgress / 200}
                  />
                </div>
                <div className={`absolute inset-0 backface-hidden z-10 ${dragSide === 'next' ? '[transform:rotateY(180deg)]' : '[transform:rotateY(-180deg)]'}`}>
                  <PageFace 
                    content={dragSide === 'next' ? getPageContent((viewIndex + 1) * 2 - 1) : getPageContent((viewIndex - 1) * 2)} 
                    side={dragSide === 'next' ? 'left' : 'right'} 
                    shadowIntensity={(100 - dragProgress) / 200}
                  />
                </div>
              </div>
            )}
            
            <div className={`absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/10 z-[100] ${(viewIndex === 0 || isBackCoverState) ? 'opacity-0' : 'opacity-100'}`}></div>
          </div>
        </div>

        <button onClick={handlePrev} className={`absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all ${viewIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <ChevronLeft size={32} />
        </button>
        <button onClick={handleNext} className={`absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all ${isBackCoverState ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <ChevronRight size={32} />
        </button>

      </div>

      <div className="mb-12 w-full max-w-xl flex flex-col items-center gap-6">
        <div className="w-full flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
           <button 
             onClick={handleReadAloud} 
             disabled={isTtsLoading}
             className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all flex items-center gap-3 active:scale-95"
           >
             {isTtsLoading ? <Loader2 size={20} className="animate-spin" /> : isSpeaking ? <Square size={20} className="fill-white" /> : <Volume2 size={20} />}
             <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Voz Alta</span>
           </button>

           <div className="flex flex-col items-center flex-1">
             <span className="text-sm serif italic text-white/90">
               {viewIndex === 0 ? "Capa" : isBackCoverState ? "Fim" : `Folhas ${viewIndex * 2 - 1} e ${viewIndex * 2}`}
             </span>
             <div className="w-24 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
               <div className="h-full bg-white/40 transition-all duration-500" style={{ width: `${(viewIndex / (totalViews - 1)) * 100}%` }}></div>
             </div>
           </div>

           <button onClick={onClose} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-200 rounded-2xl transition-all flex items-center gap-3 border border-red-500/20 active:scale-95">
             <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Sair</span>
             <LogOut size={20} />
           </button>
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-medium animate-pulse">Arraste a borda da folha para navegar</p>
      </div>
    </div>
  );
};

export default FlipBook;
