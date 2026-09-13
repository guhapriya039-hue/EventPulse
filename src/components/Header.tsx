import React from 'react';
import { useEvent } from '../context/EventContext';
import {
  Sparkles,
  Search,
  Bell,
  Sliders,
  Eye,
  Shield,
  Layers,
  HelpCircle,
  Radio,
  SlidersHorizontal,
  Flame,
  Check,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    unreadAnnouncementsCount,
    setIsSearchModalOpen,
    setIsAccessibilityModalOpen,
    isDemoScenarioActive,
    setIsDemoScenarioActive,
    profile,
  } = useEvent();

  const isAccessibilityActive =
    profile.accessibilitySettings.avoidStairs ||
    profile.accessibilitySettings.highContrast ||
    profile.accessibilitySettings.largeText ||
    profile.accessibilitySettings.reduceMotion;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Event Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    Event<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Smart OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  FutureTech 2026 • Convention Center
                </p>
              </div>
            </button>
          </div>

          {/* Quick Search trigger button */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              id="header-search-trigger"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 transition-all text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search sessions, stages, restrooms, food, help...</span>
              </span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-sm text-slate-500">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Accessibility Toggle */}
            <button
              onClick={() => setIsAccessibilityModalOpen(true)}
              id="header-accessibility-btn"
              aria-label="Open Accessibility Settings"
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isAccessibilityActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
              title="Accessibility Mode (Avoid Stairs, Large Text, Contrast)"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">A11y</span>
              {isAccessibilityActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              )}
            </button>

            {/* Notifications / Live Updates Counter */}
            <button
              onClick={() => setActiveTab('updates')}
              aria-label="Live updates notifications"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Live Announcements"
            >
              <Bell className="w-4 h-4" />
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill: Attendee vs Organizer */}
            <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setRole('attendee')}
                id="role-attendee-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'attendee'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Attendee
              </button>
              <button
                onClick={() => setRole('organizer')}
                id="role-organizer-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  role === 'organizer'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Control</span>
              </button>
            </div>

            {/* Judge Demo Trigger */}
            <button
              onClick={() => setIsDemoScenarioActive(!isDemoScenarioActive)}
              id="judge-demo-toggle-btn"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isDemoScenarioActive
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Demo Guide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
