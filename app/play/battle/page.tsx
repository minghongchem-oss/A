'use client';

import { io } from 'socket.io-client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function BattlePage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('未连接');

  function join() {
    const socket = io(process.env.NEXT_PUBLIC_REALTIME_URL ?? 'http://localhost:4001');
    socket.emit('joinRoom', { code: code || 'DEMO' });
    socket.on('joined', (payload) => setStatus(`已加入房间 ${payload.code}，人数 ${payload.count}`));
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Battle Royale (MVP)</h2>
      <input className="rounded border p-2" placeholder="房间码" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button onClick={join}>加入房间</Button>
      <p>{status}</p>
    </div>
  );
}
