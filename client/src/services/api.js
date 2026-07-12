// Central place for all backend calls.
import { mockRoadmap } from '../data/mockRoadmap';

// USE_MOCK toggles the whole app's data source. When true, every function
// below returns canned mock data (no server needed) — useful for frontend
// work offline. When false, all calls hit the real backend at BASE_URL, which
// must be running separately.
const USE_MOCK = false;
const BASE_URL = 'http://localhost:5000';

// Sends the user's chat answer to the AI, gets back their generated roadmap.
// Real endpoint: POST /api/onboarding  { userResponse: "..." }
export async function generateRoadmap(userInput) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(mockRoadmap), 1500));
  }
  const res = await fetch(`${BASE_URL}/api/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userResponse: userInput }),
  });

  // Parse defensively: an error status can return a non-JSON body, which would
  // otherwise throw an opaque SyntaxError here.
  const data = await res.json().catch(() => null);

  // On any error status the backend sends { error: "..." } with no timeline.
  // Without this guard that body flows into App/Timeline as the "roadmap" and
  // crashes at roadmap.timeline.junior. Throw instead so ChatWidget can catch
  // it and show a message rather than white-screening.
  if (!res.ok) {
    throw new Error(data?.error || `Failed to build roadmap (HTTP ${res.status})`);
  }
  return data;
}

// Registers a new user and attaches their guest roadmap to the new account.
// Real endpoint: POST /api/auth/register
export async function registerUser(name, email, password, roadmapData) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ token: 'fake-jwt-token' }), 800));
  }
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, roadmapData }),
  });
  return res.json();
}

// Logs an existing user back in — lower priority than guest→register flow,
// build this once the core MVP path works end to end.
// Real endpoint: POST /api/auth/login
export async function loginUser(email, password) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ token: 'fake-jwt-token' }), 800));
  }
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Fetches a logged-in user's saved roadmap using their JWT from login.
// Real endpoint: GET /api/roadmap/:userId (needs Authorization header)
export async function getRoadmap(userId, token) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve(mockRoadmap), 800));
  }
  const res = await fetch(`${BASE_URL}/api/roadmap/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Parse defensively: a non-2xx from a wrong route can return HTML, not JSON,
  // which would otherwise throw an opaque SyntaxError here.
  const data = await res.json().catch(() => null);

  // On any error status the backend sends { error: "..." } with no timeline.
  // Without this guard that body flows straight into Timeline and crashes at
  // roadmap.timeline.junior. Throw instead so the caller (LoginModal) catches
  // it and shows a proper "login failed" message rather than a white screen.
  if (!res.ok) {
    throw new Error(data?.error || `Failed to load roadmap (HTTP ${res.status})`);
  }
  return data;
}

// Marks one skill as mastered — a nice interactive touch letting users
// check off skills themselves. Stretch goal, not core MVP.
// Real endpoint: PATCH /api/roadmap/toggle-skill
export async function toggleSkill(userId, courseId, skillName, token) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 400));
  }
  const res = await fetch(`${BASE_URL}/api/roadmap/toggle-skill`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, courseId, skillName }),
  });
  return res.json();
}
