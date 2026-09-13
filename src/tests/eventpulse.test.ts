import { describe, it, expect } from 'vitest';
import { computeRoutes } from '../features/navigation/routingEngine';
import { computeForYouRecommendations, computeWhatsNext } from '../features/recommendations/recommendationEngine';
import { searchGlobal } from '../features/search/searchEngine';
import { INITIAL_ZONES, INITIAL_SESSIONS, DEFAULT_ATTENDEE_PROFILE } from '../data/seedData';
import { AccessibilitySettings } from '../types';

describe('EventPulse Core Intelligence Test Suite', () => {
  describe('1. Crowd-Aware Routing Engine', () => {
    it('calculates Fastest, Smart, and Accessible routes for a destination', () => {
      const defaultA11y: AccessibilitySettings = {
        avoidStairs: false,
        preferElevator: false,
        preferRamps: false,
        accessibleRestroomFinder: false,
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        screenReaderOptimized: false,
      };

      const routes = computeRoutes('zone-main-entrance', 'zone-hall-b', INITIAL_ZONES, defaultA11y);

      expect(routes).toHaveLength(3);
      const fastest = routes.find((r) => r.type === 'fastest')!;
      const smart = routes.find((r) => r.type === 'smart')!;
      const accessible = routes.find((r) => r.type === 'accessible')!;

      expect(fastest).toBeDefined();
      expect(smart).toBeDefined();
      expect(accessible).toBeDefined();

      expect(fastest.durationMinutes).toBeGreaterThan(0);
      expect(smart.distanceMeters).toBeGreaterThan(0);
      expect(accessible.hasStairs).toBe(false);
    });

    it('recommends Accessible Route when Avoid Stairs = true', () => {
      const a11yAvoidStairs: AccessibilitySettings = {
        avoidStairs: true,
        preferElevator: true,
        preferRamps: true,
        accessibleRestroomFinder: false,
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        screenReaderOptimized: false,
      };

      const routes = computeRoutes('zone-main-entrance', 'zone-hall-b', INITIAL_ZONES, a11yAvoidStairs);
      const recommended = routes.find((r) => r.isRecommended);

      expect(recommended).toBeDefined();
      expect(recommended?.type).toBe('accessible');
      expect(recommended?.hasStairs).toBe(false);
      expect(recommended?.recommendationReason).toContain('Avoid Stairs mode is active');
    });

    it('adapts route recommendations when crowd level surges', () => {
      // Simulate extreme crowd surge in Hall A and Main Stage
      const congestedZones = INITIAL_ZONES.map((z) => {
        if (z.id === 'zone-hall-a' || z.id === 'zone-main-stage') {
          return { ...z, crowdLevel: 95 };
        }
        return z;
      });

      const normalA11y: AccessibilitySettings = {
        avoidStairs: false,
        preferElevator: false,
        preferRamps: false,
        accessibleRestroomFinder: false,
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        screenReaderOptimized: false,
      };

      const routes = computeRoutes('zone-main-entrance', 'zone-hall-b', congestedZones, normalA11y);
      const smartRoute = routes.find((r) => r.type === 'smart')!;

      // Smart route should avoid the high-density bottleneck
      expect(smartRoute.crowdAvoidancePercent).toBeGreaterThan(15);
      expect(routes.some((r) => r.isRecommended)).toBe(true);
    });
  });

  describe('2. Recommendations & What\'s Next Intelligence', () => {
    it('scores and ranks sessions matching attendee interests higher', () => {
      const profile = {
        ...DEFAULT_ATTENDEE_PROFILE,
        interests: ['AI'],
      };

      const recommendations = computeForYouRecommendations(INITIAL_SESSIONS, INITIAL_ZONES, profile);
      expect(recommendations.length).toBeGreaterThan(0);

      const topRec = recommendations[0];
      expect(topRec.matchReasons.some((r) => r.toLowerCase().includes('ai'))).toBe(true);
      expect(topRec.score).toBeGreaterThan(50);
    });

    it('computes realistic available time window and suggestions', () => {
      const profile = {
        ...DEFAULT_ATTENDEE_PROFILE,
        savedSessionIds: ['sess-cyber-quantum'], // starts at 15:00 (900 min)
      };

      const whatsNext = computeWhatsNext(INITIAL_SESSIONS, INITIAL_ZONES, profile, 840); // 14:00 (840 min)
      expect(whatsNext.minutesAvailable).toBe(60); // 900 - 840 = 60 minutes
      expect(whatsNext.opportunities.length).toBeGreaterThan(0);

      // Should suggest low crowd food and quick drop-in sessions
      const hasFood = whatsNext.opportunities.some((o) => o.type === 'food');
      expect(hasFood).toBe(true);
    });
  });

  describe('3. Global Search Engine', () => {
    it('finds sessions by speaker and keyword', () => {
      const results = searchGlobal('Microservice', INITIAL_SESSIONS, INITIAL_ZONES);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('session');
    });

    it('finds facilities when searching for restrooms and medical', () => {
      const wcResults = searchGlobal('restroom', INITIAL_SESSIONS, INITIAL_ZONES);
      expect(wcResults.length).toBeGreaterThan(0);

      const aidResults = searchGlobal('first aid', INITIAL_SESSIONS, INITIAL_ZONES);
      expect(aidResults.length).toBeGreaterThan(0);
    });
  });

  describe('4. Accessibility Mode Behavior', () => {
    it('flags accessible single-occupancy restrooms with step-free features', () => {
      const accRestroom = INITIAL_ZONES.find((z) => z.id === 'zone-accessible-restroom');
      expect(accRestroom).toBeDefined();
      expect(accRestroom?.accessibility.hasRamp).toBe(true);
      expect(accRestroom?.facilities).toContain('Emergency Alarm Cord');
    });
  });
});
