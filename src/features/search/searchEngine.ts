import { EventSession, VenueZone } from '../../types';

export interface SearchResultItem {
  id: string;
  type: 'session' | 'venue' | 'facility' | 'speaker';
  title: string;
  subtitle: string;
  badge: string;
  targetId: string; // zoneId or sessionId
  iconType: 'calendar' | 'map-pin' | 'user' | 'accessibility';
  crowdLevel?: string;
  locationName?: string;
}

export function searchGlobal(
  query: string,
  sessions: EventSession[],
  zones: VenueZone[]
): SearchResultItem[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: SearchResultItem[] = [];
  const zoneMap = new Map<string, VenueZone>(zones.map((z) => [z.id, z]));

  // 1. Search Sessions
  for (const session of sessions) {
    const titleMatch = session.title.toLowerCase().includes(cleanQuery);
    const catMatch = session.category.toLowerCase().includes(cleanQuery);
    const descMatch = session.description.toLowerCase().includes(cleanQuery);
    const speakerMatch =
      session.speaker.name.toLowerCase().includes(cleanQuery) ||
      session.speaker.company.toLowerCase().includes(cleanQuery);

    if (titleMatch || catMatch || descMatch || speakerMatch) {
      const loc = zoneMap.get(session.locationId);
      results.push({
        id: `search-sess-${session.id}`,
        type: 'session',
        title: session.title,
        subtitle: `${session.time} • ${loc?.name ?? 'Venue'} • ${session.speaker.name}`,
        badge: session.category,
        targetId: session.id,
        iconType: 'calendar',
        crowdLevel: session.crowdStatus,
        locationName: loc?.name,
      });
    }
  }

  // 2. Search Venues / Zones
  for (const zone of zones) {
    const nameMatch = zone.name.toLowerCase().includes(cleanQuery);
    const codeMatch = zone.code.toLowerCase().includes(cleanQuery);
    const catMatch = zone.category.toLowerCase().includes(cleanQuery);
    const descMatch = zone.description.toLowerCase().includes(cleanQuery);
    const facilityMatch = zone.facilities.some((f) => f.toLowerCase().includes(cleanQuery));

    // Special synonyms like "restroom", "food", "help", "first aid", "medic", "stairs", "ramp", "bathroom", "toilet"
    const isSpecialSynonym =
      (cleanQuery.includes('restroom') || cleanQuery.includes('toilet') || cleanQuery.includes('bathroom')) &&
      zone.category === 'Restroom';
    const isFoodSynonym =
      (cleanQuery.includes('food') || cleanQuery.includes('coffee') || cleanQuery.includes('eat') || cleanQuery.includes('lunch') || cleanQuery.includes('snack')) &&
      zone.category === 'Dining';
    const isHelpSynonym =
      (cleanQuery.includes('help') || cleanQuery.includes('support') || cleanQuery.includes('info')) &&
      (zone.category === 'Service' || zone.name.includes('Help'));
    const isEmergencySynonym =
      (cleanQuery.includes('medical') || cleanQuery.includes('first aid') || cleanQuery.includes('doctor') || cleanQuery.includes('emergency')) &&
      (zone.id.includes('first-aid') || zone.id.includes('security'));

    if (nameMatch || codeMatch || catMatch || descMatch || facilityMatch || isSpecialSynonym || isFoodSynonym || isHelpSynonym || isEmergencySynonym) {
      results.push({
        id: `search-zone-${zone.id}`,
        type: 'venue',
        title: zone.name,
        subtitle: `${zone.category} • ${zone.description.slice(0, 75)}...`,
        badge: zone.crowdStatus,
        targetId: zone.id,
        iconType: 'map-pin',
        crowdLevel: `${zone.crowdLevel}% crowd`,
        locationName: zone.code,
      });
    }
  }

  // Deduplicate and prioritize exact title/name matches
  return results.sort((a, b) => {
    const aExact = a.title.toLowerCase().startsWith(cleanQuery);
    const bExact = b.title.toLowerCase().startsWith(cleanQuery);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return 0;
  });
}
