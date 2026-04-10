import 'server-only';

/**
 * Serendipity Agent 2: REASON — Candidate Scorer
 * 
 * Scores each candidate user against an at-risk event using a 4-factor model:
 * 1. Interest Match (0-30 pts)
 * 2. Proximity (0-25 pts) 
 * 3. Social Proof (0-25 pts)
 * 4. Reliability (0-20 pts)
 */

interface CandidateScore {
  userId: string;
  displayName: string;
  score: number;
  factors: {
    interest: number;
    proximity: number;
    social: number;
    reliability: number;
  };
  reasons: string[]; // human-readable explanation for each factor
}

interface AtRiskEvent {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  players: string[];
  geopoint: { latitude: number; longitude: number };
}

interface CandidateUser {
  uid: string;
  displayName: string;
  favoriteSports?: string[];
  lastKnownLocation?: { latitude: number; longitude: number };
  // pre-computed
  followingIds?: string[];
  totalRsvps?: number;
  totalCheckIns?: number;
}

export function scoreCandidate(
  user: CandidateUser,
  event: AtRiskEvent,
  friendsAttending: string[]
): CandidateScore {
  const reasons: string[] = [];
  let interest = 0;
  let proximity = 0;
  let social = 0;
  let reliability = 0;

  // --- Factor 1: Interest Match (0-30) ---
  const userInterests = user.favoriteSports || [];
  if (userInterests.length === 0) {
    // No interests set = open to everything, partial score
    interest = 15;
    reasons.push('Open to all categories');
  } else if (userInterests.includes(event.category)) {
    interest = 30;
    reasons.push(`Interested in ${event.category}`);
  } else {
    // Check for related categories
    const relatedMap: Record<string, string[]> = {
      'Sports': ['Outdoors'],
      'Outdoors': ['Sports'],
      'Tech': ['Learning'],
      'Learning': ['Tech'],
      'Music': ['Arts & Culture'],
      'Arts & Culture': ['Music'],
      'Community': ['Food & Drink'],
      'Food & Drink': ['Community'],
    };
    const related = relatedMap[event.category] || [];
    const hasRelated = userInterests.some(i => related.includes(i));
    if (hasRelated) {
      interest = 18;
      reasons.push(`Related interest match for ${event.category}`);
    } else {
      interest = 0;
      reasons.push('No interest match');
    }
  }

  // --- Factor 2: Proximity (0-25) ---
  if (user.lastKnownLocation && event.geopoint) {
    const distMiles = haversineDistance(
      user.lastKnownLocation.latitude,
      user.lastKnownLocation.longitude,
      event.geopoint.latitude,
      event.geopoint.longitude
    );

    if (distMiles <= 1) {
      proximity = 25;
      reasons.push(`${distMiles.toFixed(1)}mi away (very close)`);
    } else if (distMiles <= 5) {
      proximity = 20;
      reasons.push(`${distMiles.toFixed(1)}mi away (nearby)`);
    } else if (distMiles <= 15) {
      proximity = 12;
      reasons.push(`${distMiles.toFixed(1)}mi away`);
    } else if (distMiles <= 25) {
      proximity = 5;
      reasons.push(`${distMiles.toFixed(1)}mi away (far)`);
    } else {
      proximity = 0;
      reasons.push(`${distMiles.toFixed(1)}mi away (too far)`);
    }
  } else {
    proximity = 10; // unknown location, give benefit of doubt
    reasons.push('Location unknown — default score');
  }

  // --- Factor 3: Social Proof (0-25) ---
  const friendCount = friendsAttending.length;
  if (friendCount >= 3) {
    social = 25;
    reasons.push(`${friendCount} friends attending`);
  } else if (friendCount === 2) {
    social = 20;
    reasons.push('2 friends attending');
  } else if (friendCount === 1) {
    social = 15;
    reasons.push(`1 friend attending (${friendsAttending[0]})`);
  } else {
    social = 0;
    reasons.push('No friends attending');
  }

  // --- Factor 4: Reliability (0-20) ---
  const totalRsvps = user.totalRsvps || 0;
  const totalCheckIns = user.totalCheckIns || 0;
  if (totalRsvps === 0) {
    reliability = 10; // new user, neutral
    reasons.push('New user — neutral reliability');
  } else {
    const showRate = totalCheckIns / totalRsvps;
    reliability = Math.round(showRate * 20);
    reasons.push(`${Math.round(showRate * 100)}% show rate (${totalCheckIns}/${totalRsvps})`);
  }

  const score = interest + proximity + social + reliability;

  return {
    userId: user.uid,
    displayName: user.displayName || 'Unknown',
    score,
    factors: { interest, proximity, social, reliability },
    reasons,
  };
}

export function scoreCandidates(
  users: CandidateUser[],
  event: AtRiskEvent,
  socialGraph: Map<string, string[]> // userId -> list of friend display names attending
): CandidateScore[] {
  return users
    .filter(u => !event.players.includes(u.uid)) // exclude already-attending
    .map(u => scoreCandidate(u, event, socialGraph.get(u.uid) || []))
    .filter(s => s.score >= 40) // only high-scoring candidates
    .sort((a, b) => b.score - a.score);
}

// Haversine distance in miles
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type { CandidateScore, AtRiskEvent, CandidateUser };
