import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Tuxun-Play',
  description: 'GeoGuessr-like 图寻游戏'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers>
          <header className="border-b">
            <nav className="mx-auto flex max-w-6xl items-center gap-4 p-4 text-sm">
              <Link href="/">Tuxun-Play</Link>
              <Link href="/play/classic">经典</Link>
              <Link href="/play/daily">每日</Link>
              <Link href="/packs">地图包</Link>
              <Link href="/leaderboards">排行榜</Link>
              <Link href="/profile">我的</Link>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
