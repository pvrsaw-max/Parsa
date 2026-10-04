export default function MessageBubble({text, role}:{text:string; role:'user'|'hedi'}){
  return <div>{role === 'hedi' ? '🌷 Hedi: ' : 'هدیه: '}{text}</div>;
}
