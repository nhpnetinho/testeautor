
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FlipBook from './components/FlipBook';
import ChatAssistant from './components/ChatAssistant';
import NewsletterModal from './components/NewsletterModal';
import { BOOKS, WRITER_NAME, WRITER_BIO, TESTIMONIALS } from './constants';
import { Book } from './types';
import { BookOpen, Scroll, Mail, Instagram, Twitter, Send, ArrowRight, Quote, Award, BookText, Facebook } from 'lucide-react';

const App: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    setTimeout(() => setContactStatus('sent'), 2000);
    setTimeout(() => setContactStatus('idle'), 6000);
  };

  return (
    <div className="min-h-screen flex flex-col grain-bg overflow-x-hidden">
      <Navbar onOpenNewsletter={() => setIsNewsletterOpen(true)} />

      {/* Hero Section */}
      <header id="inicio" className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden bg-[#faf8f5]">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-stone-200/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-stone-100/60 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative">
          <div className="lg:col-span-7 space-y-12 reveal">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-stone-900 text-stone-100 text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
              <Award size={16} className="text-amber-400" /> Vencedor do Prêmio Literário 2024
            </div>
            <h1 className="text-8xl md:text-[11rem] font-black leading-[0.85] tracking-tighter text-stone-900">
              Versos de <br />
              <span className="italic serif text-stone-300 font-normal">Eternidade.</span>
            </h1>
            <p className="text-2xl text-stone-500 max-w-xl leading-relaxed font-light book-font">
              Cada palavra é uma semente de pensamento. Explore o universo literário de <span className="font-bold text-stone-900 border-b-2 border-stone-200">{WRITER_NAME}</span> e descubra o que o silêncio tem a dizer.
            </p>
            <div className="flex flex-wrap gap-8 pt-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('livros');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-stone-900 text-white px-12 py-6 rounded-full font-bold hover:bg-stone-800 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] flex items-center gap-4 hover-lift"
              >
                Explorar Biblioteca <BookOpen size={24} />
              </button>
              <button 
                onClick={() => setIsNewsletterOpen(true)}
                className="group border-2 border-stone-200 px-12 py-6 rounded-full font-bold hover:bg-white hover:border-stone-900 transition-all flex items-center gap-3"
              >
                Círculo Íntimo <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative reveal delay-500">
             <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_60px_100px_-30px_rgba(0,0,0,0.5)] group aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200" 
                  alt="Creative Books" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply group-hover:opacity-0 transition-opacity"></div>
             </div>
             <div className="absolute -bottom-12 -left-12 bg-white p-10 rounded-[2.5rem] shadow-2xl z-20 hidden md:block border border-stone-100 animate-float">
                <Quote size={40} className="text-stone-200 mb-6" />
                <p className="serif text-2xl italic max-w-[240px] leading-snug">"O papel é o espelho da alma inquieta."</p>
             </div>
          </div>
        </div>
      </header>

      {/* Books Gallery */}
      <section id="livros" className="py-40 px-6 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#faf8f5] to-white"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10 reveal">
            <div className="space-y-6">
              <span className="text-stone-400 font-black uppercase tracking-[0.5em] text-xs">Obras Publicadas</span>
              <h2 className="text-6xl md:text-8xl font-bold tracking-tight serif italic">Contos & Romances</h2>
            </div>
            <p className="text-stone-400 max-w-sm text-xl italic font-light">Selecione uma obra para iniciar uma experiência de leitura imersiva e interativa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {BOOKS.map((book, idx) => (
              <div 
                key={book.id} 
                className="group reveal cursor-pointer"
                style={{ transitionDelay: `${idx * 200}ms` }}
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative mb-10 overflow-hidden rounded-[3rem] aspect-[3/4.2] shadow-2xl transition-all duration-1000 group-hover:-translate-y-6 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
                  <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="absolute bottom-10 left-10 right-10 text-white space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-300">{book.genre}</span>
                    <h3 className="text-4xl font-bold serif italic">{book.title}</h3>
                    <div className="h-0 group-hover:h-16 overflow-hidden transition-all duration-700 flex items-center">
                       <span className="px-8 py-3 bg-white text-stone-900 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Abrir Exemplar</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 space-y-4">
                  <p className="text-stone-500 line-clamp-2 text-lg italic book-font leading-relaxed">{book.description}</p>
                  <div className="w-12 h-0.5 bg-stone-200 group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Visual Separator */}
      <section className="h-[60vh] relative overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover scale-110" 
          alt="Library Parallax"
        />
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center space-y-8 reveal">
           <h2 className="text-6xl md:text-8xl text-white font-black serif italic tracking-tight">"O silêncio é o <br/> rascunho de Deus."</h2>
           <div className="w-24 h-1 bg-white mx-auto"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-40 px-6 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
          <div className="grid grid-cols-2 gap-6 reveal">
            <div className="space-y-6 pt-20">
              <img src="https://images.unsplash.com/photo-1457369804590-52c15a466c9a?q=80&w=800" className="rounded-[3rem] shadow-2xl aspect-square object-cover hover:rotate-2 transition-transform duration-700" />
              <img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800" className="rounded-[3rem] shadow-2xl aspect-[3/4] object-cover hover:-rotate-2 transition-transform duration-700" />
            </div>
            <div className="space-y-6">
              <img src="https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800" className="rounded-[3rem] shadow-2xl aspect-[3/4] object-cover hover:-rotate-2 transition-transform duration-700" />
              <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800" className="rounded-[3rem] shadow-2xl aspect-square object-cover hover:rotate-2 transition-transform duration-700" />
            </div>
          </div>
          
          <div className="space-y-12 reveal delay-300">
            <span className="text-stone-400 font-black uppercase tracking-[0.5em] text-xs">A Mente por trás da Pena</span>
            <h2 className="text-7xl font-bold serif italic leading-[1.1]">Arquiteto de Mundos Invisíveis</h2>
            <div className="space-y-8 text-2xl text-stone-600 book-font leading-relaxed">
              <p>{WRITER_BIO}</p>
              <p className="italic text-stone-400">"Sempre busquei a palavra que não apenas descreve, mas que sente. Meus livros são convites para perdermos o fôlego e encontrarmos a alma."</p>
            </div>
            <div className="flex gap-4 pt-6">
              {[
                { icon: <Instagram />, label: "Instagram", href: "#" },
                { icon: <Twitter />, label: "Twitter", href: "#" },
                { icon: <Facebook />, label: "Facebook", href: "#" },
                { icon: <Mail />, label: "E-mail", href: "mailto:elias@exemplo.com" }
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="p-5 bg-white rounded-2xl border border-stone-200 hover:bg-stone-900 hover:text-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-40 px-6 bg-white relative overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-stone-100 rounded-full blur-[100px] -z-10 opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center reveal">
          <div className="mb-20 space-y-6">
            <h2 className="text-7xl font-bold serif italic">Mande um Sussurro</h2>
            <p className="text-xl text-stone-400 max-w-xl mx-auto book-font">Dúvidas, críticas ou apenas um olá literário. Eu leio cada palavra.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 gap-8 text-left glass p-12 rounded-[4rem] shadow-2xl border border-stone-100">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 ml-4">Como te chamam?</label>
              <input required type="text" placeholder="Seu nome" className="w-full px-8 py-6 rounded-3xl bg-stone-50 border border-stone-100 focus:ring-2 focus:ring-stone-900 focus:bg-white focus:outline-none transition-all text-lg" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 ml-4">Onde te encontro?</label>
              <input required type="email" placeholder="seu@email.com" className="w-full px-8 py-6 rounded-3xl bg-stone-50 border border-stone-100 focus:ring-2 focus:ring-stone-900 focus:bg-white focus:outline-none transition-all text-lg" />
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 ml-4">O que tens a dizer?</label>
              <textarea required rows={6} placeholder="Sua mensagem..." className="w-full px-8 py-6 rounded-3xl bg-stone-50 border border-stone-100 focus:ring-2 focus:ring-stone-900 focus:bg-white focus:outline-none transition-all text-lg resize-none"></textarea>
            </div>
            <div className="md:col-span-2 pt-4">
              <button 
                disabled={contactStatus !== 'idle'}
                className={`w-full py-8 rounded-3xl font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${contactStatus === 'sent' ? 'bg-green-600 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
              >
                {contactStatus === 'sent' ? (
                  <>Recebido com Sucesso! <Send size={20} /></>
                ) : contactStatus === 'sending' ? (
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                  </div>
                ) : (
                  <>Enviar para Elias <Send size={24} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 bg-stone-950 text-stone-600 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-16">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-6xl font-black text-white serif italic tracking-tighter">Elysian Quill</div>
            <div className="flex gap-8">
               <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110" aria-label="Instagram">
                 <Instagram size={24} />
               </a>
               <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110" aria-label="Twitter">
                 <Twitter size={24} />
               </a>
               <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all transform hover:scale-110" aria-label="Facebook">
                 <Facebook size={24} />
               </a>
            </div>
          </div>
          
          <div className="w-full h-px bg-stone-900"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center w-full max-w-3xl">
            {['Início', 'Livros', 'Sobre', 'Contatos'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace('í', 'i').replace('os', 'o')}`} 
                className="text-[10px] font-black uppercase tracking-[0.5em] hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const id = item.toLowerCase().replace('í', 'i').replace('contatos', 'contato').replace('livros', 'livros');
                  const element = document.getElementById(id);
                  if (element) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <p className="text-[10px] opacity-40 uppercase tracking-[0.4em]">&copy; 2024 Elias Cavalcanti. Todos os direitos reservados.</p>
        </div>
      </footer>

      <ChatAssistant />
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
      {selectedBook && (
        <FlipBook book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default App;
