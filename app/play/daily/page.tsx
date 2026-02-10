import { GameShell } from '@/components/game/GameShell';

export default function DailyPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">每日挑战</h2>
      <GameShell mode="daily" />
    </div>
  );
}
