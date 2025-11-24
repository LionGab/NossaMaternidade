
import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, ArrowLeft, Moon, Sun, Coffee, Heart, Shield, Smile, Meh, Frown, BatteryLow, BatteryMedium, BatteryFull, Volume2, StopCircle, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../components/audioUtils'; // Importar utilitários de áudio
import { triggerHaptic } from '../components/UI';

interface RitualProps {
  onComplete: () => void;
  onBack: () => void;
}

export const Ritual: React.FC<RitualProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [currentFeeling, setCurrentFeeling] = useState<string | null>(null);
  const [desiredFeeling, setDesiredFeeling] = useState<string | null>(null);
  const [isPlayingPractice, setIsPlayingPractice] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const audioSourceRef = React.useRef<AudioBufferSourceNode | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Mock Practice Generator based on selection
  const getPractice = () => {
    return {
      title: "Pausa de Respiração 4-7-8",
      text: "Inspire pelo nariz contando até 4. Segure o ar por 7. Solte pela boca fazendo som de 'ahh' por 8. Repita 3 vezes.",
      action: "Fazer agora (30s)"
    };
  };

  const handleNext = () => {
    triggerHaptic();
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  const handleBack = () => {
    triggerHaptic();
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handlePlayPractice = async () => {
    if (isPlayingPractice) {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      }
      setIsPlayingPractice(false);
      return;
    }

    setIsGeneratingSpeech(true);
    triggerHaptic();

    try {
      const practiceText = getPractice().text;
      const base64Audio = await generateSpeech(practiceText);
      if (!base64Audio) {
        console.error("Nenhum áudio recebido.");
        return;
      }

      // Fix: Use standard AudioContext
      if (audioContextRef.current) {
        audioContextRef.current.close(); // Close previous context if exists
      }
      audioContextRef.current = new window.AudioContext({sampleRate: 24000});
      const outputNode = audioContextRef.current.createGain();
      outputNode.connect(audioContextRef.current.destination);

      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioContextRef.current,
        24000,
        1,
      );

      audioSourceRef.current = audioContextRef.current.createBufferSource();
      audioSourceRef.current.buffer = audioBuffer;
      audioSourceRef.current.connect(outputNode);

      audioSourceRef.current.onended = () => {
        setIsPlayingPractice(false);
        audioSourceRef.current = null;
        if (audioContextRef.current) audioContextRef.current.close(); // Close context after playback
      };

      audioSourceRef.current.start();
      setIsPlayingPractice(true);

    } catch (error) {
      console.error("Erro ao reproduzir áudio da prática:", error);
      setIsPlayingPractice(false);
    } finally {
      setIsGeneratingSpeech(false);
    }
  };

  const feelings = [
    { icon: <BatteryLow className="text-red-400" />, label: "Exausta", id: "exausta" },
    { icon: <Frown className="text-orange-400" />, label: "Ansiosa", id: "ansiosa" },
    { icon: <Meh className="text-yellow-400" />, label: "Confusa", id: "confusa" },
    { icon: <BatteryMedium className="text-blue-400" />, label: "Ok", id: "ok" },
    { icon: <BatteryFull className="text-green-400" />, label: "Grata", id: "grata" },
  ];

  const desires = [
    { icon: <Shield className="text-blue-400" />, label: "Mais forte", id: "forte" },
    { icon: <Heart className="text-pink-400" />, label: "Acolhida", id: "acolhida" },
    { icon: <Moon className="text-purple-400" />, label: "Em paz", id: "paz" },
    { icon: <Sun className="text-yellow-400" />, label: "Energizada", id: "energia" },
  ];

  const practice = getPractice();

  return (
    <div className="min-h-screen bg-[#FFF8F3] dark:bg-nath-dark-bg flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white/50 dark:bg-nath-dark-card/50 border-b border-gray-100 dark:border-nath-dark-border backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={handleBack} 
          className="bg-black text-white dark:bg-white dark:text-black p-2 rounded-full shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex-1 mx-4 flex flex-col justify-center items-center">
           <span className="text-[10px] font-bold text-nath-blue uppercase tracking-widest">Nossa Maternidade</span>
           <div className="w-full max-w-[120px] bg-gray-200 dark:bg-nath-dark-bg h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-nath-blue h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
           </div>
        </div>

        <span className="text-xs font-bold text-nath-dark dark:text-gray-400 w-9 text-right">
          00:30
        </span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        
        {/* Step 1: Current Feeling */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-nath-dark dark:text-nath-dark-text mb-2 text-center">
              Como você está agora?
            </h2>
            <p className="text-center text-gray-500 dark:text-nath-dark-muted mb-8">
              Sem julgamentos, só a verdade.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {feelings.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCurrentFeeling(f.id)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    currentFeeling === f.id
                      ? 'border-nath-blue bg-nath-light-blue dark:bg-blue-900/30 text-nath-blue dark:text-blue-300'
                      : 'border-transparent bg-white dark:bg-nath-dark-card text-gray-500 dark:text-gray-300 shadow-sm'
                  }`}
                >
                  {f.icon}
                  <span className="font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Desired Feeling */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-nath-dark dark:text-nath-dark-text mb-2 text-center">
              Como você quer se sentir?
            </h2>
            <p className="text-center text-gray-500 dark:text-nath-dark-muted mb-8">
              Vamos setar uma intenção pro dia.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {desires.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDesiredFeeling(d.id)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    desiredFeeling === d.id
                      ? 'border-nath-pink bg-pink-50 dark:bg-pink-900/30 text-nath-pink'
                      : 'border-transparent bg-white dark:bg-nath-dark-card text-gray-500 dark:text-gray-300 shadow-sm'
                  }`}
                >
                  {d.icon}
                  <span className="font-medium">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Practice */}
        {step === 3 && (
          <div className="animate-in fade-in zoom-in duration-500 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coffee size={32} />
            </div>
            <h2 className="text-xl font-bold text-nath-dark dark:text-nath-dark-text mb-4">
              Vamos fazer isso juntas:
            </h2>
            
            <div className="bg-white dark:bg-nath-dark-card p-6 rounded-2xl shadow-lg border-l-4 border-nath-blue mb-8 text-left transition-colors">
              <h3 className="font-bold text-nath-blue dark:text-blue-300 mb-2">{practice.title}</h3>
              <p className="text-nath-dark dark:text-gray-200 leading-relaxed">
                {practice.text}
              </p>
              <button 
                onClick={handlePlayPractice}
                disabled={isGeneratingSpeech}
                className="mt-4 w-full bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-nath-blue/20 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                aria-label={isPlayingPractice ? "Parar instrução" : "Ouvir instrução"}
              >
                {isGeneratingSpeech ? (
                  <>Gerando áudio... <Loader2 size={18} className="animate-spin" /></>
                ) : isPlayingPractice ? (
                  <>Parar áudio <StopCircle size={18} /></>
                ) : (
                  <>Ouvir instrução <Volume2 size={18} /></>
                )}
              </button>
            </div>

            <button 
              onClick={onComplete}
              className="w-full bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-nath-blue/20 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Concluído (Vitória!)
            </button>
            <p className="text-xs text-gray-400 mt-4">Isso conta para sua Jornada Emocional.</p>
          </div>
        )}

      </div>

      {/* Footer Navigation (Steps 1 & 2) */}
      {step < 3 && (
        <div className="p-6">
          <button 
            onClick={handleNext}
            disabled={step === 1 ? !currentFeeling : !desiredFeeling}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              (step === 1 ? !currentFeeling : !desiredFeeling)
                ? 'bg-gray-200 dark:bg-nath-dark-card text-gray-400 dark:text-nath-dark-muted cursor-not-allowed'
                : 'bg-nath-blue hover:bg-blue-500 dark:bg-nath-dark-hero dark:hover:bg-blue-700 text-white shadow-lg shadow-nath-blue/20 dark:shadow-none active:scale-95'
            }`}
          >
            Continuar <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
