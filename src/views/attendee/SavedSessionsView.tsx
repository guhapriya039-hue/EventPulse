import React from 'react';
import { useEvent } from '../../context/EventContext';
import { VenueZone } from '../../types';
import {
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Trash2,
  Share2,
} from 'lucide-react';

export const SavedSessionsView: React.FC = () => {
  const {
    sessions,
    zones,
    profile,
    toggleSaveSession,
    setDestinationZoneId,
    setActiveTab,
  } = useEvent();

  const zoneMap = new Map<string, VenueZone>(zones.map((z) => [z.id, z]));

  const savedList = sessions
    .filter((s) => profile.savedSessionIds.includes(s.id))
    .sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);

  const handleRoute = (locationId: string) => {
    setDestinationZoneId(locationId);
    setActiveTab('map');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            <span>My Saved Itinerary ({savedList.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalized agenda with real-time routing and schedule gap monitoring
          </p>
        </div>

        <button
          onClick={() => setActiveTab('schedule')}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Add More Sessions</span>
        </button>
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No Saved Sessions Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the schedule or explore "For You" recommendations to bookmark technical talks and workshops.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Explore Full Schedule
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {savedList.map((session, index) => {
            const loc = zoneMap.get(session.locationId);
            return (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold flex items-center justify-center text-slate-600 dark:text-slate-400">
                      {index + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {session.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {session.time}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {loc?.name}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {session.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Speaker: <strong>{session.speaker.name}</strong> ({session.speaker.company})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleSaveSession(session.id)}
                    className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove from saved itinerary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRoute(session.locationId)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Navigate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
