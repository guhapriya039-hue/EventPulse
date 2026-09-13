import { EventSession, VenueZone, AttendeeProfile } from '../../types';

export interface RecommendationResult {
  session: EventSession;
  score: number;
  matchReasons: string[];
  distanceMeters: number;
  walkTimeMinutes: number;
  location: VenueZone;
}

export interface WhatsNextOpportunity {
  id: string;
  type: 'session' | 'food' | 'restroom' | 'lounge';
  title: string;
  subtitle: string;
  durationEstimateMinutes: number;
  crowdLevel: string;
  locationName: string;
  locationId: string;
  walkMinutes: number;
  badge: string;
  reason: string;
}

export function computeForYouRecommendations(
  sessions: EventSession[],
  zones: VenueZone[],
  profile: AttendeeProfile,
  currentTimeMinutes = 840 // Default 2:00 PM
): RecommendationResult[] {
  const currentZone = zones.find((z) => z.id === profile.currentLocationId) ?? zones[0];
  const zoneMap = new Map<string, VenueZone>(zones.map((z) => [z.id, z]));

  const results: RecommendationResult[] = [];

  for (const session of sessions) {
    // Exclude sessions already completed
    if (session.status === 'COMPLETED') continue;

    const loc = zoneMap.get(session.locationId);
    if (!loc) continue;

    // Approximate distance from current zone
    const dx = loc.coordinates.x - currentZone.coordinates.x;
    const dy = loc.coordinates.y - currentZone.coordinates.y;
    const distanceMeters = Math.max(30, Math.round(Math.sqrt(dx * dx + dy * dy) * 1.4));
    const walkTimeMinutes = Math.max(1, Math.round(distanceMeters / 65));

    let score = 50;
    const matchReasons: string[] = [];

    // 1. Interest alignment
    const isInterestMatch = profile.interests.some(
      (interest) =>
        session.category.toLowerCase().includes(interest.toLowerCase()) ||
        session.title.toLowerCase().includes(interest.toLowerCase())
    );

    if (isInterestMatch) {
      score += 35;
      matchReasons.push(`Matches your interest in ${session.category}`);
    }

    // 2. Crowd factor
    if (loc.crowdLevel <= 35) {
      score += 20;
      matchReasons.push(`Low crowd (${loc.crowdLevel}% occupancy)`);
    } else if (loc.crowdLevel >= 80) {
      score -= 25;
    }

    // 3. Proximity
    if (distanceMeters < 150) {
      score += 15;
      matchReasons.push(`Nearby location (${walkTimeMinutes} min walk)`);
    }

    // 4. Timing fit
    const timeUntilStart = session.startTimeMinutes - currentTimeMinutes;
    if (timeUntilStart >= 0 && timeUntilStart <= 45) {
      score += 20;
      matchReasons.push(`Starts soon (in ${timeUntilStart} min)`);
    } else if (session.status === 'ONGOING') {
      score += 10;
      matchReasons.push('Currently ongoing');
    }

    // 5. Accessibility fit
    if (profile.accessibilitySettings.avoidStairs && loc.accessibility.hasStairs && !loc.accessibility.hasRamp) {
      score -= 40;
    } else if (profile.accessibilitySettings.avoidStairs && (loc.accessibility.hasRamp || loc.accessibility.hasElevator)) {
      score += 10;
      matchReasons.push('Verified step-free access');
    }

    results.push({
      session,
      score,
      matchReasons,
      distanceMeters,
      walkTimeMinutes,
      location: loc,
    });
  }

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}

