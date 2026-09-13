import React from 'react';
import { useEvent } from '../context/EventContext';
import { ActiveTab } from '../types';
import {
  Home,
  MapPin,
  Calendar,
  Sparkles,
  Bot,
  Bell,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';

export const AttendeeNavigation: React.FC = () => {
  const { activeTab, setActiveTab, unreadAnnouncementsCount, role } = useEvent();

  if (role !== 'attendee') return null;

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Smart Map', icon: MapPin },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'for-you', label: 'For You', icon: Sparkles },
    { id: 'ai', label: 'AI Guide', icon: Bot },
    { id: 'updates', label: 'Updates', icon: Bell, badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'alignment', label: 'Hackathon Alignment', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Desktop Top Sub-Nav Bar */}
      <nav aria-label="Attendee views navigation" className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  id={`nav-tab-${tab.id}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav aria-label="Mobile attendee navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
