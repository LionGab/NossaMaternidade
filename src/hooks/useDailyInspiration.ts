/**
 * useDailyInspiration - Hook para frase inspiracional do dia
 *
 * Retorna uma frase motivacional aleatória para exibir na Home.
 * Inclui função refetch para trocar a frase.
 *
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Frases inspiracionais para mães
 * Focadas em: maternidade, autocuidado, força, esperança
 */
const INSPIRATIONS = [
  'Você está fazendo um trabalho incrível, mesmo nos dias em que não sente isso. 💚',
  'Cada pequeno passo conta. Você é mais forte do que imagina. 💖',
  'Ser mãe não exige perfeição, exige amor. E amor você tem de sobra. 💕',
  'Respire fundo. Você está fazendo o melhor que pode, e isso é suficiente. 🌸',
  'Cuide de você primeiro. Uma mãe feliz cria filhos felizes. 💝',
  'Seus sentimentos são válidos. Tudo bem não estar bem às vezes. 🤗',
  'Você merece descanso, carinho e compreensão. Inclusive de você mesma. 💗',
  'A jornada é difícil, mas você não está sozinha. Estamos aqui. 💜',
  'Permita-se errar. É assim que a gente aprende e cresce. 🌱',
  'Sua força vem de dentro. Confie no seu instinto de mãe. ✨',
];

export interface UseDailyInspirationReturn {
  quote: string;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Gera um índice baseado na data atual para ter a mesma frase durante o dia
 * mas uma diferente a cada dia
 */
function getDailyIndex(arrayLength: number): number {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % arrayLength;
}

/**
 * Hook para obter frase inspiracional do dia
 */
export function useDailyInspiration(): UseDailyInspirationReturn {
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    getDailyIndex(INSPIRATIONS.length)
  );
  const [isLoading, setIsLoading] = useState(true);

  // Frase atual baseada no índice
  const quote = useMemo(() => INSPIRATIONS[currentIndex], [currentIndex]);

  // Inicialização
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Função para trocar a frase (pega uma aleatória diferente da atual)
  const refetch = useCallback(() => {
    setCurrentIndex((prev) => {
      let newIndex = Math.floor(Math.random() * INSPIRATIONS.length);
      // Garante que seja diferente da atual
      while (newIndex === prev && INSPIRATIONS.length > 1) {
        newIndex = Math.floor(Math.random() * INSPIRATIONS.length);
      }
      return newIndex;
    });
  }, []);

  return {
    quote,
    isLoading,
    refetch,
  };
}

export default useDailyInspiration;