export function computeWhatsNext(
  sessions: EventSession[],
  zones: VenueZone[],
  profile: AttendeeProfile,
  currentTimeMinutes = 840 // 2:00 PM
): {
  minutesAvailable: number;
  nextSavedSession: EventSession | null;
  opportunities: WhatsNextOpportunity[];
} {
  const currentZone = zones.find((z) => z.id === profile.currentLocationId) ?? zones[0];
  const zoneMap = new Map<string, VenueZone>(zones.map((z) => [z.id, z]));

  // Find next saved session
  const savedSessions = sessions
    .filter((s) => profile.savedSessionIds.includes(s.id) && s.startTimeMinutes > currentTimeMinutes)
    .sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);

  const nextSavedSession = savedSessions[0] ?? null;
  const minutesAvailable = nextSavedSession
    ? Math.max(10, nextSavedSession.startTimeMinutes - currentTimeMinutes)
    : 45; // default 45 min window

  const opportunities: WhatsNextOpportunity[] = [];

  // 1. Session opportunity fitting time window
  const availableSessions = sessions
    .filter(
      (s) =>
        s.id !== nextSavedSession?.id &&
        s.status !== 'COMPLETED' &&
        s.startTimeMinutes <= currentTimeMinutes + 20 &&
        s.durationMinutes <= minutesAvailable
    )
    .sort((a, b) => a.startTimeMinutes - b.startTimeMinutes);

  if (availableSessions.length > 0) {
    const candidate = availableSessions[0];
    const loc = zoneMap.get(candidate.locationId);
    opportunities.push({
      id: `opp-sess-${candidate.id}`,
      type: 'session',
      title: candidate.title,
      subtitle: `${candidate.category} • ${candidate.speaker.name}`,
      durationEstimateMinutes: candidate.durationMinutes,
      crowdLevel: loc?.crowdStatus ?? 'Low',
      locationName: loc?.name ?? 'Hall',
      locationId: candidate.locationId,
      walkMinutes: 4,
      badge: 'Quick Session',
      reason: `Fits comfortably in your ${minutesAvailable}-min window before ${nextSavedSession?.title ?? 'next event'}.`,
    });
  }

  // 2. Low-crowd food opportunity
  const foodCourts = zones
    .filter((z) => z.category === 'Dining')
    .sort((a, b) => a.crowdLevel - b.crowdLevel);

  if (foodCourts.length > 0) {
    const bestFood = foodCourts[0];
    opportunities.push({
      id: `opp-food-${bestFood.id}`,
      type: 'food',
      title: bestFood.name,
      subtitle: bestFood.crowdLevel < 40 ? 'Short queues (< 3 min)' : 'Dining area',
      durationEstimateMinutes: 15,
      crowdLevel: bestFood.crowdStatus,
      locationName: bestFood.name,
      locationId: bestFood.id,
      walkMinutes: 5,
      badge: 'Refreshment',
      reason: `Currently has ${bestFood.crowdLevel}% crowd density — fastest spot for a coffee or snack.`,
    });
  }

  // 3. Central lounge or workshop
  const workshop = zones.find((z) => z.id === 'zone-workshop-zone');
  if (workshop) {
    opportunities.push({
      id: `opp-ws-${workshop.id}`,
      type: 'lounge',
      title: 'Interactive Tech Demo Pavilion',
      subtitle: 'Hands-on hardware & agent stations',
      durationEstimateMinutes: 20,
      crowdLevel: workshop.crowdStatus,
      locationName: workshop.name,
      locationId: workshop.id,
      walkMinutes: 3,
      badge: 'Drop-in',
      reason: 'Open walk-in demos without strict talk schedule.',
    });
  }

  // 4. Accessible Restroom check if requested
  if (profile.accessibilitySettings.accessibleRestroomFinder) {
    const accRestroom = zones.find((z) => z.id === 'zone-accessible-restroom');
    if (accRestroom) {
      opportunities.unshift({
        id: `opp-wc-${accRestroom.id}`,
        type: 'restroom',
        title: 'Accessible Restroom (East Concourse)',
        subtitle: 'Zero queue • Step-free access',
        durationEstimateMinutes: 5,
        crowdLevel: 'Low',
        locationName: accRestroom.name,
        locationId: accRestroom.id,
        walkMinutes: 2,
        badge: 'Priority Facility',
        reason: 'Highlighted per your Accessible Restroom Finder preference.',
      });
    }
  }

  return {
    minutesAvailable,
    nextSavedSession,
    opportunities,
  };
}
