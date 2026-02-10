import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">图寻 / Tuxun-Play</h1>
      <p className="text-muted-foreground">多模式地理猜测游戏，支持每日挑战、地图包与多人对战。</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild><Link href="/play/classic">开始经典模式</Link></Button>
        <Button variant="outline" asChild><Link href="/play/daily">每日挑战</Link></Button>
        <Button variant="outline" asChild><Link href="/play/streak">国家连胜</Link></Button>
        <Button variant="outline" asChild><Link href="/play/timetrial">限时模式</Link></Button>
        <Button variant="outline" asChild><Link href="/play/battle">Battle Royale</Link></Button>
      </div>
    </div>
  );
}
