export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Capacity';

export interface Coordinates {
  x: number;
  y: number;
  floor: number;
  width?: number;
  height?: number;
}

export interface ZoneAccessibility {
  hasElevator: boolean;
  hasRamp: boolean;
  hasStairs: boolean;
  wheelchairAccessible: boolean;
  tactilePaving: boolean;
  brailleSignage: boolean;
  companionSeating: boolean;
  accessibleRestroomNearby: boolean;
}

export type ZoneCategory =
  | 'Stage'
  | 'Hall'
  | 'Workshop'
  | 'Dining'
  | 'Restroom'
  | 'Service'
  | 'Entrance'
  | 'Transit';

export interface VenueZone {
  id: string;
  code: string;
  name: string;
  category: ZoneCategory;
  crowdLevel: number; // 0 - 100 percentage
  crowdStatus: CrowdLevel;
  coordinates: Coordinates;
  accessibility: ZoneAccessibility;
  description: string;
  facilities: string[];
  capacity: number;
  currentOccupancy: number;
  queueMinutes?: number;
}

export type RouteType = 'fastest' | 'smart' | 'accessible';

export interface RouteOption {
  id: string;
  type: RouteType;
  name: string;
  durationMinutes: number;
  distanceMeters: number;
  crowdDensityPercent: number;
  crowdAvoidancePercent: number;
  hasStairs: boolean;
  usesElevator: boolean;
  usesRamp: boolean;
  pathPoints: Array<{ x: number; y: number }>;
  stepInstructions: string[];
  isRecommended: boolean;
  recommendationReason: string;
}

export type SessionCategory =
  | 'AI'
  | 'Cloud'
  | 'Cybersecurity'
  | 'Web'
  | 'Career'
  | 'Startup'
  | 'Workshop';

export type SessionStatus = 'ONGOING' | 'STARTING SOON' | 'UPCOMING' | 'COMPLETED';

export interface Speaker {
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
}

export interface EventSession {
  id: string;
  title: string;
  speaker: Speaker;
  time: string;
  startTimeMinutes: number; // minutes from midnight, e.g. 14:00 = 840
  endTimeMinutes: number;
  locationId: string;
  durationMinutes: number;
  category: SessionCategory;
  crowdStatus: CrowdLevel;
  accessibilityInfo: string;
  status: SessionStatus;
  description: string;
  capacity: number;
  prerequisites?: string;
}

export type SeverityLevel = 'info' | 'warning' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: string;
  createdAt: number;
  affectedZoneId?: string;
  target: 'Everyone' | string;
  author: string;
}

export type EmergencyType =
  | 'Medical Assistance'
  | 'Security Assistance'
  | 'Lost Person / Help'
  | 'General Assistance';

export type EmergencyStatus = 'Pending' | 'Acknowledged' | 'Dispatched' | 'Resolved';

export interface EmergencyRequest {
  id: string;
  type: EmergencyType;
  locationId: string;
  locationName: string;
  reportedAt: string;
  createdAt: number;
  status: EmergencyStatus;
  notes?: string;
  contactOptional?: string;
  assignedResponder?: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  avoidStairs: boolean;
  preferElevator: boolean;
  preferRamps: boolean;
  screenReaderOptimized: boolean;
  accessibleRestroomFinder: boolean;
}

export interface AttendeeProfile {
  id: string;
  name: string;
  role: string;
  interests: string[];
  currentLocationId: string;
  savedSessionIds: string[];
  accessibilitySettings: AccessibilitySettings;
}

export interface AIRecommendationCard {
  id: string;
  title: string;
  subtitle: string;
  locationId: string;
  locationName: string;
  time: string;
  crowd: string;
  walkMinutes: number;
  category: string;
  reason?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'deterministic-fallback';
  structuredCards?: AIRecommendationCard[];
}

export type ActiveTab =
  | 'home'
  | 'map'
  | 'schedule'
  | 'for-you'
  | 'ai'
  | 'updates'
  | 'saved'
  | 'help'
  | 'alignment';

export type OrganizerTab =
  | 'overview'
  | 'crowd'
  | 'announcements'
  | 'emergency'
  | 'sessions'
  | 'zones';
