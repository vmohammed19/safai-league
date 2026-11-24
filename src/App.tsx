import { useState } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { BottomNav, type Tab } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { ReportPage } from '@/pages/ReportPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { DrivesPage } from '@/pages/DrivesPage';
import { ProfilePage } from '@/pages/ProfilePage';

function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-teal-50/40">
        <div className="mx-auto max-w-md min-h-screen bg-teal-50/40 relative">
          <Header />
          <main className="pb-24">
            {tab === 'home' && <HomePage onNavigate={setTab} />}
            {tab === 'report' && <ReportsPage onNavigate={setTab} />}
            {tab === 'report-form' && <ReportPage />}
            {tab === 'drives' && <DrivesPage />}
            {tab === 'profile' && <ProfilePage />}
          </main>
          <BottomNav
            active={tab === 'report-form' ? 'report' : tab}
            onChange={setTab}
          />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
