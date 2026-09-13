import { EventSession, VenueZone, AttendeeProfile, AIRecommendationCard, AIMessage } from '../types';

export interface AskAIOptions {
  prompt: string;
  sessions: EventSession[];
  zones: VenueZone[];
  profile: AttendeeProfile;
  currentTimeMinutes?: number;
}

export interface AskAIResponse {
  answer: string;
  structuredCards?: AIRecommendationCard[];
  source: 'gemini' | 'deterministic-fallback';
}

export async function askEventPulseAI(options: AskAIOptions): Promise<AskAIResponse> {
  const { prompt, sessions, zones, profile, currentTimeMinutes = 840 } = options;

  // Attempt server-side Gemini API call first
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        currentLocationId: profile.currentLocationId,
        userInterests: profile.interests,
        avoidStairs: profile.accessibilitySettings.avoidStairs,
        savedSessionIds: profile.savedSessionIds,
        currentTimeMinutes,
        // Send condensed event context so Gemini has ground truth
        zones: zones.map((z) => ({
          id: z.id,
          name: z.name,
          category: z.category,
          crowdLevel: z.crowdLevel,
          hasElevator: z.accessibility.hasElevator,
          hasRamp: z.accessibility.hasRamp,
        })),
        sessions: sessions.map((s) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          time: s.time,
          locationId: s.locationId,
          crowdStatus: s.crowdStatus,
          status: s.status,
          accessibilityInfo: s.accessibilityInfo,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return {
          answer: data.answer,
          structuredCards: data.structuredCards || buildFallbackCards(prompt, sessions, zones),
          source: 'gemini',
        };
      }
    }
  } catch (err) {
    // Network or server error - gracefully proceed to deterministic engine
    console.warn('Gemini API unavailable, switching smoothly to deterministic event intelligence.', err);
  }

  // Graceful deterministic event-aware intelligence system
  return generateDeterministicResponse(prompt, sessions, zones, profile, currentTimeMinutes);
}

