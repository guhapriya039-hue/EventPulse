import React, { useState, useMemo } from 'react';
import { useEvent } from '../../context/EventContext';
import { RouteOption, RouteType } from '../../types';
import {
  MapPin,
  Compass,
  Layers,
  Sparkles,
  Footprints,
  ArrowUpCircle,
  AlertTriangle,
  Info,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  Coffee,
  HeartPulse,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const SmartMap: React.FC = () => {
  const {
    zones,
    profile,
    destinationZoneId,
    setDestinationZoneId,
    selectedRouteType,
    setSelectedRouteType,
    computedRoutes,
    updateAccessibilitySettings,
    setCurrentLocation,
    setIsSOSModalOpen,
  } = useEvent();

  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Currently selected destination zone
  const targetZone = zones.find((z) => z.id === destinationZoneId) ?? zones.find((z) => z.id === 'zone-hall-b')!;
  const currentStartZone = zones.find((z) => z.id === profile.currentLocationId) ?? zones[0];

  // Currently selected route details
  const activeRoute = computedRoutes.find((r) => r.type === selectedRouteType) ?? computedRoutes[0];

  // SVG coordinate path generator for the active route
  const svgPathData = useMemo(() => {
    if (!activeRoute || !activeRoute.pathPoints || activeRoute.pathPoints.length < 2) return '';
    const pts = activeRoute.pathPoints;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  }, [activeRoute]);

  const handleZoneClick = (zoneId: string) => {
    setDestinationZoneId(zoneId);
  };

  const getZoneFillColor = (zone: typeof zones[0]) => {
    if (zone.crowdLevel >= 75) return '#f43f5e'; // red
    if (zone.crowdLevel >= 40) return '#f59e0b'; // amber
    return '#10b981'; // emerald
  };

  const getZoneDimensions = (zone: typeof zones[0]) => {
    if (zone.coordinates.width && zone.coordinates.height) {
      return { width: zone.coordinates.width, height: zone.coordinates.height };
    }
    if (zone.id === 'zone-main-stage') return { width: 140, height: 90 };
    if (zone.category === 'Stage' || zone.category === 'Hall') return { width: 116, height: 74 };
    if (zone.category === 'Dining') return { width: 106, height: 68 };
    if (zone.category === 'Restroom') return { width: 94, height: 58 };
    if (zone.category === 'Service') return { width: 96, height: 58 };
    return { width: 92, height: 56 };
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Routing Header & Destination Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Origin */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  FROM (Detected Position)
                </span>
                <select
                  value={profile.currentLocationId}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-900 dark:text-white w-full focus:outline-hidden cursor-pointer"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id} className="text-slate-900 bg-white dark:bg-slate-900">
                      {z.name} ({z.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  TO (Target Destination)
                </span>
                <select
                  value={destinationZoneId ?? ''}
                  onChange={(e) => setDestinationZoneId(e.target.value)}
                  className="bg-transparent font-bold text-xs text-indigo-950 dark:text-indigo-100 w-full focus:outline-hidden cursor-pointer"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id} className="text-slate-900 bg-white dark:bg-slate-900">
                      {z.name} — {z.crowdStatus} ({z.crowdLevel}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Step-Free / Avoid Stairs Toggle */}
          <div className="flex items-center gap-3">
            <label
              id="map-avoid-stairs-toggle"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                profile.accessibilitySettings.avoidStairs
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={profile.accessibilitySettings.avoidStairs}
                onChange={(e) => updateAccessibilitySettings({ avoidStairs: e.target.checked })}
                className="sr-only"
              />
              <Eye className="w-4 h-4" />
              <span className="text-xs font-bold whitespace-nowrap">
                Avoid Stairs {profile.accessibilitySettings.avoidStairs ? 'ON' : 'OFF'}
              </span>
              {profile.accessibilitySettings.avoidStairs && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              )}
            </label>
          </div>
        </div>

        {/* THREE ROUTE CARDS: Fastest, Smart, Accessible */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Computed Path Options
            </span>
            {activeRoute?.isRecommended && (
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {activeRoute.recommendationReason}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {computedRoutes.map((route) => {
              const isSelected = route.type === selectedRouteType;
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteType(route.type)}
                  id={`route-card-${route.type}`}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/40 dark:bg-slate-800/30'
                  }`}
                >
                  {route.isRecommended && (
                    <span className="absolute -top-2.5 right-3 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                      Recommended
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-slate-600 dark:text-slate-300">
                      {route.name}
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {route.durationMinutes} min
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {route.type === 'smart' && (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {route.crowdAvoidancePercent}% less crowded
                      </span>
                    )}
                    {route.type === 'fastest' && (
                      <span className={`font-semibold ${route.crowdDensityPercent > 60 ? 'text-rose-600' : 'text-amber-600'}`}>
                        {route.crowdDensityPercent > 60 ? 'High crowd exposure' : 'Direct hallway'}
                      </span>
                    )}
                    {route.type === 'accessible' && (
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        No stairs • Step-free
                      </span>
                    )}
                    <span className="text-slate-400">• {route.distanceMeters}m</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Interactive Venue Floorplan (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Map Controls Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Floor Level:</span>
              <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveFloor(1)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    activeFloor === 1
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Level 1 (Main Concourse)
                </button>
                <button
                  onClick={() => setActiveFloor(2)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    activeFloor === 2
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Level 2 (Mezzanine)
                </button>
              </div>
            </div>

            {/* Density Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Low (&lt;40%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Moderate (40-75%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>High (&gt;75%)</span>
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative aspect-16/10 w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800">
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-full select-none"
              aria-label="Interactive Venue Floor Plan"
            >
              <defs>
                {/* Corridor grid pattern */}
                <pattern id="venueGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                {/* Glowing path filter */}
                <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.8" />
                </filter>
              </defs>

              <rect width="1000" height="600" fill="#0f172a" />
              <rect width="1000" height="600" fill="url(#venueGrid)" opacity="0.6" />

              {/* Hallway Walkway Corridors */}
              <g stroke="#334155" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.65">
                {/* Main concourses */}
                <path d="M 120 520 L 220 430 L 440 420 L 680 430 L 740 520" />
                <path d="M 440 420 L 440 360 L 450 250 L 450 150" />
                <path d="M 220 430 L 190 320 L 260 260 L 450 190 L 620 260 L 790 260 L 680 430" />
                {/* East & West Quiet Bypasses */}
                <path d="M 80 460 L 140 380 L 190 320" />
                <path d="M 680 430 L 720 340 L 790 260" />
                {/* Accessible Ramp & Elevator connectors */}
                <path d="M 260 260 L 380 220 L 450 190" stroke="#0ea5e9" strokeWidth="18" strokeDasharray="6 4" />
                <path d="M 550 320 L 500 220 L 450 190" stroke="#0ea5e9" strokeWidth="18" strokeDasharray="6 4" />
              </g>

              {/* STAIRCASE INDICATORS (Monumental Central Stairs) */}
              <g transform="translate(435, 235)">
                <rect width="30" height="24" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                <line x1="5" y1="6" x2="25" y2="6" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="5" y1="12" x2="25" y2="12" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="5" y1="18" x2="25" y2="18" stroke="#e2e8f0" strokeWidth="2" />
              </g>

              {/* ACTIVE ROUTE LINE */}
              {svgPathData && (
                <>
                  {/* Outer glow line */}
                  <path
                    d={svgPathData}
                    fill="none"
                    stroke={selectedRouteType === 'accessible' ? '#06b6d4' : selectedRouteType === 'smart' ? '#10b981' : '#6366f1'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                  />
                  {/* Main animated dashed path */}
                  <path
                    d={svgPathData}
                    fill="none"
                    stroke={selectedRouteType === 'accessible' ? '#22d3ee' : selectedRouteType === 'smart' ? '#34d399' : '#818cf8'}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="8 6"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                </>
              )}

              {/* VENUE ZONES (Interactive SVG Polygons/Rectangles) */}
              {zones.map((zone) => {
                const isTarget = zone.id === destinationZoneId;
                const isCurrent = zone.id === profile.currentLocationId;
                const isHovered = zone.id === hoveredZoneId;
                const fillColor = getZoneFillColor(zone);
                const { width, height } = getZoneDimensions(zone);
                const left = zone.coordinates.x - width / 2;
                const top = zone.coordinates.y - height / 2;

                return (
                  <g
                    key={zone.id}
                    id={`svg-zone-${zone.id}`}
                    onClick={() => handleZoneClick(zone.id)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    className="cursor-pointer transition-transform"
                  >
                    {/* Zone background boundary */}
                    <rect
                      x={left}
                      y={top}
                      width={width}
                      height={height}
                      rx="12"
                      fill={isTarget ? '#1e1b4b' : '#1e293b'}
                      stroke={isTarget ? '#818cf8' : isHovered ? '#94a3b8' : '#334155'}
                      strokeWidth={isTarget ? 3.5 : 1.5}
                      opacity={0.92}
                    />

                    {/* Crowd density indicator pill in top-right of room */}
                    <rect
                      x={left + width - 42}
                      y={top + 6}
                      width="36"
                      height="16"
                      rx="4"
                      fill={fillColor}
                      opacity="0.95"
                    />
                    <text
                      x={left + width - 24}
                      y={top + 18}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {zone.crowdLevel}%
                    </text>

                    {/* Zone Name Label */}
                    <text
                      x={zone.coordinates.x}
                      y={zone.coordinates.y - 2}
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {zone.name}
                    </text>

                    {/* Zone Code / Facility Subtitle */}
                    <text
                      x={zone.coordinates.x}
                      y={zone.coordinates.y + 14}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {zone.code} • {zone.category}
                    </text>

                    {/* Accessibility icon badges */}
                    {zone.accessibility.hasRamp && (
                      <circle
                        cx={left + 14}
                        cy={top + 14}
                        r="6"
                        fill="#0284c7"
                      />
                    )}
                  </g>
                );
              })}

              {/* ORIGIN PIN (You Are Here) */}
              <g transform={`translate(${currentStartZone?.coordinates?.x ?? 120}, ${currentStartZone?.coordinates?.y ?? 520})`}>
                <circle r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
                <circle r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <text y="24" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                  YOU (Here)
                </text>
              </g>

              {/* DESTINATION PIN */}
              {targetZone && (
                <g transform={`translate(${targetZone.coordinates?.x ?? 220}, ${(targetZone.coordinates?.y ?? 430) - 20})`}>
                  <circle r="12" fill="#6366f1" opacity="0.4" className="animate-pulse" />
                  <path
                    d="M 0 -16 C -7 -16 -12 -11 -12 -4 C -12 6 0 16 0 16 C 0 16 12 6 12 -4 C 12 -11 7 -16 0 -16 Z"
                    fill="#6366f1"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cy="-4" r="4" fill="#ffffff" />
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Tip: Click any zone directly on the map to set destination or view accessibility features</span>
            <button
              onClick={() => setIsSOSModalOpen(true)}
              className="text-rose-600 font-bold hover:underline flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Emergency SOS
            </button>
          </div>
        </div>

        {/* Selected Destination Details & Step Instructions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Zone Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {targetZone.category} • {targetZone.code}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {targetZone.name}
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  targetZone.crowdLevel >= 75
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                    : targetZone.crowdLevel >= 40
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                }`}
              >
                {targetZone.crowdLevel}% Crowd ({targetZone.crowdStatus})
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {targetZone.description}
            </p>

            {/* Accessibility Features Checklist */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Accessibility Features
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Check className={`w-3.5 h-3.5 ${targetZone.accessibility.hasRamp ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>{targetZone.accessibility.hasRamp ? 'Ramp Access' : 'No Direct Ramp'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Check className={`w-3.5 h-3.5 ${targetZone.accessibility.hasElevator ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>{targetZone.accessibility.hasElevator ? 'Elevator Nearby' : 'Ground Floor'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Check className={`w-3.5 h-3.5 ${targetZone.accessibility.hearingLoop ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>{targetZone.accessibility.hearingLoop ? 'Hearing Loop' : 'Standard Audio'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Check className={`w-3.5 h-3.5 ${targetZone.accessibility.wheelchairSeating ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Reserved Seating</span>
                </div>
              </div>
            </div>

            {/* Step by step turn directions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Step-by-Step Directions
              </span>
              <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 max-h-48 overflow-y-auto pr-1">
                {activeRoute?.stepInstructions?.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-slate-700 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
