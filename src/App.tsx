import React from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Header } from './components/Header';
import { JudgeDemoBar } from './components/JudgeDemoBar';
import { AttendeeNavigation } from './components/AttendeeNavigation';
import { DemoController } from './components/DemoController';
import { AccessibilityModal } from './components/AccessibilityModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SOSModal } from './components/SOSModal';

import { AttendeeHome } from './views/attendee/AttendeeHome';
import { SmartMap } from './views/attendee/SmartMap';
import { ScheduleView } from './views/attendee/ScheduleView';
import { ForYouView } from './views/attendee/ForYouView';
import { AIAssistantView } from './views/attendee/AIAssistantView';
import { LiveUpdatesView } from './views/attendee/LiveUpdatesView';
import { SavedSessionsView } from './views/attendee/SavedSessionsView';
import { ProblemAlignmentView } from './views/attendee/ProblemAlignmentView';
import { OrganizerControlCenter } from './views/organizer/OrganizerControlCenter';

const MainContent: React.FC = () => {
  const { role, activeTab } = useEvent();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
      {role === 'organizer' ? (
        <OrganizerControlCenter />
      ) : (
        <>
          {activeTab === 'home' && <AttendeeHome />}
          {activeTab === 'map' && <SmartMap />}
          {activeTab === 'schedule' && <ScheduleView />}
          {activeTab === 'for-you' && <ForYouView />}
          {activeTab === 'ai' && <AIAssistantView />}
          {activeTab === 'updates' && <LiveUpdatesView />}
          {activeTab === 'saved' && <SavedSessionsView />}
          {activeTab === 'alignment' && <ProblemAlignmentView />}
        </>
      )}
    </main>
  );
};

export default function App() {
  return (
    <EventProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
        {/* Judge Demo Shortcuts bar */}
        <JudgeDemoBar />

        {/* Global Header */}
        <Header />

        {/* Attendee Navigation Bar */}
        <AttendeeNavigation />

        {/* Main Content Area */}
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Modals & Demo Scenario Runner */}
        <AccessibilityModal />
        <GlobalSearchModal />
        <SOSModal />
        <DemoController />

        {/* Footer */}
        <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">EVENTPULSE</span>
              <span>— Smart Event Experience Platform</span>
            </div>
            <div>
              <span>FutureTech 2026 • “Know where to go. Know what’s next. Stay safe.”</span>
            </div>
          </div>
        </footer>
      </div>
    </EventProvider>
  );
}
