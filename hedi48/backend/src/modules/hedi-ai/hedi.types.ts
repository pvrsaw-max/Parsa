export type HediMessage = {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};
