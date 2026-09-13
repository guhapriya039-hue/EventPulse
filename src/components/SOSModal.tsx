import React, { useState } from 'react';
import { useEvent } from '../context/EventContext';
import { EmergencyType } from '../types';
import {
  AlertTriangle,
  X,
  HeartPulse,
  ShieldAlert,
  UserCheck,
  HelpCircle,
  MapPin,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const {
    isSOSModalOpen,
    setIsSOSModalOpen,
    profile,
    zones,
    createEmergencyRequest,
    setRole,
    setOrganizerTab,
  } = useEvent();

  const [selectedType, setSelectedType] = useState<EmergencyType>('Medical Assistance');
  const [notes, setNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isSOSModalOpen) return null;

  const currentZone = zones.find((z) => z.id === profile.currentLocationId) ?? zones[0];

  // Nearest First Aid & Security calculations
  const firstAidZone = zones.find((z) => z.id === 'zone-first-aid')!;
  const securityZone = zones.find((z) => z.id === 'zone-security')!;

  const dxAid = firstAidZone.coordinates.x - currentZone.coordinates.x;
  const dyAid = firstAidZone.coordinates.y - currentZone.coordinates.y;
  const distAid = Math.max(40, Math.round(Math.sqrt(dxAid * dxAid + dyAid * dyAid) * 1.5));

  const dxSec = securityZone.coordinates.x - currentZone.coordinates.x;
  const dySec = securityZone.coordinates.y - currentZone.coordinates.y;
  const distSec = Math.max(60, Math.round(Math.sqrt(dxSec * dxSec + dySec * dySec) * 1.5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = createEmergencyRequest(selectedType, currentZone.id, notes);
    setSubmittedId(newId);
  };

  const handleClose = () => {
    setIsSOSModalOpen(false);
    setSubmittedId(null);
    setNotes('');
  };

  const handleViewInOrganizer = () => {
    handleClose();
    setRole('organizer');
    setOrganizerTab('emergency');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/60 backdrop-blur-xs p-4 sm:p-6"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/40 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Prototype notice banner */}
        <div className="bg-rose-600 px-4 py-2 text-center text-white text-xs font-semibold flex items-center justify-center gap-2">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>PROTOTYPE SIMULATION – Does not dial real 911 / emergency services</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="sos-modal-title" className="text-xl font-extrabold text-slate-900 dark:text-white">
                Emergency Assistance Request
              </h2>
              <p className="text-xs text-slate-500">
                Direct dispatch to FutureTech 2026 On-Site Incident Marshals
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close emergency modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedId ? (
          /* Confirmation View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Assistance request sent to the event control dashboard
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Incident reference #{submittedId}. On-site floor marshals at {currentZone.name} have been alerted.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{currentZone.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ETA to Responder Arrival:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">~2 to 3 minutes</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleViewInOrganizer}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Inspect in Organizer Dashboard
              </button>
              <button
                onClick={handleClose}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          /* Input Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Current Area & Nearest Amenities */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Your Current Detected Location:
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{currentZone.name}</span>
              </div>
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Nearest First Aid:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">First Aid — {distAid}m</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nearest Security:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Security — {distSec}m</span>
                </div>
              </div>
            </div>

            {/* Assistance Categories */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">
                Select Assistance Needed
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { type: 'Medical Assistance' as EmergencyType, icon: HeartPulse, label: 'Medical Assistance', desc: 'First aid, heat exhaustion, injuries' },
                  { type: 'Security Assistance' as EmergencyType, icon: ShieldAlert, label: 'Security Assistance', desc: 'Safety concerns, crowd blockages' },
                  { type: 'Lost Person / Help' as EmergencyType, icon: UserCheck, label: 'Lost Person / Help', desc: 'Separated companions, child search' },
                  { type: 'General Assistance' as EmergencyType, icon: HelpCircle, label: 'General Assistance', desc: 'Mobility transfer, facilities breakdown' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setSelectedType(item.type)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Specific Details */}
            <div>
              <label htmlFor="sos-notes" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                Optional Notes (Specific seat, aisle, or symptoms)
              </label>
              <textarea
                id="sos-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Near row 12 by the stage ramp; attendee requires wheelchair assistance..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="sos-submit-button"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                Request Assistance
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
