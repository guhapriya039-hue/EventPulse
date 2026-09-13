import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  VenueZone,
  EventSession,
  Announcement,
  EmergencyRequest,
  AttendeeProfile,
  AccessibilitySettings,
  ActiveTab,
  OrganizerTab,
  SeverityLevel,
  EmergencyType,
  RouteOption,
} from '../types';
import {
  INITIAL_ZONES,
  INITIAL_SESSIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EMERGENCY_REQUESTS,
  DEFAULT_ATTENDEE_PROFILE,
  getCrowdStatus,
} from '../data/seedData';
import { computeRoutes } from '../features/navigation/routingEngine';

interface EventContextType {
  // Mode & Tabs
  role: 'attendee' | 'organizer';
  setRole: (role: 'attendee' | 'organizer') => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  organizerTab: OrganizerTab;
  setOrganizerTab: (tab: OrganizerTab) => void;

  // Shared Data State
  zones: VenueZone[];
  sessions: EventSession[];
  announcements: Announcement[];
  emergencyRequests: EmergencyRequest[];
  profile: AttendeeProfile;

  // Active Navigation State
  destinationZoneId: string | null;
  setDestinationZoneId: (id: string | null) => void;
  selectedRouteType: 'fastest' | 'smart' | 'accessible';
  setSelectedRouteType: (type: 'fastest' | 'smart' | 'accessible') => void;
  computedRoutes: RouteOption[];

  // Attendee Actions
  toggleSaveSession: (sessionId: string) => void;
  updateInterests: (interests: string[]) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  setCurrentLocation: (zoneId: string) => void;
  createEmergencyRequest: (type: EmergencyType, locationId: string, notes?: string) => string;

  // Organizer Actions
  updateZoneCrowd: (zoneId: string, crowdLevel: number) => void;
  publishAnnouncement: (title: string, message: string, severity: SeverityLevel, target?: string, affectedZoneId?: string) => void;
  acknowledgeEmergency: (id: string, responderName?: string) => void;
  resolveEmergency: (id: string) => void;
  relocateSession: (sessionId: string, newLocationId: string) => void;
  updateSessionStatus: (sessionId: string, status: EventSession['status']) => void;

