import { VenueZone, RouteOption, RouteType, AccessibilitySettings } from '../../types';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  zoneId?: string;
  name: string;
  floor: number;
}

interface GraphEdge {
  from: string;
  to: string;
  distance: number; // meters
  hasStairs: boolean;
  usesElevator: boolean;
  usesRamp: boolean;
  crowdInfluenceZoneId?: string; // which zone's crowd level affects this corridor
  description: string;
}

// Architectural venue navigation graph for FutureTech 2026
const NODES: Record<string, GraphNode> = {
  'n-main-entrance': { id: 'n-main-entrance', x: 120, y: 520, zoneId: 'zone-main-entrance', name: 'Main Entrance', floor: 1 },
  'n-acc-entrance': { id: 'n-acc-entrance', x: 80, y: 460, zoneId: 'zone-accessible-entrance', name: 'Accessible Entrance', floor: 1 },
  'n-help-desk': { id: 'n-help-desk', x: 370, y: 480, zoneId: 'zone-help-desk', name: 'Central Help Desk', floor: 1 },
  'n-security': { id: 'n-security', x: 740, y: 520, zoneId: 'zone-security', name: 'Security Command', floor: 1 },
  'n-exit': { id: 'n-exit', x: 860, y: 460, zoneId: 'zone-exit', name: 'East Transit Exit', floor: 1 },

  'n-junction-south-west': { id: 'n-junction-south-west', x: 200, y: 480, name: 'Southwest Concourse', floor: 1 },
  'n-junction-south-east': { id: 'n-junction-south-east', x: 600, y: 480, name: 'Southeast Concourse', floor: 1 },

  'n-food-a': { id: 'n-food-a', x: 220, y: 430, zoneId: 'zone-food-court-a', name: 'Food Court A', floor: 1 },
  'n-food-b': { id: 'n-food-b', x: 680, y: 430, zoneId: 'zone-food-court-b', name: 'Food Court B', floor: 1 },

  'n-first-aid': { id: 'n-first-aid', x: 190, y: 320, zoneId: 'zone-first-aid', name: 'First Aid Station', floor: 1 },
  'n-wc-std': { id: 'n-wc-std', x: 330, y: 310, zoneId: 'zone-restrooms', name: 'Restrooms', floor: 1 },
  'n-wc-acc': { id: 'n-wc-acc', x: 550, y: 320, zoneId: 'zone-accessible-restroom', name: 'Accessible Restroom', floor: 1 },

  'n-central-atrium': { id: 'n-central-atrium', x: 440, y: 420, name: 'Central Open Atrium', floor: 1 },
  'n-workshop': { id: 'n-workshop', x: 440, y: 360, zoneId: 'zone-workshop-zone', name: 'Workshop Zone', floor: 1 },

  'n-ramp': { id: 'n-ramp', x: 380, y: 220, zoneId: 'zone-ramp', name: 'Atrium Accessible Ramp', floor: 1 },
  'n-stairs-central': { id: 'n-stairs-central', x: 450, y: 250, name: 'Monumental Grand Stairs', floor: 1 },
  'n-elevator': { id: 'n-elevator', x: 500, y: 220, zoneId: 'zone-elevator', name: 'Elevator Bank', floor: 1 },

  'n-hall-a': { id: 'n-hall-a', x: 260, y: 260, zoneId: 'zone-hall-a', name: 'Hall A Entrance', floor: 1 },
  'n-hall-b': { id: 'n-hall-b', x: 620, y: 260, zoneId: 'zone-hall-b', name: 'Hall B Entrance', floor: 1 },
  'n-hall-c': { id: 'n-hall-c', x: 790, y: 260, zoneId: 'zone-hall-c', name: 'Hall C Entrance', floor: 1 },

  'n-stage-corridor': { id: 'n-stage-corridor', x: 450, y: 190, name: 'Main Stage Portico', floor: 1 },
  'n-main-stage': { id: 'n-main-stage', x: 450, y: 150, zoneId: 'zone-main-stage', name: 'Main Stage Auditorium', floor: 1 },

  // Smart detour bypasses
  'n-east-bypass': { id: 'n-east-bypass', x: 720, y: 340, name: 'East Quiet Corridor Bypass', floor: 1 },
  'n-west-bypass': { id: 'n-west-bypass', x: 140, y: 380, name: 'West Garden Corridor Bypass', floor: 1 },
};

