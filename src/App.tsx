/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Play, 
  Clock, 
  ShieldCheck, 
  Star, 
  ChevronDown,
  User,
  Activity,
  Zap,
  MapPin,
  Monitor,
  Heart,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
// BodyScanner types handled internally or via generic identifiers if needed

// --- Components ---

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/20 px-6 py-3 rounded-full mb-8">
      <Clock className="w-4 h-4 text-brand-accent animate-pulse" />
      <span className="text-[10px] font-bold text-white uppercase tracking-widest">
        Oferta expira em: <span className="text-brand-accent italic font-black">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
      </span>
    </div>
  );
};

const LiveNotification = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const names = ["Juliana", "Patricia", "Camila", "Luciana", "Renata", "Beatriz", "Aline"];
    const showRandom = () => {
      setName(names[Math.floor(Math.random() * names.length)]);
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    };

    const timeout = setTimeout(showRandom, 10000);
    const interval = setInterval(showRandom, 25000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-6 left-6 z-[60] glass p-4 rounded-2xl border-brand-accent/30 flex items-center gap-4 shadow-2xl max-w-[280px]"
        >
          <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-black font-bold text-xs shrink-0">
            {name[0]}
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Compra Recente</p>
            <p className="text-xs text-white leading-tight"><strong>{name}</strong> acabou de adquirir o Método Cadeira 5m.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-black font-bold">C</div>
          <span className="font-light tracking-widest text-white serif uppercase text-sm">Método Cadeira<span className="font-semibold italic"> 5m</span></span>
        </div>
      <a href="#pricing" className="bg-brand-accent text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-accent-hover transition-colors">
        Acesso Imediato
      </a>
    </div>
  </nav>
);

