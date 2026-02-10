import { GameShell } from '@/components/game/GameShell';

export default function ClassicPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">经典模式</h2>
      <GameShell mode="classic" />
    </div>
  );
}
