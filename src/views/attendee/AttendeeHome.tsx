import React from 'react';
import { useEvent } from '../../context/EventContext';
import {
  Clock,
  MapPin,
  Flame,
  AlertTriangle,
  Coffee,
  HelpCircle,
  Footprints,
  Compass,
  ArrowRight,
  Sparkles,
  Bookmark,
  Users,
  Eye,
  CheckCircle2,
  Radio,
  Share2,
} from 'lucide-react';

export const AttendeeHome: React.FC = () => {
  const {
    zones,
    sessions,
    announcements,
    profile,
    setActiveTab,
    setDestinationZoneId,
    toggleSaveSession,
    setIsSOSModalOpen,
    setIsAccessibilityModalOpen,
    updateAccessibilitySettings,
  } = useEvent();

  // Find ongoing session
  const ongoingSession = sessions.find((s) => s.status === 'ONGOING') ?? sessions[0];
  const ongoingZone = zones.find((z) => z.id === ongoingSession?.locationId);

  // Find next saved session or upcoming high-interest session
  const savedSessions = sessions
    .filter((s) => profile.savedSessionIds.includes(s.id) && s.status !== 'COMPLETED')
    .sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);

  const upcomingSession = savedSessions[0] ?? sessions.find((s) => s.status === 'STARTING SOON') ?? sessions[1];
  const upcomingZone = zones.find((z) => z.id === upcomingSession?.locationId);

  // Identify high congestion bottleneck zone
  const congestedZone = zones
    .slice()
    .sort((a, b) => b.crowdLevel - a.crowdLevel)
    .find((z) => z.crowdLevel >= 80);

  // Quick Action Handler
  const handleNavigateToFacility = (category: string, specificId?: string) => {
    if (specificId) {
      setDestinationZoneId(specificId);
      setActiveTab('map');
      return;
    }

    if (category === 'Restroom') {
      const target = profile.accessibilitySettings.accessibleRestroomFinder
        ? 'zone-accessible-restroom'
        : 'zone-restrooms';
      setDestinationZoneId(target);
      setActiveTab('map');
    } else if (category === 'Dining') {
      // Pick least crowded dining option
      const diningZones = zones.filter((z) => z.category === 'Dining').sort((a, b) => a.crowdLevel - b.crowdLevel);
      setDestinationZoneId(diningZones[0]?.id ?? 'zone-food-court-b');
      setActiveTab('map');
    } else if (category === 'Help') {
      setDestinationZoneId('zone-help-desk');
      setActiveTab('map');
    }
  };

  const handleQuickAccessibleRoute = () => {
    updateAccessibilitySettings({ avoidStairs: true });
    setDestinationZoneId('zone-hall-b');
    setActiveTab('map');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Real-time alert banner (if urgent announcement exists) */}
      {announcements.length > 0 && announcements[0].severity !== 'info' && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-sm ${
            announcements[0].severity === 'urgent'
              ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 text-rose-950 dark:text-rose-100'
              : 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 text-amber-950 dark:text-amber-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              announcements[0].severity === 'urgent' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {announcements[0].severity} Broadcast
                </span>
                <span className="text-xs opacity-75">• {announcements[0].timestamp}</span>
              </div>
              <h3 className="text-sm font-bold mt-0.5">{announcements[0].title}</h3>
              <p className="text-xs opacity-90 mt-0.5">{announcements[0].message}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('updates')}
            className="text-xs font-bold underline shrink-0 px-2 py-1 rounded hover:bg-black/5"
          >
            View Details
          </button>
        </div>
      )}

      {/* Hero Welcome & AI Search Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 mb-3">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>FutureTech 2026 Live Operations • San Francisco</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Know where to go. Know what’s next. Stay safe.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Real-time crowd balancing, intelligent step-free navigation, and instant incident response for 12,000+ attendees.
          </p>

          {/* Quick AI Trigger Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2">
            <button
              onClick={() => setActiveTab('ai')}
              id="hero-ai-query-btn"
              className="flex-1 flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-left transition-all group backdrop-blur-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span className="text-sm text-slate-200 font-medium">
                  Ask EventPulse AI: “I have 30 minutes, what should I attend?”
                </span>
              </div>
              <span className="text-xs font-semibold text-indigo-300 hidden sm:inline-block">
                Ask Assistant →
              </span>
            </button>

            <button
              onClick={() => setIsSOSModalOpen(true)}
              id="hero-sos-btn"
              className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS Help</span>
            </button>
          </div>

          {/* Quick chip queries */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Try asking:</span>
            {[
              'Less crowded food court?',
              'Step-free route to Hall B',
              'Nearest accessible restroom',
            ].map((query) => (
              <button
                key={query}
                onClick={() => setActiveTab('ai')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors text-[11px]"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-300 via-emerald-400 to-transparent" />
      </div>

      {/* NOW & NEXT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Happening Now */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Happening Right Now
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Live
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {ongoingSession?.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {ongoingSession?.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  {ongoingZone?.name ?? 'Main Stage'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Crowd Occupancy</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  {ongoingZone?.crowdLevel ?? 92}% ({ongoingZone?.crowdStatus ?? 'High'})
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Speaker: <strong className="text-slate-700 dark:text-slate-300">{ongoingSession?.speaker.name}</strong>
            </span>
            <button
              onClick={() => {
                if (ongoingZone) setDestinationZoneId(ongoingZone.id);
                setActiveTab('map');
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Navigate Venue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* What's Next / Upcoming */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Up Next In Schedule
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Starts in ~25 min
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {upcomingSession?.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {upcomingSession?.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Room & Zone</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  {upcomingZone?.name ?? 'Hall B'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Walk Time</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Footprints className="w-3.5 h-3.5" />
                  ~4 min (Step-Free)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => upcomingSession && toggleSaveSession(upcomingSession.id)}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <Bookmark className={`w-3.5 h-3.5 ${profile.savedSessionIds.includes(upcomingSession?.id ?? '') ? 'fill-indigo-600 text-indigo-600' : ''}`} />
              <span>{profile.savedSessionIds.includes(upcomingSession?.id ?? '') ? 'Saved' : 'Save Session'}</span>
            </button>
            <button
              onClick={() => {
                if (upcomingZone) setDestinationZoneId(upcomingZone.id);
                setActiveTab('map');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <span>Get Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CROWD PULSE & BOTTLENECK ALERT */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Venue Crowd Pulse</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live density telemetry dynamically reroutes attendee pathways away from bottlenecks
            </p>
          </div>

          {congestedZone && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Avoid right now: {congestedZone.name} ({congestedZone.crowdLevel}% density)</span>
            </div>
          )}
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {zones.slice(0, 6).map((zone) => {
            const isHigh = zone.crowdLevel >= 75;
            const isMod = zone.crowdLevel >= 40 && zone.crowdLevel < 75;
            return (
              <button
                key={zone.id}
                onClick={() => {
                  setDestinationZoneId(zone.id);
                  setActiveTab('map');
                }}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-500 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {zone.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                        : isMod
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}
                  >
                    {zone.crowdLevel}%
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                  {zone.name}
                </div>
                {/* Visual density meter bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isHigh ? 'bg-rose-500' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${zone.crowdLevel}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Venue Shortcuts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => handleNavigateToFacility('Restroom')}
            id="quick-action-restroom"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Footprints className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Find Restrooms
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Nearest: 2 min walk
            </p>
          </button>

          <button
            onClick={() => handleNavigateToFacility('Dining')}
            id="quick-action-food"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Find Food & Drinks
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Food Court B (Low crowd)
            </p>
          </button>

          <button
            onClick={() => handleNavigateToFacility('Help')}
            id="quick-action-help"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Central Help Desk
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lost badge, info, lost items
            </p>
          </button>

          <button
            onClick={handleQuickAccessibleRoute}
            id="quick-action-accessible"
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Accessible Route
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              100% Step-free pathfinding
            </p>
          </button>

          <button
            onClick={() => setIsSOSModalOpen(true)}
            id="quick-action-sos"
            className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:border-rose-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-rose-950 dark:text-rose-200">
              Emergency SOS
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
              Medic / Security dispatch
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