const BodyScanner = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(1); // 1: Map, 2: Intensity, 3: Duration
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const areas = [
    { id: 'cervical', label: 'Cervical / Pescoço' },
    { id: 'lumbar', label: 'Lombar / Costas' },
    { id: 'shoulders', label: 'Ombros / Braços' },
    { id: 'legs', label: 'Pernas / Inchaço' },
  ];

  const handleAreaToggle = (id: string) => {
    setSelectedAreas(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsFinished(true);
      setTimeout(() => {
        onFinish();
        setTimeout(() => {
          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="w-full">
      <div className="glass rounded-3xl p-6 md:p-10 relative min-h-[420px] flex flex-col justify-center border-brand-accent/20 overflow-hidden">
        
        {/* Scanning Radar Effect background */}
        {isAnalyzing && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute inset-x-0 h-1 bg-brand-accent shadow-[0_0_20px_rgba(212,175,55,1)] animate-[scan_2s_infinite_ease-in-out]" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isAnalyzing && !isFinished ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-8 relative">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleBack(); }}
                      className="absolute -top-1 -left-2 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-brand-accent transition-all active:scale-95 z-20"
                      title="Voltar"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <span className={`text-[10px] font-bold text-brand-text-dim uppercase tracking-[0.1em] md:tracking-[0.3em] ${step > 1 ? 'ml-8' : ''}`}>Scanner Postural {step}/3</span>
                </div>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${(step / 3) * 100}%` }}
                    className="h-full bg-brand-accent"
                  />
                </div>
              </div>

              {step === 1 && (
                <div>
                  <h3 className="text-xl md:text-2xl serif italic text-white mb-6">Mapeie seu desconforto:</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {areas.map(area => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAreaToggle(area.id); }}
                        className={`flex flex-col items-center justify-center gap-2 p-6 md:p-8 rounded-3xl border transition-all relative overflow-hidden group ${
                          selectedAreas.includes(area.id) 
                          ? 'border-brand-accent bg-brand-accent/20 text-brand-accent shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                          : 'border-white/5 bg-brand-surface/30 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {selectedAreas.includes(area.id) && (
                          <motion.div 
                            layoutId="glow"
                            className="absolute inset-0 bg-brand-accent/5 blur-xl pointer-events-none"
                          />
                        )}
                        <span className={`text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors text-center ${selectedAreas.includes(area.id) ? 'text-brand-accent' : 'text-white/60'}`}>
                          {area.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button 
                    type="button"
                    disabled={selectedAreas.length === 0}
                    onClick={(e) => { e.stopPropagation(); setStep(2); }}
                    className="w-full py-4 glass border-brand-accent/20 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-white hover:bg-brand-accent hover:text-black transition-all disabled:opacity-30"
                  >
                    Próxima Etapa
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl serif italic text-white mb-6">Intensidade do incômodo:</h3>
                  <div className="px-4 mb-10">
                    <input 
                      type="range" min="1" max="10" step="1" 
                      value={intensity} 
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full accent-brand-accent"
                    />
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-brand-text-dim uppercase tracking-widest">
                      <span>Leve</span>
                      <span className="text-brand-accent text-lg">{intensity}</span>
                      <span>Severo</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setStep(3); }}
                    className="w-full py-4 glass border-brand-accent/20 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.3em] text-white hover:bg-brand-accent hover:text-black transition-all"
                  >
                    Confirmar Intensidade
                  </button>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl md:text-2xl serif italic text-white mb-6">Há quanto tempo sente isso?</h3>
                  <div className="grid grid-cols-1 gap-3 mb-8">
                    {["Algumas semanas", "Poucos meses", "Mais de 1 ano", "Sempre senti isso"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
                        className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-brand-surface/50 hover:border-brand-accent hover:bg-brand-accent/5 transition-all text-left"
                      >
                        <span className="text-sm font-light text-white group-hover:text-brand-accent">{opt}</span>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-brand-accent" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 border-2 border-white/5 border-t-brand-accent rounded-full animate-spin" />
                  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-accent animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl serif italic text-white mb-2">Processando Mapas de Tensão...</h3>
              <p className="text-brand-text-dim text-xs tracking-wide">Gerando seu protocolo biomecânico exclusivo.</p>
            </motion.div>
          ) : (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 bg-brand-accent text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl serif italic text-brand-accent mb-4">Análise Concluída</h3>
              <p className="text-base text-white mb-6 leading-relaxed px-4">Detectamos pontos de compressão severa. O seu perfil exige o <strong>Método Cadeira 5m</strong> imediatamente.</p>
              <p className="text-brand-accent text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Desbloqueando acesso prioritário...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const navigateWithParams = (url: string) => {
    // Basic implementation that appends current search params to target URL
    const searchParams = window.location.search;
    window.location.href = url + (url.includes('?') ? (searchParams ? '&' + searchParams.substring(1) : '') : searchParams);
  };

  const [showContent, setShowContent] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-accent selection:text-black">
      <Navbar />
      <LiveNotification />

      {/* Hero Section */}
      <header className={`relative pt-32 transition-all duration-1000 ${showContent ? 'pb-20 md:pt-48 md:pb-32' : 'min-h-screen flex items-center'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 blur-[120px] opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-brand-text-dim text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.3em] mb-8"
          >
            <Zap className="w-4 h-4 text-brand-accent" />
            <span>Alívio clínico em 5 minutos</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-7xl serif font-light text-white tracking-tight mb-8 leading-[1.1]"
          >
            Elimine dores e melhore sua postura <br />
            <span className="serif italic text-brand-accent">sem sair da cadeira.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-text-dim max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Método prático de 5 minutos desenvolvido para mulheres que trabalham sentadas e buscam alívio imediato e prevenção diária. <br />
            <span className="text-brand-accent font-bold text-xs md:text-sm tracking-widest uppercase mt-4 block">Inclui Material Imprimível e Pronto para usar.</span>
          </motion.p>
          
          <div className="max-w-xl mx-auto">
            <BodyScanner onFinish={() => setShowContent(true)} />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Product Showcase */}
            <section className="py-32 bg-brand-bg" id="benefits">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl serif italic text-white mb-6 tracking-tight">O que você vai receber hoje:</h2>
              <div className="space-y-2 mb-10">
                <p className="text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Material totalmente imprimível e pronto para usar
                </p>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-brand-accent/50" /> Envio automático por E-mail + Acesso Vitalício
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Método Cadeira 5m", desc: "50 exercícios, rotina matinal, rotina vespertina, checklist 21 dias", icon: Clock },
                  { title: "Circulação Leve nas Pernas", desc: "15 exercícios circulatórios, rotina anti-inchaço, alimentação, posições de sono", icon: Zap },
                  { title: "Cervical Livre", desc: "12 exercícios cervicais, guia ergonômico, posições de sono, alerta de pausa", icon: ShieldCheck },
                  { title: "Lombar em Paz", desc: "18 exercícios lombares, guia de postura, ergonomia home office, diário da dor", icon: Activity },
                  { title: "Rotina Matinal Sentada", desc: "10 momentos matinais, variante curta 3 minutos, planner semanal, respiração para ansiedade", icon: User },
                  { title: "Anti-Inchaço Total", desc: "14 exercícios drenantes, guia alimentar, drenagem linfática caseira, chás", icon: Heart }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col gap-4 p-6 rounded-2xl border border-white/5 bg-brand-surface/30 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="w-10 h-10 glass rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="text-brand-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2 text-sm">{item.title}</h4>
                      <p className="text-brand-text-dim text-xs leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative order-first lg:order-last">
              <div className="absolute inset-0 bg-brand-accent rounded-[3rem] rotate-2 -z-10 opacity-5" />
              <div className="glass rounded-[3rem] p-8 shadow-3xl flex flex-col justify-center min-h-[400px]">
                <h3 className="text-2xl serif italic text-brand-accent mb-4">A Solução Completa</h3>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-6">Guias Digitais & Versão para Impressão</p>
                <p className="text-white font-light leading-relaxed mb-8">
                  Você não está comprando apenas um guia, mas um sistema completo de manutenção corporal que se adapta à sua rotina de trabalho.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-brand-text-dim">
                    <Check className="w-4 h-4 text-brand-accent" /> Metodologia baseada em fisioterapia clínica
                  </li>
                  <li className="flex items-center gap-3 text-sm text-brand-text-dim">
                    <Check className="w-4 h-4 text-brand-accent" /> Exercícios que não exigem levantar da cadeira
                  </li>
                  <li className="flex items-center gap-3 text-sm text-brand-text-dim">
                    <Check className="w-4 h-4 text-brand-accent" /> Resultados perceptíveis desde o primeiro dia
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-32 bg-brand-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/5 blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl serif italic text-white mb-6 tracking-tight">Sinta a leveza, esqueça a dor.</h2>
            <p className="text-brand-text-dim uppercase tracking-[0.2em] text-xs">Criado para mulheres que não param, mas que o corpo pediu uma pausa.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Passa mais de 6 horas por dia sentada no trabalho.", icon: Monitor },
              { text: "Acorda bem, mas termina o dia com a cervical 'travada'.", icon: Activity },
              { text: "Sente as pernas pesadas e inchadas no final da tarde.", icon: Heart }
            ].map((item, idx) => (
              <div key={idx} className="glass p-12 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mb-8 mx-auto border-brand-accent/20 group-hover:border-brand-accent group-hover:scale-110 transition-all">
                  <item.icon className="w-6 h-6 text-brand-accent" />
                </div>
                <p className="text-xl font-light leading-relaxed text-white">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl serif italic text-white mb-4 tracking-tight">Resultados que inspiram</h2>
            <p className="text-brand-text-dim uppercase tracking-[0.2em] text-xs">A opinião de quem já retomou o conforto.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Maria Clara, 42", role: "Assistente Adm", text: "Trabalho 8 horas sentada e minha lombar doía todos os dias. Com 5 minutos por dia, a dor simplesmente sumiu.", avatar: "MC" },
              { name: "Fernanda S., 38", role: "Analista de RH", text: "Não sou de fazer academia, mas esses exercícios são discretos e rápidos. Minhas pernas pararam de inchar.", avatar: "FS" },
              { name: "Roberta O., 47", role: "Contadora", text: "Os vídeos são diretos ao ponto. Em uma semana já sinto meu pescoço muito mais leve.", avatar: "RO" }
            ].map((review, idx) => (
              <div key={idx} className="glass p-10 rounded-3xl flex flex-col justify-between hover:bg-white/[0.05] transition-all">
                <div>
                  <div className="flex gap-1 mb-8 text-brand-accent opacity-80">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-lg text-white font-light italic leading-relaxed mb-10">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-black font-bold text-xs">{review.avatar}</div>
                  <div>
                    <h5 className="font-bold text-white text-sm tracking-wide">{review.name}</h5>
                    <p className="text-[10px] text-brand-text-dim uppercase font-bold tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-brand-bg relative overflow-hidden" id="pricing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-brand-accent rounded-full blur-[200px] opacity-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl serif italic text-white mb-4 tracking-tight">O melhor investimento do seu dia</h2>
            <p className="text-brand-text-dim uppercase tracking-[0.2em] text-xs">Acesso imediato à solução completa e definitiva.</p>
          </div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-16 text-center max-w-3xl mx-auto border-brand-accent/30 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 -z-10 group-hover:rotate-12 transition-transform">
              <Zap className="w-32 h-32 text-brand-accent" />
            </div>
            
            <div className="flex flex-col items-center mb-10">
              <CountdownTimer />
              <div className="inline-block px-5 py-2 rounded-full bg-brand-accent text-black text-[10px] font-bold uppercase tracking-[0.3em]">OFERTA LIMITADA</div>
            </div>

            <h3 className="text-4xl serif italic text-white mb-4">Plano Completo Premium</h3>
            <p className="text-brand-text-dim text-sm tracking-wide mb-8 font-light">Tudo o que você precisa para uma rotina sem dor, vitaliciamente.</p>
            
            <div className="mb-10 relative px-4">
              <div className="absolute inset-0 bg-brand-accent/10 blur-3xl rounded-full scale-75 opacity-50" />
              <img 
                src="https://i.ibb.co/1fjcC7QY/Chat-GPT-Image-7-de-mai-de-2026-10-30-05.png" 
                alt="Product Mockup" 
                className="w-full max-w-[480px] mx-auto rounded-2xl shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mb-12 flex flex-col items-center">
              <div className="flex justify-between w-full max-w-[300px] mb-2 text-[10px] uppercase tracking-widest font-bold">
                <span className="text-brand-accent italic">Apenas 7 vagas restantes</span>
                <span className="text-white/40 italic">94% Preenchido</span>
              </div>
              <div className="w-full max-w-[300px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-brand-accent w-[94%]" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-12 bg-brand-accent/5 py-8 rounded-3xl border border-brand-accent/10">
              <span className="text-2xl text-white/30 line-through font-light">R$ 97</span>
              <div className="flex items-baseline">
                <span className="text-3xl font-light text-white mr-1">R$</span>
                <span className="text-8xl font-black text-brand-accent tracking-tighter">17</span>
                <span className="text-brand-text-dim font-bold ml-2 uppercase text-xs tracking-widest">único</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-left mb-12">
              {[
                "Método Cadeira 5m",
                "Guia Circulação Leve",
                "Guia Cervical Livre",
                "Guia Lombar em Paz",
                "Rotina Matinal Sentada",
                "Guia Anti-Inchaço Total",
                "Checklist de Evolução 21 Dias",
                "Suporte Prioritário Vitalício",
                "Envio Automático para seu E-mail",
                "Acesso Vitalício ilimitado",
                "Material 100% Imprimível e Pronto"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center shrink-0 border border-brand-accent/20">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-white text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigateWithParams('https://pay.hotmart.com/O105729685X');
              }}
              className="w-full bg-brand-accent text-black py-7 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.3em] hover:bg-brand-accent-hover transition-all shadow-2xl shadow-brand-accent/20 mb-3 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 italic">
                Acessar Método Cadeira 5m Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 mb-8 animate-pulse">
              <User className="w-3 h-3 text-brand-accent" />
              <p className="text-[9px] font-bold text-brand-text-dim uppercase tracking-widest">
                <span className="text-white">12 pessoas</span> estão vendo esta oferta agora
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-[9px] font-bold text-brand-text-dim underline underline-offset-8 decoration-brand-accent/20 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Pagamento Criptografado</span>
              <span className="flex items-center gap-2 text-white"><Clock className="w-4 h-4 text-brand-accent" /> Envio Automático por E-mail</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-brand-accent" /> Acesso Vitalício</span>
            </div>
          </motion.div>
          
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-10 py-6 px-12 rounded-full glass border-white/5">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-surface bg-brand-bg flex items-center justify-center text-[10px] text-white font-bold glass" />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-brand-surface bg-brand-accent flex items-center justify-center text-[10px] text-black font-bold">+1k</div>
              </div>
              <p className="text-xs font-bold text-brand-text-dim uppercase tracking-widest">Exclusividade para <span className="text-white">+1.400 mulheres</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-32 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto glass rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden border-brand-accent/20">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/2" />
            
            <div className="w-24 h-24 glass border-brand-accent/40 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl rotate-6 group-hover:rotate-0 transition-transform">
              <ShieldCheck className="w-12 h-12 text-brand-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl serif italic text-white mb-8 tracking-tight">Segurança Total Premium</h2>
            <p className="text-brand-text-dim text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-light">
              Desfrute do conteúdo por 7 dias. Se não sentir seu corpo renovado, devolvemos seu investimento integralmente. <span className="text-brand-accent italic">Sem perguntas.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="px-8 py-4 rounded-full glass border-brand-accent/10 text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                <Check className="w-4 h-4 text-brand-accent" /> Risco Zero
              </div>
              <div className="px-8 py-4 rounded-full glass border-brand-accent/10 text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                <Check className="w-4 h-4 text-brand-accent" /> Reembolso Instantâneo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-32 bg-brand-bg border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-full glass border-brand-accent/20 p-2 overflow-hidden">
                <div className="w-full h-full rounded-full bg-brand-surface flex items-center justify-center text-4xl serif italic text-brand-accent border border-brand-accent/10 shadow-inner overflow-hidden">
                  <img 
                    src="https://i.ibb.co/MxFTJ4JV/Retrato-de-mulher-com-sorriso-radiante.png" 
                    alt="Ana Valentina Lima" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 glass px-6 py-2 rounded-full border-brand-accent/40">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Ana Valentina</p>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-3xl serif italic text-white mb-6 tracking-tight">Criado por quem entende <br />de corpo sedentário</h2>
              <p className="text-brand-text-dim text-lg leading-relaxed mb-6 font-light">
                Ana Valentina Lima é fisioterapeuta com mais de <span className="text-white font-medium italic">12 anos de experiência</span> em reabilitação postural e ergonomia.
              </p>
              <p className="text-brand-text-dim text-base leading-relaxed font-light opacity-80">
                Após atender centenas de mulheres com dores causadas pelo trabalho sentado, Ana percebeu que la solução não estava em tratamentos caros, mas em <span className="text-brand-accent italic">pequenos ajustes diários</span>. Assim nasceu o Método Cadeira 5m.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-brand-surface">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl serif italic text-center text-white mb-20 tracking-tight">Dúvidas comuns</h2>
          <div className="space-y-4">
            {[
              { q: "Como recebo o acesso?", a: "Imediatamente! Assim que o pagamento de R$ 17 for confirmado, você recebe um e-mail automático com suas credenciais de acesso vitalício." },
              { q: "Preciso de equipamentos?", a: "Absolutamente não. Utilizamos a gravidade e o seu próprio peso corporal em conjunto com qualquer cadeira firme que você já possua." },
              { q: "Para quem é indicado?", a: "Ideal para mulheres que buscam elegância postural e alívio de tensões crônicas resultantes de longas horas na mesma posição." },
              { q: "Os resultados são duradouros?", a: "Sim, ao atuar na reeducação muscular e descompressão articular, os exercícios criam uma base sólida para um corpo saudável a longo prazo." }
            ].map((item, idx) => (
              <details key={idx} className="group glass rounded-2xl overflow-hidden cursor-pointer">
                <summary className="flex items-center justify-between p-8 list-none font-bold text-white uppercase text-[10px] tracking-[0.2em] transition-all group-hover:bg-white/5">
                  {item.q}
                  <ChevronDown className="w-4 h-4 text-brand-accent group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-8 pt-0 text-brand-text-dim leading-relaxed font-light text-sm italic">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 bg-brand-bg text-brand-text-dim border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-black font-extrabold">C</div>
                <span className="text-white font-light tracking-[0.2em] serif uppercase text-lg">Método Cadeira<span className="font-semibold italic"> 5m</span></span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">Elegância, Mobilidade e Conforto</p>
            </div>
            <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-brand-accent transition-colors">Legal</a>
              <a href="#" className="hover:text-brand-accent transition-colors">Privacidade</a>
              <a href="#" className="hover:text-brand-accent transition-colors">Suporte</a>
            </div>
            <div className="text-[9px] text-white/20 font-bold uppercase tracking-[0.4em] text-center md:text-right">
              © 2026 Método Postural Avançado. <br className="md:hidden" /> Desenvolvido com maestria.
            </div>
          </div>
        </div>
      </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
