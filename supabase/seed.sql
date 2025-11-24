-- ============================================
-- NOSSA MATERNIDADE - SEED DATA
-- Dados iniciais para desenvolvimento e testes
-- ============================================

-- ============================================
-- HÁBITOS PADRÃO
-- ============================================

INSERT INTO public.habits (name, description, icon, color, category, frequency) VALUES
('Meditação Diária', 'Pratique mindfulness e relaxamento', 'Brain', '#A78BFA', 'wellness', 'daily'),
('Hidratação', 'Beba 2L de água por dia', 'Droplets', '#60A5FA', 'wellness', 'daily'),
('Caminhada', 'Caminhe pelo menos 20 minutos', 'Footprints', '#34D399', 'exercise', 'daily'),
('Diário da Gratidão', 'Escreva 3 coisas pelas quais é grata', 'Heart', '#FF8FA3', 'wellness', 'daily'),
('Alongamento', 'Alongue-se ao acordar', 'Stretch', '#FFB997', 'exercise', 'daily'),
('Leitura para o Bebê', 'Leia histórias para seu bebê', 'Book', '#A78BFA', 'parenting', 'daily'),
('Skincare', 'Cuide da sua pele', 'Sparkles', '#FF8FA3', 'wellness', 'daily'),
('Sono Adequado', 'Durma pelo menos 7 horas', 'Moon', '#60A5FA', 'wellness', 'daily'),
('Alimentação Saudável', 'Coma 5 porções de frutas/vegetais', 'Apple', '#34D399', 'nutrition', 'daily'),
('Tempo para Si', 'Reserve 15min para você', 'Heart', '#FFB997', 'wellness', 'daily')
ON CONFLICT DO NOTHING;

-- ============================================
-- MARCOS DE DESENVOLVIMENTO DO BEBÊ
-- ============================================

-- Marcos 0-3 meses
INSERT INTO public.baby_milestones (title, description, category, age_months, tips) VALUES
('Levanta a cabeça', 'Consegue levantar e sustentar a cabeça quando está de bruços', 'motor', 2, '["Coloque o bebê de bruços por alguns minutos várias vezes ao dia", "Use brinquedos coloridos para estimular"]'),
('Sorri socialmente', 'Sorri em resposta ao rosto e à voz de pessoas conhecidas', 'social', 2, '["Converse bastante com o bebê", "Faça expressões faciais exageradas"]'),
('Segue objetos com os olhos', 'Acompanha objetos em movimento com o olhar', 'sensorial', 3, '["Use brinquedos coloridos e mova-os lentamente", "Mantenha contato visual frequente"]'),
('Reage a sons', 'Vira a cabeça em direção aos sons', 'sensorial', 3, '["Fale com o bebê de diferentes direções", "Use chocalhos e brinquedos sonoros"]'),

-- Marcos 4-6 meses
('Rola de bruços para costas', 'Consegue rolar sozinho mudando de posição', 'motor', 5, '["Pratique em superfície segura e plana", "Incentive com brinquedos ao lado"]'),
('Pega objetos', 'Alcança e pega objetos com as mãos', 'motor', 5, '["Ofereça brinquedos de diferentes texturas", "Coloque objetos ao alcance do bebê"]'),
('Balbucia', 'Emite sons como "bababa", "mamama"', 'linguagem', 6, '["Repita os sons que o bebê faz", "Converse e cante bastante"]'),
('Reconhece rostos familiares', 'Diferencia pessoas conhecidas de estranhos', 'cognitivo', 6, '["Mantenha rotina com as mesmas pessoas", "Apresente familiares gradualmente"]'),

-- Marcos 7-9 meses
('Senta sem apoio', 'Consegue sentar sozinho sem precisar de suporte', 'motor', 7, '["Use almofadas ao redor para segurança", "Pratique por períodos curtos"]'),
('Transfere objetos entre as mãos', 'Passa brinquedos de uma mão para outra', 'motor', 7, '["Ofereça brinquedos seguros", "Estimule a exploração"]'),
('Engatinha', 'Movimenta-se engatinhando ou arrastando', 'motor', 8, '["Crie um espaço seguro para exploração", "Use brinquedos para incentivar movimento"]'),
('Entende "não"', 'Reage quando ouve a palavra "não"', 'linguagem', 9, '["Use tom de voz adequado", "Seja consistente"]'),

-- Marcos 10-12 meses
('Fica em pé com apoio', 'Consegue ficar de pé segurando em móveis', 'motor', 10, '["Certifique-se de que o ambiente é seguro", "Incentive com brinquedos em altura adequada"]'),
('Faz pinça com os dedos', 'Pega objetos pequenos com polegar e indicador', 'motor', 10, '["Ofereça alimentos pequenos e seguros (sob supervisão)", "Use brinquedos apropriados para a idade"]'),
('Fala primeiras palavras', 'Diz "mamã", "papá" ou outras palavras simples', 'linguagem', 12, '["Nomeie objetos e pessoas constantemente", "Leia livros infantis juntos"]'),
('Acena tchau', 'Acena com a mão para despedir-se', 'social', 11, '["Pratique acenar quando alguém sai", "Reforce positivamente quando o bebê imita"]'),

