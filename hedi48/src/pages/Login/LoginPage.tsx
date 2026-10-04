import { useState } from 'react';

export default function LoginPage(){
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem('hedi_user', name.trim());
    window.location.href = '/dashboard';
  };

  return (
    <div>
      <h1>Hedi Life</h1>
      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={handleLogin}>Enter</button>
    </div>
  );
}
