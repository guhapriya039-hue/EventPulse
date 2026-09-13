import React from 'react';
import {
  Compass,
  Users,
  Eye,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ProblemAlignmentView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Problem Statement Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Hackathon Evaluation Alignment</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          How EventPulse Solves the Problem Statement
        </h1>

        <blockquote className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-indigo-600 text-slate-700 dark:text-slate-300 text-sm italic leading-relaxed">
          “Large events have confusing navigation, overcrowding, limited accessibility, delayed announcements, and difficulty accessing emergency support. Attendees struggle to find stages, workshops, food courts, restrooms, help desks, and important updates.
          Build a web-based Smart Event Experience platform to make events organized, accessible, safe, and engaging.”
        </blockquote>
      </div>

      {/* 5 Core Pillars Mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Confusing Navigation */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Pillar 1</span>
            <span className="text-xs text-slate-400">• Navigation</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Overcoming Confusing Event Venues
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Convention centers span hundreds of thousands of square feet. Traditional static maps lack positioning context.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Interactive SVG Floor Plan</strong> with coordinate-accurate room nodes and corridor waypoints.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Dijkstra Pathfinding</strong> with animated turn-by-turn routing between all major amenities.</span>
            </div>
          </div>
        </div>

        {/* 2. Overcrowding & Bottlenecks */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pillar 2</span>
            <span className="text-xs text-slate-400">• Congestion</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Real-Time Crowd Balancing & Detours
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Attendees all flock to the same narrow corridors and food courts at the same time, causing dangerous crush loads.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Smart Route Calculation:</strong> Penalizes congested corridors and diverts foot traffic via quiet bypasses (up to 32% less crowded).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Live Density Telemetry:</strong> Visual crowd pills and "Avoid right now" bottleneck warnings.</span>
            </div>
          </div>
        </div>

        {/* 3. Limited Accessibility */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Pillar 3</span>
            <span className="text-xs text-slate-400">• Accessibility</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            First-Class Step-Free & Sensory Access
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Wheelchair users, attendees with strollers, and attendees with sensory or mobility challenges are frequently stranded by unexpected stairs.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Functional Avoid Stairs Mode:</strong> Mathematically eliminates stairs from the graph, prioritizing ADA ramps and elevators.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Dedicated Facilities:</strong> Highlights single-occupancy accessible restrooms with emergency cords and hearing loops.</span>
            </div>
          </div>
        </div>

        {/* 4. Delayed Announcements */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Pillar 4</span>
            <span className="text-xs text-slate-400">• Communications</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Instant Real-Time Incident & Schedule Sync
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Room changes, overflow broadcasts, and emergency updates are often communicated via static printouts or delayed social posts.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Unified State Fabric:</strong> An announcement published in Organizer Control immediately updates attendee screens.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>1-Click Navigation:</strong> Announcements link directly to affected rooms with recalculating routes.</span>
            </div>
          </div>
        </div>

        {/* 5. Difficulty Accessing Emergency Support */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 md:col-span-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Pillar 5</span>
            <span className="text-xs text-slate-400">• Safety & Incident Response</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            One-Tap SOS Dispatch to Event Marshals
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            In crowded convention halls, attendees experiencing medical distress or security hazards struggle to explain their exact location to dispatchers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-200 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Auto-Positioning:</strong> Transmits detected zone coordinates, category, and distance to nearest First Aid & Security.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Instant Organizer Intake:</strong> Operations dashboard displays incident priority with 1-click Acknowledge & Dispatch.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
