
import React, { useState, useEffect } from 'react';
import { Menu, X, Feather } from 'lucide-react';

interface NavbarProps {
  onOpenNewsletter: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenNewsletter }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      const offset = 80; // Altura da navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Livros', href: '#livros' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contatos', href: '#contato' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${isScrolled ? 'py-3 glass shadow-xl' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <div className="bg-stone-900 text-white p-2.5 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-lg">
            <Feather size={22} />
          </div>
          <span className={`text-2xl font-black tracking-tighter serif italic transition-colors ${isScrolled ? 'text-stone-900' : 'text-stone-900'}`}>
            Elysian Quill
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-stone-500 hover:text-stone-900 font-bold transition-all text-xs uppercase tracking-[0.3em] relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-stone-900 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={onOpenNewsletter}
            className="bg-stone-900 text-white px-10 py-3 rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-2xl active:scale-95 border border-stone-800"
          >
            Newsletter
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-stone-900 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-stone-50 z-50 transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full p-10">
          <div className="flex justify-between items-center mb-16">
            <span className="text-2xl font-black serif italic">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-900 p-2 border border-stone-200 rounded-full">
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-10">
            {navLinks.map((link, idx) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-stone-900 text-5xl font-black serif italic hover:pl-4 transition-all duration-300"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                {link.name}
              </a>
            ))}
          </div>
          <button 
            onClick={() => { onOpenNewsletter(); setIsMobileMenuOpen(false); }}
            className="mt-auto bg-stone-900 text-white py-6 rounded-2xl font-bold text-xl shadow-2xl"
          >
            Assinar Newsletter
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
