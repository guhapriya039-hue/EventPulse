import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import {
  Sparkles,
  TrendingUp,
  Bell,
  AlertTriangle,
  MoveRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const JudgeDemoBar: React.FC = () => {
  const {
    updateZoneCrowd,
    publishAnnouncement,
    relocateSession,
    createEmergencyRequest,
    resetToSeedData,
    zones,
  } = useEvent();

  const [isExpanded, setIsExpanded] = useState(false);

  // Quick 1-click trigger handlers
  const handleSimulateSurge = () => {
    updateZoneCrowd('zone-main-stage', 96);
    updateZoneCrowd('zone-hall-a', 90);
    updateZoneCrowd('zone-food-court-a', 88);
  };

  const handleSimulateClear = () => {
    updateZoneCrowd('zone-main-stage', 40);
    updateZoneCrowd('zone-hall-a', 25);
    updateZoneCrowd('zone-food-court-a', 30);
  };

  const handlePushAnnouncement = () => {
    publishAnnouncement(
      'Keynote Overflow in Hall B Active',
      'Main Stage has reached capacity. Live high-definition stream is broadcasting with interactive Q&A in Hall B.',
      'urgent',
      'Everyone',
      'zone-hall-b'
    );
  };

  const handleRelocateSession = () => {
    relocateSession('sess-gen-ai-ws', 'zone-hall-c');
  };

  const handleTriggerSOS = () => {
    createEmergencyRequest('Medical Assistance', 'zone-hall-a', 'Attendee feeling faint near Hall A East Door. Demo simulation.');
  };

  return (
    <div className="bg-slate-900/90 text-slate-300 text-xs border-b border-slate-800 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">Judge Demo Shortcuts</span>
          <span className="hidden md:inline text-slate-400">
            • Live sync between Attendee & Organizer state
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300"
          >
            <span>{isExpanded ? 'Hide Controls' : 'Show Controls'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateSurge}
              className="px-2.5 py-1 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 flex items-center gap-1.5 transition-colors text-[11px] font-semibold"
            >
              <TrendingUp className="w-3 h-3 text-rose-400" />
              <span>Simulate Crowd Surge (Hall A & Stage)</span>
            </button>

            <button
              onClick={handleSimulateClear}
              className="px-2.5 py-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5 transition-colors text-[11px] font-semibold"
            >
              <TrendingUp className="w-3 h-3 text-emerald-400 rotate-180" />
              <span>Clear Bottlenecks</span>
            </button>

            <button
              onClick={handlePushAnnouncement}
              className="px-2.5 py-1 rounded-lg bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 flex items-center gap-1.5 transition-colors text-[11px] font-semibold"
            >
              <Bell className="w-3 h-3 text-amber-400" />
              <span>Broadcast Live Update</span>
            </button>

            <button
              onClick={handleRelocateSession}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60 flex items-center gap-1.5 transition-colors text-[11px] font-semibold"
            >
              <MoveRight className="w-3 h-3 text-blue-400" />
              <span>Move AI Workshop to Hall C</span>
            </button>

            <button
              onClick={handleTriggerSOS}
              className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white flex items-center gap-1.5 transition-colors text-[11px] font-bold"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Simulate SOS Request</span>
            </button>

            <button
              onClick={resetToSeedData}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-[11px] flex items-center gap-1 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
