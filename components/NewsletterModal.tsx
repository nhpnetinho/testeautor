
import React, { useState } from 'react';
import { X, CheckCircle2, Mail } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"><X /></button>
        
        <div className="p-8 md:p-12">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center"><CheckCircle2 size={64} className="text-green-500 animate-bounce" /></div>
              <h3 className="text-2xl font-bold serif">Bem-vindo à Jornada!</h3>
              <p className="text-stone-500">Você receberá meus novos contos e reflexões em breve.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2 block">Exclusivo</span>
                <h2 className="text-3xl font-bold serif mb-4 italic">Entre para o Círculo de Leitores</h2>
                <p className="text-stone-600">Assine para receber capítulos inéditos, bastidores do processo criativo e convites para lançamentos.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail..."
                    className="w-full pl-12 pr-4 py-4 bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95"
                >
                  Confirmar Inscrição
                </button>
              </form>
              <p className="text-[10px] text-stone-400 text-center mt-6 uppercase tracking-widest">Respeitamos sua privacidade. Saia quando quiser.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
