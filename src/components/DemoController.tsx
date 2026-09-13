import React from 'react';
import { useEvent } from '../context/EventContext';
import {
  Flame,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  X,
  Play,
  Sparkles,
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Attendee at Main Entrance',
    desc: 'Attendee checks into FutureTech 2026. Current location set to Main Entrance with live dashboard metrics.',
    role: 'Attendee',
  },
  {
    step: 2,
    title: 'Select Destination: Hall B',
    desc: 'Attendee clicks “NAVIGATE ME” to Generative AI Workshop in Hall B.',
    role: 'Attendee',
  },
  {
    step: 3,
    title: 'Congestion Detected at Hall A',
    desc: 'Crowd sensing detects 88% bottleneck along traditional west concourse and Hall A.',
    role: 'System',
  },
  {
    step: 4,
    title: 'Smart Route Recommendation',
    desc: 'System recommends Smart Route bypass (32% less crowded) avoiding congested bottlenecks.',
    role: 'System',
  },
  {
    step: 5,
    title: 'Activate "Avoid Stairs"',
    desc: 'Attendee toggles Accessibility Mode with Avoid Stairs = ON.',
    role: 'Attendee',
  },
  {
    step: 6,
    title: 'Accessible Route Auto-Active',
    desc: 'Navigation switches to 100% step-free Accessible Route using Atrium Ramp and Elevator Bank.',
    role: 'System',
  },
  {
    step: 7,
    title: 'Context-Aware AI Assistant',
    desc: 'Attendee queries EventPulse AI: “I have 30 minutes. What should I attend?”. Structured card generated.',
    role: 'Attendee',
  },
  {
    step: 8,
    title: 'Organizer Relocates Session',
    desc: 'Organizer control center detects capacity limit and moves Generative AI Workshop from Hall B to Hall C.',
    role: 'Organizer',
  },
  {
    step: 9,
    title: 'Live Real-Time Update Broadcast',
    desc: 'Attendee instantly receives emergency warning update without page refresh.',
    role: 'Attendee',
  },
  {
    step: 10,
    title: 'Attendee Triggers SOS',
    desc: 'Attendee clicks Emergency SOS for Medical Assistance with auto-located coordinates.',
    role: 'Attendee',
  },
  {
    step: 11,
    title: 'Organizer Acknowledges Emergency',
    desc: 'Emergency request arrives in Organizer Control Center with 1-click Acknowledge & Dispatch.',
    role: 'Organizer',
  },
];

export const DemoController: React.FC = () => {
  const {
    isDemoScenarioActive,
    setIsDemoScenarioActive,
    demoStep,
    executeDemoStep,
    resetToSeedData,
  } = useEvent();

  if (!isDemoScenarioActive) return null;

  const currentStepData = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];

  const handleNext = () => {
    if (demoStep < DEMO_STEPS.length) {
      executeDemoStep(demoStep + 1);
    }
  };

  const handlePrev = () => {
    if (demoStep > 1) {
      executeDemoStep(demoStep - 1);
    }
  };

  return (
    <div
      role="region"
      aria-label="2-Minute Hackathon Demo Runner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-amber-500/40 p-4 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
            2-Minute Demo Scenario
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Step {demoStep} / {DEMO_STEPS.length}
          </span>
          <button
            onClick={() => setIsDemoScenarioActive(false)}
            aria-label="Close demo guide"
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1 rounded-full my-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${(demoStep / DEMO_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Info */}
      <div className="space-y-1.5 py-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
            {currentStepData.role}
          </span>
          <h4 className="font-bold text-sm text-white">{currentStepData.title}</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{currentStepData.desc}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800">
        <button
          onClick={resetToSeedData}
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          title="Reset to initial state"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={demoStep === 1}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={demoStep === DEMO_STEPS.length}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all disabled:opacity-40"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