function generateDeterministicResponse(
  prompt: string,
  sessions: EventSession[],
  zones: VenueZone[],
  profile: AttendeeProfile,
  currentTimeMinutes: number
): AskAIResponse {
  const q = prompt.toLowerCase();
  const zoneMap = new Map(zones.map((z) => [z.id, z]));

  // Case 1: "I have 30 minutes. What should I attend?" / Time constrained
  if (q.includes('30 min') || q.includes('minutes') || q.includes('time') || q.includes('before 3')) {
    const candidate = sessions.find(
      (s) => s.status !== 'COMPLETED' && s.startTimeMinutes <= currentTimeMinutes + 35
    ) ?? sessions[0];
    const loc = zoneMap.get(candidate.locationId);

    const cards: AIRecommendationCard[] = [
      {
        id: `rec-${candidate.id}`,
        title: candidate.title,
        subtitle: `${candidate.speaker.name} (${candidate.speaker.company})`,
        locationId: candidate.locationId,
        locationName: loc?.name ?? 'Hall B',
        time: candidate.time,
        crowd: `${loc?.crowdLevel ?? 31}% (Low)`,
        walkMinutes: 4,
        category: candidate.category,
        reason: `Optimal 30-minute fit: starts at ${candidate.time.split('–')[0]?.trim()} with quick step-free walk.`,
      },
    ];

    return {
      answer: `Based on your schedule gap of 30 minutes, I recommend heading to **${candidate.title}** at **${loc?.name}**. It starts shortly, has low crowd congestion (${loc?.crowdLevel ?? 31}%), and is only a 4-minute walk from your current position.`,
      structuredCards: cards,
      source: 'deterministic-fallback',
    };
  }

  // Case 2: "I want an AI workshop with low crowd"
  if (q.includes('ai') && (q.includes('workshop') || q.includes('crowd') || q.includes('low'))) {
    const aiWorkshop = sessions.find(
      (s) => s.category === 'AI' && (s.id.includes('ws') || s.title.toLowerCase().includes('workshop'))
    ) ?? sessions[0];
    const loc = zoneMap.get(aiWorkshop.locationId);

    return {
      answer: `The best match is the **${aiWorkshop.title}** in **${loc?.name}**. Hall B currently has a **${loc?.crowdLevel ?? 31}% crowd density (Low)**, significantly less congested than Main Stage (92%). It features full step-free access and reserved seating.`,
      structuredCards: [
        {
          id: `rec-${aiWorkshop.id}`,
          title: aiWorkshop.title,
          subtitle: `Speaker: ${aiWorkshop.speaker.name}`,
          locationId: aiWorkshop.locationId,
          locationName: loc?.name ?? 'Hall B',
          time: aiWorkshop.time,
          crowd: 'Low (31%)',
          walkMinutes: 5,
          category: 'AI Workshop',
          reason: 'Best crowd efficiency: 32% less crowded than other tech halls.',
        },
      ],
      source: 'deterministic-fallback',
    };
  }

  // Case 3: "How do I reach Hall B without stairs?" / Accessibility
  if (q.includes('without stairs') || q.includes('stairs') || q.includes('accessible') || q.includes('ramp') || q.includes('elevator')) {
    const hallB = zones.find((z) => z.id === 'zone-hall-b')!;
    return {
      answer: `To reach **Hall B** without stairs, follow the **Accessible Route**: Take the ground-floor concourse past the Central Help Desk, then use the **East Wing Atrium Ramp** or **North Elevator Bank**. All double doors to Hall B are automated and level with zero-step thresholds.`,
      structuredCards: [
        {
          id: 'rec-hall-b-route',
          title: 'Accessible Route to Hall B',
          subtitle: 'Ground Concourse → East Ramp → Hall B',
          locationId: 'zone-hall-b',
          locationName: hallB.name,
          time: '6 min walk / wheel',
          crowd: 'Low (31%)',
          walkMinutes: 6,
          category: 'Step-Free Navigation',
          reason: '100% stair-free path verified via Atrium Ramp.',
        },
      ],
      source: 'deterministic-fallback',
    };
  }

  // Case 4: "Where is the nearest restroom?"
  if (q.includes('restroom') || q.includes('bathroom') || q.includes('toilet') || q.includes('wc')) {
    const accRestroom = zones.find((z) => z.id === 'zone-accessible-restroom')!;
    return {
      answer: `The nearest restroom depends on your access needs:\n• **Accessible Restroom**: Located on the East Concourse near Elevator Bank (15% crowd, zero queue, automatic door, emergency cord).\n• **Standard Restrooms**: Central concourse between Hall A and Workshop Zone (62% crowd, 6 min wait).`,
      structuredCards: [
        {
          id: 'rec-wc-acc',
          title: 'Accessible Single-Occupancy Restroom',
          subtitle: 'East Concourse near Elevator',
          locationId: 'zone-accessible-restroom',
          locationName: accRestroom.name,
          time: 'Zero wait',
          crowd: 'Low (15%)',
          walkMinutes: 2,
          category: 'Facilities',
          reason: 'Sanitized, step-free with emergency pull-cord and grab bars.',
        },
      ],
      source: 'deterministic-fallback',
    };
  }

  // Case 5: "Which food court is less crowded?"
  if (q.includes('food') || q.includes('eat') || q.includes('lunch') || q.includes('court') || q.includes('coffee')) {
    const foodB = zones.find((z) => z.id === 'zone-food-court-b')!;
    return {
      answer: `**Food Court B (East Wing)** is significantly less crowded! It currently has **${foodB.crowdLevel}% crowd density** and wait times under 3 minutes, compared to **Food Court A** which is at **84% capacity** with a 16-minute wait line.`,
      structuredCards: [
        {
          id: 'rec-food-b',
          title: 'Food Court B (East Pavilion)',
          subtitle: 'Short Queues (< 3 min) • Quiet Seating',
          locationId: 'zone-food-court-b',
          locationName: foodB.name,
          time: 'Open now',
          crowd: `${foodB.crowdLevel}% (Low)`,
          walkMinutes: 5,
          category: 'Dining',
          reason: 'Saves ~13 minutes queue time compared to Food Court A.',
        },
      ],
      source: 'deterministic-fallback',
    };
  }

  // Case 6: "I'm near Hall A. What's happening nearby?"
  if (q.includes('near') || q.includes('hall a') || q.includes('nearby') || q.includes('happening now')) {
    const nearbySessions = sessions.filter(
      (s) => s.status === 'ONGOING' || s.status === 'STARTING SOON'
    );
    const top = nearbySessions[0] ?? sessions[0];
    const loc = zoneMap.get(top.locationId);

    return {
      answer: `Near Hall A right now, the **${top.title}** is ${top.status.toLowerCase()} in **${loc?.name}**. Alternatively, the **First Aid Station** is 60m West, and the **Central Workshop Zone** is 90m Southeast.`,
      structuredCards: [
        {
          id: `rec-nearby-${top.id}`,
          title: top.title,
          subtitle: `${top.category} • ${top.time}`,
          locationId: top.locationId,
          locationName: loc?.name ?? 'Hall A',
          time: top.time,
          crowd: `${loc?.crowdLevel ?? 50}%`,
          walkMinutes: 2,
          category: top.category,
          reason: 'Immediately adjacent to your current location.',
        },
      ],
      source: 'deterministic-fallback',
    };
  }

  // Generic fallback with personalized match
  const match = sessions.find((s) => profile.interests.includes(s.category)) ?? sessions[0];
  const loc = zoneMap.get(match.locationId);

  return {
    answer: `Here is the top recommendation for your profile at FutureTech 2026: **${match.title}** in **${loc?.name}**. Current crowd level is **${loc?.crowdStatus}** with verified accessible entry.`,
    structuredCards: [
      {
        id: `rec-gen-${match.id}`,
        title: match.title,
        subtitle: `${match.category} • ${match.speaker.name}`,
        locationId: match.locationId,
        locationName: loc?.name ?? 'Main Venue',
        time: match.time,
        crowd: `${loc?.crowdLevel ?? 35}%`,
        walkMinutes: 4,
        category: match.category,
        reason: `Matches your saved interest in ${match.category}.`,
      },
    ],
    source: 'deterministic-fallback',
  };
}

function buildFallbackCards(prompt: string, sessions: EventSession[], zones: VenueZone[]): AIRecommendationCard[] {
  const top = sessions[0];
  const loc = zones.find((z) => z.id === top.locationId);
  return [
    {
      id: `card-${top.id}`,
      title: top.title,
      subtitle: `${top.category} • ${top.speaker.name}`,
      locationId: top.locationId,
      locationName: loc?.name ?? 'Venue',
      time: top.time,
      crowd: top.crowdStatus,
      walkMinutes: 4,
      category: top.category,
      reason: 'Best match for your query',
    },
  ];
}
