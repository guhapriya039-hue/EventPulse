import React from 'react';
import { useEvent } from '../../context/EventContext';
import {
  computeForYouRecommendations,
  computeWhatsNext,
} from '../../features/recommendations/recommendationEngine';
import {
  Sparkles,
  Clock,
  MapPin,
  Coffee,
  Bookmark,
  ArrowRight,
  Footprints,
  Sliders,
  Check,
  Plus,
} from 'lucide-react';

const AVAILABLE_INTERESTS = [
  'AI',
  'Cloud Architecture',
  'Cybersecurity',
  'Accessibility',
  'Autonomous Systems',
  'Hardware',
  'Developer Tools',
];

export const ForYouView: React.FC = () => {
  const {
    sessions,
    zones,
    profile,
    updateInterests,
    toggleSaveSession,
    setDestinationZoneId,
    setActiveTab,
  } = useEvent();

  const recommendations = computeForYouRecommendations(sessions, zones, profile);
  const whatsNext = computeWhatsNext(sessions, zones, profile);

  const handleToggleInterest = (interest: string) => {
    const exists = profile.interests.includes(interest);
    const updated = exists
      ? profile.interests.filter((i) => i !== interest)
      : [...profile.interests, interest];
    updateInterests(updated);
  };

  const handleNavigate = (zoneId: string) => {
    setDestinationZoneId(zoneId);
    setActiveTab('map');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* WHAT'S NEXT INTELLIGENCE HERO */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Smart Schedule Gap Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              You have {whatsNext.minutesAvailable} minutes available
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">
              {whatsNext.nextSavedSession
                ? `Before your next saved talk: “${whatsNext.nextSavedSession.title}” at ${whatsNext.nextSavedSession.time.split('–')[0]?.trim()}`
                : 'No upcoming scheduled commitments right now. Here are optimal nearby activities.'}
            </p>
          </div>
        </div>

        {/* What's Next Suggested Opportunities */}
        <div className="mt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-3">
            Handpicked to fit your exact time window:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {whatsNext.opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200">
                      {opp.badge}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {opp.crowdLevel} crowd
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{opp.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{opp.reason}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-indigo-300" />
                    {opp.walkMinutes} min walk
                  </span>
                  <button
                    onClick={() => handleNavigate(opp.locationId)}
                    className="px-3 py-1.5 rounded-lg bg-white text-slate-950 font-bold text-xs hover:bg-indigo-50 flex items-center gap-1 transition-colors"
                  >
                    <span>Go Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOPIC INTEREST PREFERENCES PILLS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Your Active Interests</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tap to customize which technical tracks power your recommendations
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {AVAILABLE_INTERESTS.map((interest) => {
            const isSelected = profile.interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => handleToggleInterest(interest)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{interest}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECOMMENDED SESSIONS LIST */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Ranked Recommendations for You ({recommendations.length})
        </h2>

        <div className="space-y-3">
          {recommendations.slice(0, 6).map(({ session, location, matchReasons, walkTimeMinutes }) => {
            const isSaved = profile.savedSessionIds.includes(session.id);
            return (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {session.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {session.time}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5" />
                      {walkTimeMinutes} min walk ({location.name})
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {session.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {session.description}
                  </p>

                  {/* Explainable match reasons badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {matchReasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleSaveSession(session.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isSaved
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-800'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleNavigate(location.id)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                  >
                    <span>Route to Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
