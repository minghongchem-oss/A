import { GameShell } from '@/components/game/GameShell';

export default function TimeTrialPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">限时模式</h2>
      <GameShell mode="timetrial" />
    </div>
  );
}
