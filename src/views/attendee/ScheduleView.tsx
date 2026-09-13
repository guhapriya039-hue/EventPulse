import React, { useState, useMemo } from 'react';
import { useEvent } from '../../context/EventContext';
import {
  Calendar,
  Filter,
  Search,
  Bookmark,
  MapPin,
  Clock,
  Footprints,
  Eye,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const {
    sessions,
    zones,
    profile,
    toggleSaveSession,
    setDestinationZoneId,
    setActiveTab,
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [filterOnlyAccessible, setFilterOnlyAccessible] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);

  const zoneMap = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  const categories = ['All', 'AI', 'Cloud', 'Cybersecurity', 'Accessibility', 'Keynote', 'Workshop'];
  const locations = ['All', 'Main Stage', 'Hall A', 'Hall B', 'Hall C', 'Workshop Zone'];

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const loc = zoneMap.get(session.locationId);

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = session.title.toLowerCase().includes(q);
        const matchSpeaker = session.speaker.name.toLowerCase().includes(q) || session.speaker.company.toLowerCase().includes(q);
        const matchDesc = session.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSpeaker && !matchDesc) return false;
      }

      // Category match
      if (selectedCategory !== 'All' && session.category !== selectedCategory) {
        return false;
      }

      // Location match
      if (selectedLocation !== 'All' && loc?.name !== selectedLocation) {
        return false;
      }

      // Accessibility match
      if (filterOnlyAccessible) {
        const isLocAccessible = loc?.accessibility.hasRamp || loc?.accessibility.hasElevator;
        if (!isLocAccessible) return false;
      }

      // Saved only
      if (filterSavedOnly && !profile.savedSessionIds.includes(session.id)) {
        return false;
      }

      return true;
    });
  }, [sessions, zoneMap, searchQuery, selectedCategory, selectedLocation, filterOnlyAccessible, filterSavedOnly, profile.savedSessionIds]);

  const handleGetRoute = (locationId: string) => {
    setDestinationZoneId(locationId);
    setActiveTab('map');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>FutureTech 2026 Master Schedule</span>
            </h1>
            <p className="text-xs text-slate-500">
              Keynotes, technical deep-dives, hands-on workshops & crowd indicators
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterSavedOnly
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-white' : ''}`} />
              <span>Saved Only ({profile.savedSessionIds.length})</span>
            </button>

            <button
              onClick={() => setFilterOnlyAccessible(!filterOnlyAccessible)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterOnlyAccessible
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Step-Free Only</span>
            </button>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, speaker name, AI, Cloud..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Track:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No sessions match current filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search query or category filters.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const loc = zoneMap.get(session.locationId);
            const isSaved = profile.savedSessionIds.includes(session.id);
            const isOngoing = session.status === 'ONGOING';
            const isSoon = session.status === 'STARTING SOON';

            return (
              <div
                key={session.id}
                id={`session-card-${session.id}`}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all ${
                  isOngoing
                    ? 'border-emerald-500/80 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left session meta */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {session.category}
                      </span>
                      {isOngoing && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Happening Now
                        </span>
                      )}
                      {isSoon && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                          Starting Soon
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {session.time} ({session.durationMinutes} min)
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {session.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      {session.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {session.speaker.name} • <span className="text-slate-400 font-normal">{session.speaker.role}, {session.speaker.company}</span>
                      </span>

                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <strong>{loc?.name ?? 'Hall'}</strong>
                      </span>

                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          session.crowdStatus === 'High'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                            : session.crowdStatus === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                        }`}
                      >
                        {session.crowdStatus} Crowd ({loc?.crowdLevel}%)
                      </span>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => toggleSaveSession(session.id)}
                      id={`save-session-btn-${session.id}`}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save Session'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleGetRoute(session.locationId)}
                      id={`get-route-btn-${session.id}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Get Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
