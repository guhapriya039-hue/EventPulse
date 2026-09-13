import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { OrganizerTab, SeverityLevel, EmergencyRequest } from '../../types';
import {
  Shield,
  Users,
  Bell,
  AlertTriangle,
  Calendar,
  Layers,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  MapPin,
  MoveRight,
  Send,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const OrganizerControlCenter: React.FC = () => {
  const {
    organizerTab,
    setOrganizerTab,
    zones,
    sessions,
    announcements,
    emergencyRequests,
    updateZoneCrowd,
    publishAnnouncement,
    acknowledgeEmergency,
    resolveEmergency,
    relocateSession,
    updateSessionStatus,
  } = useEvent();

  // Announcement composer form state
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('warning');
  const [newTarget, setNewTarget] = useState('Everyone');
  const [newAffectedZoneId, setNewAffectedZoneId] = useState<string>('');

  // Quick stats
  const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const venueAverageCrowd = Math.round((totalOccupancy / totalCapacity) * 100);

  const pendingEmergencies = emergencyRequests.filter((r) => r.status === 'Pending');
  const highCrowdZones = zones.filter((z) => z.crowdLevel >= 75);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    publishAnnouncement(
      newTitle,
      newMessage,
      newSeverity,
      newTarget,
      newAffectedZoneId || undefined
    );

    setNewTitle('');
    setNewMessage('');
    setNewAffectedZoneId('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Control Center Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Operations Command & Dispatch</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            FutureTech 2026 Organizer Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time venue telemetry, emergency response routing, broadcast dispatch, and session relocation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Venue Density</span>
            <span className="text-xl font-black text-emerald-400">{venueAverageCrowd}% Occupancy</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* Organizer Navigation Subtabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview' as OrganizerTab, label: 'Overview', icon: Shield, badge: null },
          { id: 'crowd' as OrganizerTab, label: 'Crowd Monitor', icon: Users, badge: highCrowdZones.length > 0 ? `${highCrowdZones.length} high` : null },
          { id: 'announcements' as OrganizerTab, label: 'Announcements', icon: Bell, badge: announcements.length },
          { id: 'emergency' as OrganizerTab, label: 'Emergency Requests', icon: AlertTriangle, badge: pendingEmergencies.length > 0 ? `${pendingEmergencies.length} pending` : null },
          { id: 'sessions' as OrganizerTab, label: 'Sessions & Relocation', icon: Calendar, badge: null },
          { id: 'zones' as OrganizerTab, label: 'Venue Zones & Simulation', icon: Layers, badge: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = organizerTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setOrganizerTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {organizerTab === 'overview' && (
        <div className="space-y-5">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Venue Occupancy
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalOccupancy.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {totalCapacity.toLocaleString()}</span>
              </div>
              <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Operating within safe limits</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Bottleneck / High Density Areas
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {highCrowdZones.length} Zones
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {highCrowdZones.map((z) => z.name).join(', ') || 'No critical bottlenecks'}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Emergency Inquiries
              </span>
              <div className={`text-2xl font-black mt-1 ${pendingEmergencies.length > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                {pendingEmergencies.length} Pending
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Average responder dispatch: <strong>~2.4 min</strong>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Broadcast Announcements
              </span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {announcements.length} Sent
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Delivered across all connected attendee apps
              </div>
            </div>
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Live Incidents Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Recent Emergency Queue</span>
                </h3>
                <button
                  onClick={() => setOrganizerTab('emergency')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View All ({emergencyRequests.length})
                </button>
              </div>

              <div className="space-y-2">
                {emergencyRequests.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Pending' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {req.status}
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{req.type}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Location: <strong>{req.locationName}</strong> • {req.reportedAt}
                      </p>
                    </div>

                    {req.status === 'Pending' && (
                      <button
                        onClick={() => acknowledgeEmergency(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Broadcast Console */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span>Quick Incident Broadcast</span>
                </h3>
                <span className="text-[11px] text-slate-400">Pushes instantly to attendee screens</span>
              </div>

              <form onSubmit={handlePublish} className="space-y-3 text-xs">
                <div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Alert Headline (e.g., Keynote Overflow in Hall B Active)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Broadcast message details..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Announcement</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. CROWD MONITOR & 6. SIMULATION */}
      {(organizerTab === 'crowd' || organizerTab === 'zones') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Venue Crowd Density & Real-Time Simulation Controls</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust sliders below to simulate surge spikes or crowd dispersal. Attendee routing algorithms will recalculate immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone) => {
              const isHigh = zone.crowdLevel >= 75;
              const isMod = zone.crowdLevel >= 40 && zone.crowdLevel < 75;

              return (
                <div
                  key={zone.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {zone.code} • {zone.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {zone.name}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : isMod
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {zone.crowdLevel}% ({zone.crowdStatus})
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Occupancy: <strong>{zone.currentOccupancy}</strong> / {zone.capacity} persons
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Empty (0%)</span>
                      <span>Capacity (100%)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={zone.crowdLevel}
                      onChange={(e) => updateZoneCrowd(zone.id, parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => updateZoneCrowd(zone.id, 25)}
                      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                    >
                      Low (25%)
                    </button>
                    <button
                      onClick={() => updateZoneCrowd(zone.id, 60)}
                      className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                    >
                      Moderate (60%)
                    </button>
                    <button
                      onClick={() => updateZoneCrowd(zone.id, 92)}
                      className="px-2 py-1 rounded bg-rose-100 dark:bg-rose-900/60 text-[10px] font-bold text-rose-800 dark:text-rose-200 hover:bg-rose-200"
                    >
                      Surge (92%)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. ANNOUNCEMENTS COMPOSER & LOG */}
      {organizerTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Composer (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Broadcast New Announcement</span>
            </h3>

            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Keynote Overflow in Hall B Active"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Message Content
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Clear instructions for attendees..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as SeverityLevel)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="urgent">Urgent (Red Alert)</option>
                    <option value="warning">Warning (Amber Alert)</option>
                    <option value="info">Info (Blue Update)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Hall A Attendees">Hall A Attendees</option>
                    <option value="Hall B Attendees">Hall B Attendees</option>
                    <option value="Speakers & VIP">Speakers & VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Optional Affected Zone Link
                </label>
                <select
                  value={newAffectedZoneId}
                  onChange={(e) => setNewAffectedZoneId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="">None (General alert)</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publish Real-Time Broadcast</span>
              </button>
            </form>
          </div>

          {/* Announcement Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Active Broadcast Stream ({announcements.length})
            </h3>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ann.severity === 'urgent' ? 'bg-rose-600 text-white' : ann.severity === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {ann.severity}
                  </span>
                  <span className="text-xs text-slate-400">{ann.timestamp}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ann.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{ann.message}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Target: <strong>{ann.target}</strong> • Author: {ann.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. EMERGENCY REQUESTS DISPATCH */}
      {organizerTab === 'emergency' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>On-Site Emergency Incident Dispatch Queue</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time attendee SOS dispatches mapped to venue coordinates and marshal teams
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              {pendingEmergencies.length} Active Inquiries
            </span>
          </div>

          <div className="space-y-3">
            {emergencyRequests.map((req) => {
              const isPending = req.status === 'Pending';
              const isAck = req.status === 'Acknowledged';

              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending
                      ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isAck
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{req.id}
                        </span>
                        <span className="text-xs text-slate-500">• {req.reportedAt}</span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {req.type} at {req.locationName}
                      </h4>

                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {req.notes}
                      </p>

                      {req.assignedResponder && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                          Assigned Dispatcher: {req.assignedResponder}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                      {isPending && (
                        <button
                          onClick={() => acknowledgeEmergency(req.id, 'Floor Marshal Alpha (Unit 4)')}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                        >
                          Acknowledge & Dispatch
                        </button>
                      )}
                      {isAck && (
                        <button
                          onClick={() => resolveEmergency(req.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. SESSIONS & RELOCATION */}
      {organizerTab === 'sessions' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Session Relocation & Overflow Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Move sessions between stages or trigger status overrides. Automated announcement broadcasts to all attendees immediately.
            </p>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => {
              const currentZone = zones.find((z) => z.id === session.locationId);

              return (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {session.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {session.time}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {session.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      Speaker: <strong>{session.speaker.name}</strong> • Current Venue: <strong className="text-indigo-600 dark:text-indigo-400">{currentZone?.name}</strong>
                    </p>
                  </div>

                  {/* Relocate room selector */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Relocate Room</span>
                      <select
                        value={session.locationId}
                        onChange={(e) => relocateSession(session.id, e.target.value)}
                        className="mt-0.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-900 dark:text-white"
                      >
                        {zones.filter((z) => z.category === 'Stage' || z.category === 'Workshop').map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.name} ({z.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
