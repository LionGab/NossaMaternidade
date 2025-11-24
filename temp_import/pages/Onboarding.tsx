
import React, { useState } from 'react';
import { ArrowRight, Check, Sun, Moon, ArrowLeft, Heart, Baby, Users, Brain, Bell, Shield } from 'lucide-react';
import { UserEmotion, UserStage, UserProfile, UserChallenge, UserSupport, UserNeed } from '../types';
import { Input } from '../components/UI';

interface OnboardingProps {
  onFinish: (data: UserProfile) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onFinish, toggleTheme, isDarkMode }) => {
  // Flow Management
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 9;

  // Form Data State
  const [formData, setFormData] = useState<UserProfile>({});
  
  // Temporary state for timeline slider
  const [sliderValue, setSliderValue] = useState(20); // Default middle value

  const updateData = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Logic to skip timeline screen if not pregnant or new mom
  const nextStep = () => {
    let next = step + 1;

    // Skip Timeline (Step 4) if not applicable
    if (step === 3) {
      const needsTimeline = formData.stage === UserStage.PREGNANT || formData.stage === UserStage.NEW_MOM;
      if (!needsTimeline) next = 5;
    }

    setStep(next);
  };

  const prevStep = () => {
    let prev = step - 1;
    if (step === 5) {
      const needsTimeline = formData.stage === UserStage.PREGNANT || formData.stage === UserStage.NEW_MOM;
      if (!needsTimeline) prev = 3;
    }
    setStep(prev);
  };

  const handleFinish = () => {
    onFinish(formData);
  };

  // --- SUB-COMPONENTS FOR SCREENS ---

  const Header = () => (
    <div className="flex justify-between items-center mb-6">
      {step > 1 ? (
        <button onClick={prevStep} className="p-2 -ml-2 text-gray-400 hover:text-nath-dark transition-colors">
          <ArrowLeft size={24} />
        </button>
      ) : <div className="w-6" />}
      
      {step < TOTAL_STEPS && (
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${step > i + 1 ? 'w-4 bg-nath-blue' : step === i + 1 ? 'w-4 bg-nath-blue/50' : 'w-1.5 bg-gray-200 dark:bg-nath-dark-border'}`}
            />
          ))}
        </div>
      )}

      <button 
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full bg-gray-50 dark:bg-nath-dark-card text-nath-dark dark:text-white flex items-center justify-center shadow-sm border border-gray-100 dark:border-nath-dark-border transition-colors"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );

  const StepTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-8 animate-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-bold text-nath-dark dark:text-nath-dark-text mb-2 leading-tight">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-nath-dark-muted leading-relaxed">
        {subtitle}
      </p>
    </div>
  );

  // 1. WELCOME (After Splash)
  if (step === 1) {
    return (
      <div className="min-h-screen bg-nath-warm dark:bg-nath-dark-bg p-6 flex flex-col relative transition-colors">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in duration-700">
          <div className="w-32 h-32 rounded-full bg-white dark:bg-nath-dark-card p-1 shadow-xl mb-6 relative">
             <img src="https://i.imgur.com/GDYdiuy.jpg" className="w-full h-full rounded-full object-cover" alt="Nath" />
             <div className="absolute bottom-0 right-0 bg-green-400 w-6 h-6 rounded-full border-4 border-white dark:border-nath-dark-bg"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-nath-dark dark:text-nath-dark-text mb-3">
            Oi, que bom que você chegou.
          </h1>
          
          <p className="text-lg font-medium text-nath-blue dark:text-blue-300 italic mb-6 max-w-[300px]">
            "Aqui, você não precisa fingir que está tudo bem."
          </p>

          <p className="text-base text-gray-600 dark:text-nath-dark-muted mb-8 max-w-[280px]">
            Eu sou a MãesValente. Quero criar um espaço seguro para você. <br/>
            Vamos conversar rapidinho?
          </p>

          <button 
            onClick={nextStep}
            className="w-full bg-nath-blue hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Começar agora <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // 2. NAME
  if (step === 2) {
    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title="Como você gosta de ser chamada?" 
          subtitle="Quero que nossa conversa seja íntima, como amigas." 
        />
        
        <div className="flex-1">
          <Input 
            autoFocus
            placeholder="Seu nome ou apelido"
            value={formData.name || ''}
            onChange={(e) => updateData('name', e.target.value)}
            className="text-lg py-6"
          />
        </div>

        <button 
          onClick={nextStep}
          disabled={!formData.name}
          className="w-full bg-nath-dark dark:bg-nath-dark-hero text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-all"
        >
          Continuar
        </button>
      </div>
    );
  }

  // 3. STAGE
  if (step === 3) {
    const stages = Object.values(UserStage);
    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title={`Prazer, ${formData.name}! Em que fase você está?`} 
          subtitle="Vou adaptar meus conselhos para o seu momento." 
        />
        
        <div className="flex-1 space-y-3">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => { updateData('stage', stage); nextStep(); }}
              className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${
                formData.stage === stage 
                  ? 'border-nath-blue bg-nath-light-blue dark:bg-blue-900/20 text-nath-blue' 
                  : 'border-gray-100 dark:border-nath-dark-border text-nath-dark dark:text-nath-dark-text hover:border-nath-blue/50 dark:hover:bg-nath-dark-card'
              }`}
            >
              <span className="font-semibold">{stage}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.stage === stage ? 'border-nath-blue bg-nath-blue' : 'border-gray-300'}`}>
                 {formData.stage === stage && <Check size={12} className="text-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 4. TIMELINE (Conditional)
  if (step === 4) {
    const isPregnant = formData.stage === UserStage.PREGNANT;
    const maxVal = isPregnant ? 42 : 24; // 42 weeks or 24 months
    const label = isPregnant ? 'Semanas de gestação' : 'Meses do bebê';
    
    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title="Conta um pouquinho mais..." 
          subtitle={isPregnant ? "Assim te aviso sobre sintomas comuns dessa semana." : "Para acompanhar os saltos de desenvolvimento."} 
        />
        
        <div className="flex-1 flex flex-col justify-center items-center">
           <div className="text-6xl font-bold text-nath-blue mb-2">
             {sliderValue}
           </div>
           <div className="text-gray-500 font-medium mb-12 uppercase tracking-widest text-sm">
             {isPregnant ? 'Semanas' : 'Meses'}
           </div>

           <input 
             type="range" 
             min="1" 
             max={maxVal} 
             value={sliderValue} 
             onChange={(e) => setSliderValue(parseInt(e.target.value))}
             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nath-blue"
           />
        </div>

        <button 
          onClick={() => { 
            updateData('timelineInfo', `${sliderValue} ${isPregnant ? 'semanas' : 'meses'}`); 
            nextStep(); 
          }}
          className="w-full bg-nath-dark dark:bg-nath-dark-hero text-white font-bold py-4 rounded-xl transition-all"
        >
          Confirmar
        </button>
      </div>
    );
  }

  // 5. FEELING
  if (step === 5) {
    const feelings = Object.values(UserEmotion);
    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title="Como você está se sentindo hoje?" 
          subtitle="Seja sincera. Aqui é um lugar livre de julgamentos." 
        />
        
        <div className="flex-1 flex flex-wrap gap-3 content-start">
          {feelings.map((feeling) => (
            <button
              key={feeling}
              onClick={() => { updateData('currentFeeling', feeling); nextStep(); }}
              className={`px-6 py-3 rounded-full border text-sm transition-all ${
                formData.currentFeeling === feeling 
                  ? 'bg-nath-pink text-white border-nath-pink shadow-md scale-105' 
                  : 'border-gray-200 dark:border-nath-dark-border text-gray-600 dark:text-nath-dark-text hover:border-nath-pink/50'
              }`}
            >
              {feeling}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 6. BIGGEST CHALLENGE
  if (step === 6) {
    const challenges = Object.values(UserChallenge);
    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title="O que mais pesa no seu coração agora?" 
          subtitle="Vou priorizar conteúdos para te ajudar nisso." 
        />
        
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pb-4">
          {challenges.map((challenge) => (
            <button
              key={challenge}
              onClick={() => { updateData('biggestChallenge', challenge); nextStep(); }}
              className={`w-full p-4 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-95 ${
                formData.biggestChallenge === challenge
                  ? 'bg-nath-dark text-white border-nath-dark shadow-lg'
                  : 'bg-gray-50 dark:bg-nath-dark-card border-transparent text-nath-dark dark:text-nath-dark-text hover:bg-gray-100'
              }`}
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 7. SUPPORT NETWORK
  if (step === 7) {
    const options = [
      { val: UserSupport.HIGH, icon: <Users size={24} />, text: "Tenho, graças a Deus" },
      { val: UserSupport.MEDIUM, icon: <UserSupportIconPartial />, text: "Às vezes/Pouca" },
      { val: UserSupport.LOW, icon: <UserSupportIconNone />, text: "Me sinto muito sozinha" },
    ];

    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title="Você tem rede de apoio?" 
          subtitle="Para eu saber o quanto posso te exigir ou te acolher." 
        />
        
        <div className="flex-1 grid gap-4 content-start">
          {options.map((opt) => (
            <button
              key={opt.val}
              onClick={() => { updateData('supportLevel', opt.val); nextStep(); }}
              className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                 formData.supportLevel === opt.val
                 ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                 : 'border-gray-100 dark:border-nath-dark-border bg-white dark:bg-nath-dark-card text-gray-600 dark:text-gray-300 hover:border-purple-200'
              }`}
            >
              <div className={`p-3 rounded-full ${formData.supportLevel === opt.val ? 'bg-white dark:bg-nath-dark-bg' : 'bg-gray-100 dark:bg-nath-dark-bg'}`}>
                {opt.icon}
              </div>
              <span className="font-bold text-lg">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 8. PRIMARY NEED
  if (step === 8) {
    const needs = [
      { val: UserNeed.CHAT, icon: <Brain size={20}/>, title: "Desabafar", sub: "Conversar com alguém que entenda" },
      { val: UserNeed.LEARN, icon: <Baby size={20}/>, title: "Aprender", sub: "Dicas práticas sobre o bebê" },
      { val: UserNeed.CALM, icon: <Heart size={20}/>, title: "Acalmar", sub: "Respirar e diminuir ansiedade" },
      { val: UserNeed.CONNECT, icon: <Users size={20}/>, title: "Conectar", sub: "Ver relatos de outras mães" },
    ];

    return (
      <div className="min-h-screen bg-white dark:bg-nath-dark-bg p-6 flex flex-col transition-colors">
        <Header />
        <StepTitle 
          title="O que você mais precisa AGORA?" 
          subtitle="Vou configurar sua tela inicial baseada nisso." 
        />
        
        <div className="flex-1 grid grid-cols-1 gap-3">
           {needs.map((n) => (
             <button
               key={n.val}
               onClick={() => { updateData('primaryNeed', n.val); nextStep(); }}
               className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                 formData.primaryNeed === n.val
                 ? 'bg-nath-blue text-white border-nath-blue shadow-lg transform scale-105'
                 : 'bg-white dark:bg-nath-dark-card border-gray-100 dark:border-nath-dark-border hover:bg-gray-50'
               }`}
             >
               <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${formData.primaryNeed === n.val ? 'bg-white/20' : 'bg-nath-light-blue dark:bg-nath-dark-bg text-nath-blue'}`}>
                 {n.icon}
               </div>
               <div className="text-left">
                 <h3 className={`font-bold ${formData.primaryNeed === n.val ? 'text-white' : 'text-nath-dark dark:text-nath-dark-text'}`}>{n.title}</h3>
                 <p className={`text-xs ${formData.primaryNeed === n.val ? 'text-blue-100' : 'text-gray-400'}`}>{n.sub}</p>
               </div>
             </button>
           ))}
        </div>
      </div>
    );
  }

  // 9. NOTIFICATIONS & SUCCESS
  if (step === 9) {
    return (
      <div className="min-h-screen bg-nath-warm dark:bg-nath-dark-bg p-6 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in duration-500 relative transition-colors">
        <button 
          onClick={toggleTheme}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-nath-dark-card text-nath-dark dark:text-white flex items-center justify-center shadow-sm border border-gray-100 dark:border-nath-dark-border transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-green-500 dark:text-green-400 shadow-lg">
          <Check size={48} strokeWidth={3} />
        </div>
        
        <h2 className="text-2xl font-bold text-nath-dark dark:text-nath-dark-text mb-4">
          Tudo pronto, {formData.name?.split(' ')[0]}!
        </h2>
        
        <p className="text-nath-dark/80 dark:text-nath-dark-muted mb-8 leading-relaxed max-w-[280px]">
          Configurei o app para te ajudar com <strong>{formData.biggestChallenge?.toLowerCase()}</strong>. <br/>
          Seu refúgio está preparado.
        </p>

        {/* Fake Permission Request */}
        <div className="bg-white dark:bg-nath-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-nath-dark-border w-full mb-8 flex items-center gap-3 text-left">
          <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full text-orange-500">
            <Bell size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-nath-dark dark:text-nath-dark-text">Lembretes de autocuidado</p>
            <p className="text-[10px] text-gray-400">Posso te mandar um carinho por dia?</p>
          </div>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
             <input 
               type="checkbox" 
               name="toggle" 
               id="toggle" 
               checked={!!formData.notificationsEnabled}
               onChange={(e) => updateData('notificationsEnabled', e.target.checked)}
               className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-300 ease-in-out checked:translate-x-5 checked:border-nath-blue"
             />
             <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${formData.notificationsEnabled ? 'bg-nath-blue' : 'bg-gray-300'}`}></label>
          </div>
        </div>

        <button 
          onClick={handleFinish}
          className="w-full bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-nath-blue/20 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Entrar na minha casa <Shield size={18} />
        </button>
        
        <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1 justify-center">
          <Shield size={10} /> Seus dados estão seguros comigo.
        </p>
      </div>
    );
  }

  return null;
};

// Helper Icons
const UserSupportIconPartial = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
);
const UserSupportIconNone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);
