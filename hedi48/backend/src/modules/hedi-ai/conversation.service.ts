import { addMemory, getMemory } from './memory.service';
import { getHediTone } from './personality.service';

const conversations = new Map<string, any[]>();

export function createConversation(userId:string, message:string){
  const history = conversations.get(userId) || [];
  history.push({role:'user', content:message, createdAt:new Date()});

  const response = `من کنارتم. بیایم قدم بعدی رو با هم پیدا کنیم.`;
  history.push({role:'assistant', content:response, createdAt:new Date()});

  conversations.set(userId, history);
  addMemory(userId, message);

  return {
    response,
    tone:getHediTone(),
    memory:getMemory(userId)
  };
}

export function getConversation(userId:string){
  return conversations.get(userId) || [];
}