  // Modals & UI Controls
  isAccessibilityModalOpen: boolean;
  setIsAccessibilityModalOpen: (open: boolean) => void;
  isSOSModalOpen: boolean;
  setIsSOSModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isDemoScenarioActive: boolean;
  setIsDemoScenarioActive: (active: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  executeDemoStep: (stepIndex: number) => void;
  resetToSeedData: () => void;

  // Unread counts & notifications
  unreadAnnouncementsCount: number;
  markAnnouncementsAsRead: () => void;
  latestAlert: Announcement | null;
  dismissLatestAlert: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = 'eventpulse_state_v1';

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [organizerTab, setOrganizerTab] = useState<OrganizerTab>('overview');

  // Core synchronized state
  const [zones, setZones] = useState<VenueZone[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_zones`);
      return saved ? JSON.parse(saved) : INITIAL_ZONES;
    } catch {
      return INITIAL_ZONES;
    }
  });

  const [sessions, setSessions] = useState<EventSession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_emergency`);
      return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_REQUESTS;
    } catch {
      return INITIAL_EMERGENCY_REQUESTS;
    }
  });

  const [profile, setProfile] = useState<AttendeeProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : DEFAULT_ATTENDEE_PROFILE;
    } catch {
      return DEFAULT_ATTENDEE_PROFILE;
    }
  });

  // Modals & Active route state
  const [destinationZoneId, setDestinationZoneId] = useState<string | null>('zone-hall-b');
  const [selectedRouteType, setSelectedRouteType] = useState<'fastest' | 'smart' | 'accessible'>('smart');

  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Demo step runner
  const [isDemoScenarioActive, setIsDemoScenarioActive] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  // Read announcements tracking
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>([]);
  const [latestAlert, setLatestAlert] = useState<Announcement | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_zones`, JSON.stringify(zones));
      localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(sessions));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
      localStorage.setItem(`${STORAGE_KEY}_emergency`, JSON.stringify(emergencyRequests));
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage persistence failed:', e);
    }
  }, [zones, sessions, announcements, emergencyRequests, profile]);

  // Handle accessibility mode CSS attributes on body/root for High Contrast and Large Text
  useEffect(() => {
    const root = document.documentElement;
    if (profile.accessibilitySettings.largeText) {
      root.classList.add('text-lg');
    } else {
      root.classList.remove('text-lg');
    }

    if (profile.accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (profile.accessibilitySettings.reduceMotion) {
      root.classList.add('motion-reduce');
    } else {
      root.classList.remove('motion-reduce');
    }
  }, [profile.accessibilitySettings]);

  // Compute live routes dynamically whenever destination, crowd levels, or accessibility changes
  const computedRoutes = useMemo(() => {
    if (!destinationZoneId) return [];
    return computeRoutes(
      profile.currentLocationId,
      destinationZoneId,
      zones,
      profile.accessibilitySettings
    );
  }, [destinationZoneId, profile.currentLocationId, zones, profile.accessibilitySettings]);

  // Auto-select recommended route whenever calculation updates
  useEffect(() => {
    if (computedRoutes.length > 0) {
      const rec = computedRoutes.find((r) => r.isRecommended);
      if (rec) {
        setSelectedRouteType(rec.type);
      }
    }
  }, [computedRoutes]);

  // Attendee Handlers
  const toggleSaveSession = useCallback((sessionId: string) => {
    setProfile((prev) => {
      const exists = prev.savedSessionIds.includes(sessionId);
      return {
        ...prev,
        savedSessionIds: exists
          ? prev.savedSessionIds.filter((id) => id !== sessionId)
          : [...prev.savedSessionIds, sessionId],
      };
    });
  }, []);

  const updateInterests = useCallback((interests: string[]) => {
    setProfile((prev) => ({ ...prev, interests }));
  }, []);

  const updateAccessibilitySettings = useCallback((settings: Partial<AccessibilitySettings>) => {
    setProfile((prev) => ({
      ...prev,
      accessibilitySettings: {
        ...prev.accessibilitySettings,
        ...settings,
      },
    }));
  }, []);

  const setCurrentLocation = useCallback((zoneId: string) => {
    setProfile((prev) => ({ ...prev, currentLocationId: zoneId }));
  }, []);

  const createEmergencyRequest = useCallback((type: EmergencyType, locationId: string, notes?: string) => {
    const zone = zones.find((z) => z.id === locationId);
    const locationName = zone ? zone.name : 'Unknown Location';
    const newReq: EmergencyRequest = {
      id: `sos-${Date.now().toString().slice(-6)}`,
      type,
      locationId,
      locationName,
      reportedAt: 'Just now',
      createdAt: Date.now(),
      status: 'Pending',
      notes: notes || 'Emergency assistance requested via EventPulse SOS one-tap.',
    };

    setEmergencyRequests((prev) => [newReq, ...prev]);
    return newReq.id;
  }, [zones]);

  // Organizer Handlers
  const updateZoneCrowd = useCallback((zoneId: string, newLevel: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const clamped = Math.max(0, Math.min(100, newLevel));
          return {
            ...z,
            crowdLevel: clamped,
            crowdStatus: getCrowdStatus(clamped),
            currentOccupancy: Math.round((clamped / 100) * z.capacity),
          };
        }
        return z;
      })
    );
  }, []);

  const publishAnnouncement = useCallback(
    (title: string, message: string, severity: SeverityLevel, target = 'Everyone', affectedZoneId?: string) => {
      const newAnn: Announcement = {
        id: `ann-${Date.now().toString().slice(-6)}`,
        title,
        message,
        severity,
        timestamp: 'Just now',
        createdAt: Date.now(),
        target,
        affectedZoneId,
        author: 'Organizer Operations Command',
      };

      setAnnouncements((prev) => [newAnn, ...prev]);
      setLatestAlert(newAnn);
    },
    []
  );

  const acknowledgeEmergency = useCallback((id: string, responderName = 'Operations Marshal Team') => {
    setEmergencyRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Acknowledged', assignedResponder: responderName } : req))
    );
  }, []);

  const resolveEmergency = useCallback((id: string) => {
    setEmergencyRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Resolved' } : req))
    );
  }, []);

  const relocateSession = useCallback((sessionId: string, newLocationId: string) => {
    const targetZone = zones.find((z) => z.id === newLocationId);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, locationId: newLocationId } : s))
    );

    // Auto-broadcast warning announcement
    const session = sessions.find((s) => s.id === sessionId);
    if (session && targetZone) {
      publishAnnouncement(
        `Session Relocation: ${session.title}`,
        `${session.title} has been moved to ${targetZone.name}. Navigation routes have updated.`,
        'warning',
        'Everyone',
        newLocationId
      );
    }
  }, [zones, sessions, publishAnnouncement]);

  const updateSessionStatus = useCallback((sessionId: string, status: EventSession['status']) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status } : s))
    );
  }, []);

  const unreadAnnouncementsCount = useMemo(() => {
    return announcements.filter((a) => !readAnnouncementIds.includes(a.id)).length;
  }, [announcements, readAnnouncementIds]);

  const markAnnouncementsAsRead = useCallback(() => {
    setReadAnnouncementIds(announcements.map((a) => a.id));
  }, [announcements]);

  const dismissLatestAlert = useCallback(() => {
    setLatestAlert(null);
  }, []);

  const resetToSeedData = useCallback(() => {
    setZones(INITIAL_ZONES);
    setSessions(INITIAL_SESSIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setEmergencyRequests(INITIAL_EMERGENCY_REQUESTS);
    setProfile(DEFAULT_ATTENDEE_PROFILE);
    setDestinationZoneId('zone-hall-b');
    setSelectedRouteType('smart');
    setDemoStep(1);
    setRole('attendee');
    setActiveTab('home');
    localStorage.clear();
  }, []);

  // Built-in 11-step hackathon demo scenario
  const executeDemoStep = useCallback((stepIndex: number) => {
    setDemoStep(stepIndex);
    switch (stepIndex) {
      case 1: // Attendee starts at Main Entrance
        setRole('attendee');
        setActiveTab('home');
        setCurrentLocation('zone-main-entrance');
        break;
      case 2: // Attendee selects: Generative AI Workshop
        setRole('attendee');
        setActiveTab('map');
        setDestinationZoneId('zone-hall-b');
        break;
      case 3: // System detects Hall A route = crowded
        updateZoneCrowd('zone-hall-a', 88);
        updateZoneCrowd('zone-main-stage', 94);
        break;
      case 4: // System recommends Smart Route (32% less crowded)
        setSelectedRouteType('smart');
        setActiveTab('map');
        break;
      case 5: // Turn on: Avoid Stairs
        updateAccessibilitySettings({ avoidStairs: true });
        break;
      case 6: // Route changes to: Accessible Route
        setSelectedRouteType('accessible');
        setActiveTab('map');
        break;
      case 7: // Ask AI: “I have 30 minutes. What should I attend?”
        setRole('attendee');
        setActiveTab('ai');
        break;
      case 8: // Organizer publishes: “Generative AI Workshop moved to Hall C.”
        setRole('organizer');
        setOrganizerTab('sessions');
        relocateSession('sess-gen-ai-ws', 'zone-hall-c');
        break;
      case 9: // Attendee receives update
        setRole('attendee');
        setActiveTab('updates');
        break;
      case 10: // Trigger SOS
        setRole('attendee');
        createEmergencyRequest('Medical Assistance', 'zone-hall-a', 'Attendee feeling faint near Hall A East Door. Demo simulation.');
        setIsSOSModalOpen(true);
        break;
      case 11: // Organizer receives request
        setIsSOSModalOpen(false);
        setRole('organizer');
        setOrganizerTab('emergency');
        break;
      default:
        break;
    }
  }, [setCurrentLocation, updateZoneCrowd, updateAccessibilitySettings, relocateSession, createEmergencyRequest]);

  return (
    <EventContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        organizerTab,
        setOrganizerTab,
        zones,
        sessions,
        announcements,
        emergencyRequests,
        profile,
        destinationZoneId,
        setDestinationZoneId,
        selectedRouteType,
        setSelectedRouteType,
        computedRoutes,
        toggleSaveSession,
        updateInterests,
        updateAccessibilitySettings,
        setCurrentLocation,
        createEmergencyRequest,
        updateZoneCrowd,
        publishAnnouncement,
        acknowledgeEmergency,
        resolveEmergency,
        relocateSession,
        updateSessionStatus,
        isAccessibilityModalOpen,
        setIsAccessibilityModalOpen,
        isSOSModalOpen,
        setIsSOSModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isDemoScenarioActive,
        setIsDemoScenarioActive,
        demoStep,
        setDemoStep,
        executeDemoStep,
        resetToSeedData,
        unreadAnnouncementsCount,
        markAnnouncementsAsRead,
        latestAlert,
        dismissLatestAlert,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
