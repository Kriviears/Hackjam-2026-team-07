// Central place for all backend calls. Switch USE_MOCK to false once
// Elvira's server is running locally so you can test against the real thing.
import { mockRoadmap } from '../data/mockRoadmap';

const USE_MOCK = true;
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
  return res.json();
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
  return res.json();
}

// Marks one skill as mastered — a nice interactive touch letting users
// check off skills themselves. Stretch goal, not core MVP.
// Real endpoint: PATCH /api/roadmap/toggle-skill
export async function toggleSkill(userId, skillName) {
  if (USE_MOCK) {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 400));
  }
  const res = await fetch(`${BASE_URL}/api/roadmap/toggle-skill`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, skillName }),
  });
  return res.json();
}
