import React from 'react';
import { useEvent } from '../context/EventContext';
import {
  X,
  Eye,
  Sliders,
  Sparkles,
  Footprints,
  Compass,
  ArrowUpCircle,
  HelpCircle,
  Check,
} from 'lucide-react';

export const AccessibilityModal: React.FC = () => {
  const {
    isAccessibilityModalOpen,
    setIsAccessibilityModalOpen,
    profile,
    updateAccessibilitySettings,
  } = useEvent();

  if (!isAccessibilityModalOpen) return null;

  const settings = profile.accessibilitySettings;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="acc-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="acc-dialog-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Accessibility Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize routing, display contrast, and mobility assistance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAccessibilityModalOpen(false)}
            aria-label="Close accessibility modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Mobility & Routing Options (Directly alters routing algorithm) */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Mobility & Step-Free Routing
            </span>
            <p className="text-xs text-slate-500 mb-3">
              Activating these settings dynamically updates venue route pathfinding.
            </p>

            <div className="space-y-3">
              {/* Avoid Stairs */}
              <label
                id="acc-toggle-avoid-stairs"
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  settings.avoidStairs
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      Avoid Stairs
                      {settings.avoidStairs && (
                        <span className="text-[10px] uppercase font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-sm">
                          Active Impact
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Strictly eliminates stairwells from calculated paths. Routes via level floors, elevators, and certified ramps.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.avoidStairs}
                  onChange={(e) => updateAccessibilitySettings({ avoidStairs: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              {/* Prefer Elevators */}
              <label
                id="acc-toggle-prefer-elevator"
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  settings.preferElevator
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <ArrowUpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      Prefer Elevators
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Prioritizes high-speed accessible elevators with braille indicators for vertical transitions.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferElevator}
                  onChange={(e) => updateAccessibilitySettings({ preferElevator: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              {/* Prefer Ramps */}
              <label
                id="acc-toggle-prefer-ramps"
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  settings.preferRamps
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      Prefer Ramps (1:12 ADA Slope)
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Route via wide tactile-paved ramps with dual continuous handrails.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferRamps}
                  onChange={(e) => updateAccessibilitySettings({ preferRamps: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              {/* Accessible Restroom Finder */}
              <label
                id="acc-toggle-restroom"
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  settings.accessibleRestroomFinder
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      Accessible Restroom Highlight
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Surfaces nearest single-occupancy facilities with grab bars and emergency pull-cords across maps and "What's Next".
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.accessibleRestroomFinder}
                  onChange={(e) => updateAccessibilitySettings({ accessibleRestroomFinder: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Visual & Sensory Preferences */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Visual & Sensory Interface
            </span>
            <div className="space-y-3 mt-2">
              {/* Large Text */}
              <label
                id="acc-toggle-large-text"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Large Display Text (+25%)
                </span>
                <input
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={(e) => updateAccessibilitySettings({ largeText: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* High Contrast */}
              <label
                id="acc-toggle-high-contrast"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  High Contrast Mode (WCAG AAA)
                </span>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateAccessibilitySettings({ highContrast: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {/* Reduce Motion */}
              <label
                id="acc-toggle-reduce-motion"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Reduce Motion (Calm Transitions)
                </span>
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => updateAccessibilitySettings({ reduceMotion: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Live changes apply immediately
          </div>
          <button
            id="acc-save-btn"
            onClick={() => setIsAccessibilityModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Apply Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
