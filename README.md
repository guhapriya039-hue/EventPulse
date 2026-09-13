# EventPulse – Smart Event Experience

> Know where to go. Know what’s next. Stay safe.

EventPulse is a smart event companion built to make large events easier to navigate, safer, and more accessible.

At large events, people often struggle to find the right hall, deal with crowded areas, keep track of last-minute announcements, or quickly get help when they need it. EventPulse brings these needs together in one simple platform.

## What EventPulse Does

### 🗺️ Smart Navigation
Find stages, workshops, food courts, restrooms, help desks, first aid, security and other important locations through an interactive event map.

### 👥 Crowd-Aware Routes
Instead of always choosing the shortest route, EventPulse can suggest a route that avoids crowded areas.

For example:

**Fastest Route:** 4 min  
**Smart Route:** 5 min — 32% less crowded

### ♿ Accessibility
Attendees can choose preferences such as:

- Avoid stairs
- Prefer ramps
- Prefer elevators
- Accessible routes
- Accessible restrooms
- Large text
- High contrast
- Reduced motion

The route recommendation changes based on these preferences.

### 🤖 EventPulse AI
The AI assistant helps attendees decide what to do based on the event schedule, location, available time, interests, crowd levels and accessibility needs.

For example:

> “I have 30 minutes. What should I attend?”

The assistant can recommend a suitable session and provide the route to it.

### 🔔 Live Updates
Important announcements such as venue changes, session changes and crowd warnings can be shown directly to attendees.

### 🚨 SOS Assistance
Attendees can request medical, security or general assistance and see nearby help points.

For this prototype, emergency requests are simulated and shown on the organizer dashboard.

### 🎯 Personalized Recommendations
EventPulse recommends sessions based on attendee interests, timing, location and crowd conditions.

### 🎛️ Organizer Dashboard
Organizers can monitor crowd levels, publish announcements, manage sessions and respond to assistance requests.

---

## How It Solves the Problem

| Event Problem | EventPulse |
|---|---|
| Difficult navigation | Interactive map and smart routes |
| Overcrowding | Crowd-aware routing |
| Accessibility barriers | Accessible route options |
| Missed announcements | Live updates |
| Difficult emergency access | SOS assistance |
| Too many sessions to choose from | AI recommendations |
| Limited organizer visibility | Organizer dashboard |

---

## A Simple Demo Flow

The main demo shows how the different parts work together:

1. An attendee selects a workshop.
2. EventPulse checks the available routes and crowd levels.
3. It recommends a less crowded route.
4. The attendee enables **Avoid Stairs** and gets an accessible route.
5. The attendee asks the AI what to attend next.
6. An organizer publishes a session-change announcement.
7. The attendee receives the update.
8. An SOS request is sent to the organizer dashboard.

This shows how EventPulse connects navigation, accessibility, AI, communication and safety in one experience.

---

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- Gemini
- Interactive venue mapping
- Responsive web design

---

## Accessibility

Accessibility is built into the experience rather than treated as an extra feature.

The application includes keyboard-friendly navigation, semantic structure, accessible labels, high contrast, large text, reduced motion and accessibility-aware routing.

---

## Security

- API keys are kept outside the source code
- Environment variables are used for sensitive configuration
- User input is validated
- External API failures are handled safely
- No credentials are committed to the repository

---

## Testing

Core functionality is tested, including:

- Route selection
- Accessible routing
- Session filtering
- Recommendations
- Search
- Announcements
- Emergency requests
- Crowd updates

---

## Project Structure

```text
src/
├── components/
├── pages/
├── features/
│   ├── navigation/
│   ├── crowd/
│   ├── accessibility/
│   ├── ai/
│   ├── emergency/
│   ├── announcements/
│   ├── schedule/
│   └── organizer/
├── services/
├── data/
├── types/
├── utils/
└── tests/
