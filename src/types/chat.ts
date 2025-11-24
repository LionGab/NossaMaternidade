export interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface QuickReply {
  id: string;
  text: string;
}

export const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { id: '1', text: 'Como está meu bebê?' },
  { id: '2', text: 'Dicas de alimentação' },
  { id: '3', text: 'Desenvolvimento infantil' },
  { id: '4', text: 'Cuidados com a saúde' },
];
