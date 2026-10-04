const memoryStore = new Map<string, string[]>();

export function addMemory(userId:string, value:string){
  const items = memoryStore.get(userId) || [];
  items.push(value);
  memoryStore.set(userId, items.slice(-50));
  return memoryStore.get(userId);
}

export function getMemory(userId:string){
  return memoryStore.get(userId) || [];
}
