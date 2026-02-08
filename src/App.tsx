import { type ReactNode, useState } from 'react';
import { Footer } from './components/Footer';
import { type AppTab, Navbar } from './components/Navbar';
import { AnnotatorPage } from './pages/AnnotatorPage';
import { DashboardPage } from './pages/DashboardPage';
import { RadarPage } from './pages/RadarPage';

const tabMap: Record<AppTab, ReactNode> = {
  dashboard: <DashboardPage />,
  annotator: <AnnotatorPage />,
  radar: <RadarPage />,
};

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto max-w-6xl px-4 py-5">{tabMap[activeTab]}</main>
      <Footer />
    </div>
  );
}

export default App;