-- Marcos 13-18 meses
('Anda sozinho', 'Caminha sem apoio', 'motor', 14, '["Deixe o bebê andar descalço em casa", "Remova obstáculos perigosos"]'),
('Usa colher', 'Tenta comer sozinho com a colher', 'motor', 15, '["Ofereça alimentos fáceis de pegar", "Aceite a bagunça inicial"]'),
('Aponta para o que quer', 'Usa o dedo indicador para mostrar interesse', 'social', 14, '["Responda quando a criança apontar", "Nomeie o que ela está mostrando"]'),
('Fala várias palavras', 'Vocabulário de 10-20 palavras', 'linguagem', 18, '["Leia histórias diariamente", "Cante músicas infantis"]'),

-- Marcos 19-24 meses
('Corre', 'Corre com mais coordenação', 'motor', 20, '["Supervisione brincadeiras ao ar livre", "Crie oportunidades seguras para correr"]'),
('Sobe escadas', 'Sobe escadas com ajuda', 'motor', 21, '["Sempre supervisione perto de escadas", "Pratique com segurança"]'),
('Forma frases simples', 'Combina 2-3 palavras em frases', 'linguagem', 24, '["Expanda as frases do bebê", "Converse sobre o dia a dia"]'),
('Brinca de faz de conta', 'Imita atividades do dia a dia nas brincadeiras', 'cognitivo', 22, '["Forneça brinquedos de imitação", "Participe das brincadeiras"]')
ON CONFLICT DO NOTHING;

-- ============================================
-- CONTEÚDOS DO FEED (EXEMPLOS)
-- ============================================

INSERT INTO public.content_items (
  title,
  description,
  type,
  category,
  thumbnail_url,
  author_name,
  author_avatar_url,
  tags,
  duration,
  is_published,
  published_at
) VALUES
-- Vídeos
('Técnicas de Respiração para o Parto', 'Aprenda técnicas de respiração que vão te ajudar durante o trabalho de parto', 'video', 'pregnancy', 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800', 'Dra. Ana Silva', 'https://i.pravatar.cc/150?u=ana', '["parto", "respiração", "preparação"]', 420, true, NOW()),
('Como Amamentar Corretamente', 'Posições e dicas para uma amamentação bem-sucedida', 'video', 'breastfeeding', 'https://images.unsplash.com/photo-1587108852525-10cec733e37d?w=800', 'Dra. Carla Santos', 'https://i.pravatar.cc/150?u=carla', '["amamentação", "recém-nascido", "dicas"]', 360, true, NOW()),
('Yoga Pré-Natal', 'Sequência de yoga segura para gestantes', 'video', 'exercise', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800', 'Marina Costa', 'https://i.pravatar.cc/150?u=marina', '["yoga", "gestação", "exercício"]', 900, true, NOW()),

-- Áudios
('Meditação Guiada para Mães', 'Relaxe e reconecte-se consigo mesma', 'audio', 'wellness', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', 'Paula Mindful', 'https://i.pravatar.cc/150?u=paula', '["meditação", "relaxamento", "mindfulness"]', 600, true, NOW()),
('Sons Relaxantes para o Bebê Dormir', 'Ruído branco e melodias suaves', 'audio', 'sleep', 'https://images.unsplash.com/photo-1519948063487-2e6abf5eac81?w=800', 'Sono Tranquilo', 'https://i.pravatar.cc/150?u=sono', '["sono", "bebê", "ruído branco"]', 1800, true, NOW()),

-- Artigos
('Desenvolvimento do Bebê: 0-3 Meses', 'Tudo que você precisa saber sobre os primeiros meses', 'article', 'development', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800', 'Dra. Beatriz Lima', 'https://i.pravatar.cc/150?u=beatriz', '["desenvolvimento", "recém-nascido", "marcos"]', NULL, true, NOW()),
('Introdução Alimentar: Guia Completo', 'Quando e como começar a introdução alimentar', 'article', 'nutrition', 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800', 'Nutri Fernanda', 'https://i.pravatar.cc/150?u=fernanda', '["alimentação", "introdução alimentar", "nutrição"]', NULL, true, NOW()),
('Depressão Pós-Parto: Sinais e Ajuda', 'Entenda os sintomas e onde buscar apoio', 'article', 'mental_health', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800', 'Psic. Julia Mendes', 'https://i.pravatar.cc/150?u=julia', '["saúde mental", "pós-parto", "depressão"]', NULL, true, NOW()),

-- Reels
('5 Dicas Rápidas para Acalmar o Bebê', 'Técnicas eficazes em menos de 1 minuto', 'reels', 'parenting', 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800', 'Mamãe Prática', 'https://i.pravatar.cc/150?u=mamaepratica', '["dicas", "choro", "acalmar"]', 60, true, NOW()),
('Produtos Essenciais para o Enxoval', 'O que realmente vale a pena comprar', 'reels', 'shopping', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800', 'Lista da Mamãe', 'https://i.pravatar.cc/150?u=lista', '["enxoval", "compras", "essenciais"]', 45, true, NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- DADOS DE EXEMPLO - COMUNIDADE
-- (Comentado para não criar posts fake em produção)
-- ============================================

-- Para desenvolvimento, você pode descomentar abaixo para ter posts de exemplo
/*
INSERT INTO public.community_posts (user_id, content, tags, is_approved, likes_count, comments_count) VALUES
(
  (SELECT id FROM public.profiles LIMIT 1),
  'Acabei de completar 36 semanas! Ansiosa para conhecer meu bebê 💕',
  '["gestação", "36 semanas", "ansiedade"]',
  true,
  15,
  8
),
(
  (SELECT id FROM public.profiles LIMIT 1),
  'Dica: usar compressas quentes ajudou muito com a descida do leite!',
  '["amamentação", "dica", "pós-parto"]',
  true,
  42,
  12
);
*/
