import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { SeverityLevel } from '../../types';
import {
  Bell,
  AlertTriangle,
  Info,
  ShieldAlert,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const LiveUpdatesView: React.FC = () => {
  const {
    announcements,
    markAnnouncementsAsRead,
    setDestinationZoneId,
    setActiveTab,
    zones,
  } = useEvent();

  const [filterSeverity, setFilterSeverity] = useState<'all' | SeverityLevel>('all');

  // Mark all announcements read when opening the page
  React.useEffect(() => {
    markAnnouncementsAsRead();
  }, [markAnnouncementsAsRead]);

  const filteredAnnouncements = announcements.filter((ann) => {
    if (filterSeverity === 'all') return true;
    return ann.severity === filterSeverity;
  });

  const handleRouteToAffectedZone = (zoneId?: string) => {
    if (zoneId) {
      setDestinationZoneId(zoneId);
      setActiveTab('map');
    }
  };

  const getSeverityStyle = (severity: SeverityLevel) => {
    switch (severity) {
      case 'urgent':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: AlertTriangle,
          iconColor: 'text-rose-600',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
          badge: 'bg-amber-500 text-white',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
          badge: 'bg-blue-600 text-white',
          icon: Info,
          iconColor: 'text-blue-600',
        };
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>Live Venue Announcements & Incident Broadcasts</span>
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time schedule changes, room relocations, crowd overflow alerts, and safety notices
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {(['all', 'urgent', 'warning', 'info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filterSeverity === sev
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No active alerts in this category</p>
            <p className="text-xs text-slate-400 mt-1">All event operations and session tracks are running smoothly.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const style = getSeverityStyle(ann.severity);
            const Icon = style.icon;
            const affectedZone = zones.find((z) => z.id === ann.affectedZoneId);

            return (
              <div
                key={ann.id}
                className={`p-5 rounded-2xl border transition-all ${style.bg} shadow-2xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Icon className={`w-5 h-5 ${style.iconColor}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                          {ann.severity}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {ann.timestamp}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Audience: <strong className="text-slate-700 dark:text-slate-300">{ann.target}</strong>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {ann.title}
                      </h3>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {ann.message}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>Issued by: <strong>{ann.author}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Route to Affected Zone button */}
                  {ann.affectedZoneId && (
                    <button
                      onClick={() => handleRouteToAffectedZone(ann.affectedZoneId)}
                      className="shrink-0 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:border-indigo-500 flex items-center gap-1.5 transition-colors self-start shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Route to {affectedZone?.name ?? 'Venue'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