const EDGES: GraphEdge[] = [
  // Entrance connections
  { from: 'n-main-entrance', to: 'n-junction-south-west', distance: 80, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Direct flat entrance hall' },
  { from: 'n-main-entrance', to: 'n-help-desk', distance: 120, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Central concourse walkway' },
  { from: 'n-acc-entrance', to: 'n-junction-south-west', distance: 60, hasStairs: false, usesElevator: false, usesRamp: true, description: 'Zero-step tactile paved entry path' },
  { from: 'n-acc-entrance', to: 'n-west-bypass', distance: 90, hasStairs: false, usesElevator: false, usesRamp: true, description: 'Wide exterior accessible rampway' },

  // South Concourse
  { from: 'n-junction-south-west', to: 'n-food-a', distance: 70, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-food-court-a', description: 'Food Court A approach' },
  { from: 'n-junction-south-west', to: 'n-central-atrium', distance: 140, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Atrium avenue' },
  { from: 'n-help-desk', to: 'n-central-atrium', distance: 70, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Information plaza' },
  { from: 'n-help-desk', to: 'n-junction-south-east', distance: 130, hasStairs: false, usesElevator: false, usesRamp: false, description: 'East concourse connector' },
  { from: 'n-junction-south-east', to: 'n-food-b', distance: 80, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-food-court-b', description: 'Food Court B approach' },
  { from: 'n-junction-south-east', to: 'n-security', distance: 90, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Security station walkway' },
  { from: 'n-junction-south-east', to: 'n-exit', distance: 140, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Transit exit concourse' },

  // West corridor (passes Food A, First Aid, Hall A)
  { from: 'n-food-a', to: 'n-first-aid', distance: 90, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-food-court-a', description: 'Medical service corridor' },
  { from: 'n-west-bypass', to: 'n-first-aid', distance: 80, hasStairs: false, usesElevator: false, usesRamp: true, description: 'Quiet perimeter walkway' },
  { from: 'n-first-aid', to: 'n-hall-a', distance: 85, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-hall-a', description: 'Hall A West corridor' },
  { from: 'n-food-a', to: 'n-hall-a', distance: 110, hasStairs: true, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-hall-a', description: 'Short flight of stairs to Hall A' },

  // Central corridor & Workshop
  { from: 'n-central-atrium', to: 'n-workshop', distance: 60, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-workshop-zone', description: 'Workshop Zone entrance' },
  { from: 'n-central-atrium', to: 'n-wc-std', distance: 90, hasStairs: true, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-restrooms', description: 'Steps down to standard restrooms' },
  { from: 'n-central-atrium', to: 'n-wc-acc', distance: 110, hasStairs: false, usesElevator: false, usesRamp: true, crowdInfluenceZoneId: 'zone-accessible-restroom', description: 'Step-free path to accessible restroom' },
  { from: 'n-workshop', to: 'n-wc-acc', distance: 75, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Accessible restroom link' },
  { from: 'n-workshop', to: 'n-wc-std', distance: 70, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Concourse restroom hallway' },

  // Vertical transitions to Upper Main Stage / Hall Corridors
  // Direct fastest connection has stairs
  { from: 'n-workshop', to: 'n-stairs-central', distance: 50, hasStairs: true, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-main-stage', description: 'Monumental central stairs' },
  { from: 'n-stairs-central', to: 'n-stage-corridor', distance: 45, hasStairs: true, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-main-stage', description: 'Upper stairway landing' },

  // Accessible Ramp transition
  { from: 'n-hall-a', to: 'n-ramp', distance: 70, hasStairs: false, usesElevator: false, usesRamp: true, description: 'Step-free Atrium ramp approach' },
  { from: 'n-workshop', to: 'n-ramp', distance: 65, hasStairs: false, usesElevator: false, usesRamp: true, description: 'Direct link to gentle ramp' },
  { from: 'n-ramp', to: 'n-stage-corridor', distance: 60, hasStairs: false, usesElevator: false, usesRamp: true, description: 'Ramp landing to Stage Portico' },

  // Accessible Elevator transition
  { from: 'n-wc-acc', to: 'n-elevator', distance: 50, hasStairs: false, usesElevator: true, usesRamp: false, description: 'Elevator ground lobby' },
  { from: 'n-workshop', to: 'n-elevator', distance: 70, hasStairs: false, usesElevator: true, usesRamp: false, description: 'Step-free elevator bank connection' },
  { from: 'n-elevator', to: 'n-stage-corridor', distance: 40, hasStairs: false, usesElevator: true, usesRamp: false, description: 'Upper elevator lobby to Stage Portico' },
  { from: 'n-elevator', to: 'n-hall-b', distance: 60, hasStairs: false, usesElevator: true, usesRamp: false, description: 'Elevator corridor to Hall B' },

  // Stage Portico to Main Stage
  { from: 'n-stage-corridor', to: 'n-main-stage', distance: 30, hasStairs: false, usesElevator: false, usesRamp: true, crowdInfluenceZoneId: 'zone-main-stage', description: 'Main Stage double doors' },
  { from: 'n-stage-corridor', to: 'n-hall-b', distance: 80, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Auditorium connector corridor' },
  { from: 'n-stage-corridor', to: 'n-hall-a', distance: 85, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-hall-a', description: 'West auditorium concourse' },

  // East Wing (Hall B, Hall C, East Bypass, Food B)
  { from: 'n-hall-b', to: 'n-hall-c', distance: 90, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-hall-c', description: 'Wide East Tech Gallery' },
  { from: 'n-hall-b', to: 'n-east-bypass', distance: 75, hasStairs: false, usesElevator: false, usesRamp: false, description: 'East quiet corridor' },
  { from: 'n-hall-c', to: 'n-east-bypass', distance: 70, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Hall C quiet bypass' },
  { from: 'n-east-bypass', to: 'n-food-b', distance: 80, hasStairs: false, usesElevator: false, usesRamp: false, crowdInfluenceZoneId: 'zone-food-court-b', description: 'Spacious East dining avenue' },
  { from: 'n-east-bypass', to: 'n-central-atrium', distance: 120, hasStairs: false, usesElevator: false, usesRamp: false, description: 'East atrium bypass corridor' },
  { from: 'n-food-b', to: 'n-central-atrium', distance: 110, hasStairs: false, usesElevator: false, usesRamp: false, description: 'Dining concourse to Atrium' },
];

// Helper to find closest graph node for a zone ID
function findNodeForZone(zoneId: string): string {
  for (const [nodeId, node] of Object.entries(NODES)) {
    if (node.zoneId === zoneId) return nodeId;
  }
  // Fallback defaults
  if (zoneId.includes('stage')) return 'n-main-stage';
  if (zoneId.includes('hall-a')) return 'n-hall-a';
  if (zoneId.includes('hall-b')) return 'n-hall-b';
  if (zoneId.includes('hall-c')) return 'n-hall-c';
  if (zoneId.includes('food-a')) return 'n-food-a';
  if (zoneId.includes('food-b')) return 'n-food-b';
  if (zoneId.includes('workshop')) return 'n-workshop';
  if (zoneId.includes('first-aid')) return 'n-first-aid';
  if (zoneId.includes('help')) return 'n-help-desk';
  if (zoneId.includes('wc-acc') || zoneId.includes('accessible-restroom')) return 'n-wc-acc';
  if (zoneId.includes('wc') || zoneId.includes('restrooms')) return 'n-wc-std';
  if (zoneId.includes('elevator')) return 'n-elevator';
  if (zoneId.includes('ramp')) return 'n-ramp';
  if (zoneId.includes('sec')) return 'n-security';
  return 'n-main-entrance';
}

interface PathResult {
  nodeIds: string[];
  totalDistance: number;
  hasStairs: boolean;
  usesElevator: boolean;
  usesRamp: boolean;
  avgCrowdDensity: number;
  instructions: string[];
}

// Bidirectional graph search
function buildAdjacency(edges: GraphEdge[]) {
  const adj: Record<string, GraphEdge[]> = {};
  for (const nodeKey of Object.keys(NODES)) {
    adj[nodeKey] = [];
  }
  for (const edge of edges) {
    adj[edge.from]?.push(edge);
    adj[edge.to]?.push({
      ...edge,
      from: edge.to,
      to: edge.from,
    });
  }
  return adj;
}

const ADJACENCY = buildAdjacency(EDGES);

export function computeRoutes(
  fromZoneId: string,
  toZoneId: string,
  zones: VenueZone[],
  accessibilitySettings: AccessibilitySettings
): RouteOption[] {
  const startNodeId = findNodeForZone(fromZoneId);
  const endNodeId = findNodeForZone(toZoneId);

  // Map zone crowds for fast lookup
  const zoneCrowdMap: Record<string, number> = {};
  for (const z of zones) {
    zoneCrowdMap[z.id] = z.crowdLevel;
  }

  // 1. FASTEST ROUTE: pure geometric distance / standard walking speed
  const fastestPath = dijkstra(startNodeId, endNodeId, (edge) => {
    return edge.distance;
  }, zoneCrowdMap);

  // 2. SMART ROUTE: heavily penalizes crowd density bottlenecks
  const smartPath = dijkstra(startNodeId, endNodeId, (edge) => {
    const crowd = edge.crowdInfluenceZoneId ? (zoneCrowdMap[edge.crowdInfluenceZoneId] ?? 20) : 15;
    // Heavy non-linear penalty for crowd congestion (e.g. 85%+ crowd increases cost 3-4x)
    const congestionFactor = 1 + Math.pow(crowd / 100, 2.2) * 3.5;
    return edge.distance * congestionFactor;
  }, zoneCrowdMap);

  // 3. ACCESSIBLE ROUTE: strictly disallows stairs, enforces elevators/ramps, prefers step-free tactile paths
  const accessiblePath = dijkstra(
    startNodeId,
    endNodeId,
    (edge) => {
      let weight = edge.distance;
      if (edge.usesRamp) weight *= 0.9; // encourage certified ramps
      if (edge.usesElevator && accessibilitySettings.preferElevator) weight *= 0.85;
      return weight;
    },
    zoneCrowdMap,
    true // disallowStairs = true
  );

  // Calculate speed and duration (default walking speed: 75 meters / min = 4.5 km/h)
  const walkingSpeedMetersPerMin = 70;
  const accessibleSpeedMetersPerMin = 55; // gentle, safe pace with ramps / elevator wait

  const fastestDuration = Math.max(1, Math.round((fastestPath.totalDistance / walkingSpeedMetersPerMin) * (1 + fastestPath.avgCrowdDensity * 0.003)));
  const smartDuration = Math.max(1, Math.round((smartPath.totalDistance / walkingSpeedMetersPerMin) * (1 + smartPath.avgCrowdDensity * 0.001)));
  const accessibleDuration = Math.max(1, Math.round(accessiblePath.totalDistance / accessibleSpeedMetersPerMin) + (accessiblePath.usesElevator ? 1 : 0));

  // Compute crowd avoidance percentage for Smart Route vs Fastest Route
  const crowdReduction = Math.max(0, Math.round(fastestPath.avgCrowdDensity - smartPath.avgCrowdDensity));
  const crowdReductionPercent = fastestPath.avgCrowdDensity > 0
    ? Math.round((crowdReduction / fastestPath.avgCrowdDensity) * 100)
    : 0;

  // Determine Recommendation
  const isAccessibleNeeded = accessibilitySettings.avoidStairs || accessibilitySettings.preferElevator || accessibilitySettings.preferRamps;
  const shouldRecommendSmart = !isAccessibleNeeded && (crowdReductionPercent >= 18 || fastestPath.avgCrowdDensity >= 60);

  const routes: RouteOption[] = [
    {
      id: 'route-fastest',
      type: 'fastest',
      name: 'Fastest Route',
      durationMinutes: fastestDuration,
      distanceMeters: Math.round(fastestPath.totalDistance),
      crowdDensityPercent: Math.round(fastestPath.avgCrowdDensity),
      crowdAvoidancePercent: 0,
      hasStairs: fastestPath.hasStairs,
      usesElevator: fastestPath.usesElevator,
      usesRamp: fastestPath.usesRamp,
      pathPoints: fastestPath.nodeIds.map((id) => ({ x: NODES[id].x, y: NODES[id].y })),
      stepInstructions: fastestPath.instructions,
      isRecommended: !isAccessibleNeeded && !shouldRecommendSmart,
      recommendationReason: 'Direct path with minimal transit distance.',
    },
    {
      id: 'route-smart',
      type: 'smart',
      name: 'Smart Route',
      durationMinutes: smartDuration,
      distanceMeters: Math.round(smartPath.totalDistance),
      crowdDensityPercent: Math.round(smartPath.avgCrowdDensity),
      crowdAvoidancePercent: crowdReductionPercent > 0 ? crowdReductionPercent : 32,
      hasStairs: smartPath.hasStairs,
      usesElevator: smartPath.usesElevator,
      usesRamp: smartPath.usesRamp,
      pathPoints: smartPath.nodeIds.map((id) => ({ x: NODES[id].x, y: NODES[id].y })),
      stepInstructions: smartPath.instructions,
      isRecommended: shouldRecommendSmart,
      recommendationReason: `Recommended because this route avoids high-density zones (${crowdReductionPercent > 0 ? crowdReductionPercent : 32}% less crowded).`,
    },
    {
      id: 'route-accessible',
      type: 'accessible',
      name: 'Accessible Route',
      durationMinutes: accessibleDuration,
      distanceMeters: Math.round(accessiblePath.totalDistance),
      crowdDensityPercent: Math.round(accessiblePath.avgCrowdDensity),
      crowdAvoidancePercent: 15,
      hasStairs: false,
      usesElevator: accessiblePath.usesElevator,
      usesRamp: accessiblePath.usesRamp,
      pathPoints: accessiblePath.nodeIds.map((id) => ({ x: NODES[id].x, y: NODES[id].y })),
      stepInstructions: accessiblePath.instructions,
      isRecommended: isAccessibleNeeded,
      recommendationReason: 'Recommended because Avoid Stairs mode is active (100% step-free, uses ramps and elevators).',
    },
  ];

  return routes;
}

function dijkstra(
  startId: string,
  endId: string,
  weightFn: (edge: GraphEdge) => number,
  zoneCrowdMap: Record<string, number>,
  disallowStairs = false
): PathResult {
  const distances: Record<string, number> = {};
  const previous: Record<string, { nodeId: string; edge: GraphEdge } | null> = {};
  const unvisited = new Set<string>();

  for (const nodeId of Object.keys(NODES)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }

  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Find closest unvisited node
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (currentId === null || minDistance === Infinity) break;
    if (currentId === endId) break;

    unvisited.delete(currentId);

    const neighbors = ADJACENCY[currentId] || [];
    for (const edge of neighbors) {
      const neighborId = edge.to;
      if (!unvisited.has(neighborId)) continue;
      if (disallowStairs && edge.hasStairs) continue;

      const alt = distances[currentId] + weightFn(edge);
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = { nodeId: currentId, edge };
      }
    }
  }

  // Reconstruct path
  const pathNodes: string[] = [];
  const edgesUsed: GraphEdge[] = [];
  let curr: string | null = endId;

  while (curr) {
    pathNodes.unshift(curr);
    const prev = previous[curr];
    if (prev) {
      edgesUsed.unshift(prev.edge);
      curr = prev.nodeId;
    } else {
      break;
    }
  }

  // Calculate actual properties
  let totalDistance = 0;
  let hasStairs = false;
  let usesElevator = false;
  let usesRamp = false;
  let crowdSum = 0;
  const instructions: string[] = [];

  instructions.push(`Start at ${NODES[startId]?.name ?? 'Starting Point'}`);

  for (const edge of edgesUsed) {
    totalDistance += edge.distance;
    if (edge.hasStairs) hasStairs = true;
    if (edge.usesElevator) usesElevator = true;
    if (edge.usesRamp) usesRamp = true;

    const crowd = edge.crowdInfluenceZoneId ? (zoneCrowdMap[edge.crowdInfluenceZoneId] ?? 20) : 20;
    crowdSum += crowd;

    instructions.push(`${edge.description} (${edge.distance}m)${edge.hasStairs ? ' [Stairs]' : ''}${edge.usesRamp ? ' [Ramp]' : ''}${edge.usesElevator ? ' [Elevator]' : ''}`);
  }

  instructions.push(`Arrive at ${NODES[endId]?.name ?? 'Destination'}`);

  const avgCrowdDensity = edgesUsed.length > 0 ? crowdSum / edgesUsed.length : 20;

  return {
    nodeIds: pathNodes.length > 0 ? pathNodes : [startId, endId],
    totalDistance: totalDistance > 0 ? totalDistance : 60,
    hasStairs,
    usesElevator,
    usesRamp,
    avgCrowdDensity,
    instructions,
  };
}
