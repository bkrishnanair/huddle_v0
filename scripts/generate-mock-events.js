const fs = require('fs');

const events = [
  { name: "UMD Hackathon Brainstorm", cat: "Learning", loc: "Iribe Center", desc: "Brainstorming session for the upcoming hackathon. Pizza will be provided!" },
  { name: "Pickup Basketball 5v5", cat: "Sports", loc: "Eppley Recreation Center", desc: "Need 2 more for a full court run. Bringing my own ball." },
  { name: "Late Night Study Session", cat: "Learning", loc: "McKeldin Library", desc: "Grinding out CMSC 330 projects before the deadline." },
  { name: "Terps Game Watch Party", cat: "Community", loc: "Looney's Pub", desc: "Come watch the game with fellow Terps! Drink specials all night." },
  { name: "Midnight Soccer", cat: "Sports", loc: "Engineering Field", desc: "Casual 11v11 under the lights. All skill levels welcome." },
  { name: "Smash Bros Tournament", cat: "Gaming", loc: "Stamp Student Union", desc: "Weekly local. Bring your own controller if possible." },
  { name: "Resume Review Workshop", cat: "Learning", loc: "Career Center", desc: "Get your resume roasted by industry pros." },
  { name: "Photography Walk", cat: "Arts & Culture", loc: "McKeldin Mall", desc: "Golden hour photowalk around campus. Bring any camera!" },
  { name: "Acoustic Jam Session", cat: "Music", loc: "Washington Quad", desc: "Bring your acoustic instruments and chill." },
  { name: "Volleyball 6v6", cat: "Sports", loc: "La Plata Beach", desc: "Sand volleyball by the dorms." },
  { name: "Startup Pitch Practice", cat: "Business", loc: "Startup Shell", desc: "Practice your 3-minute pitches for the upcoming competition." },
  { name: "Yoga on the Mall", cat: "Outdoors", loc: "McKeldin Mall", desc: "Morning flow. Bring a mat or just use the grass." },
  { name: "Coffee & Code", cat: "Learning", loc: "Casey's Coffee", desc: "Working on side projects and drinking way too much espresso." },
  { name: "D&D One Shot", cat: "Gaming", loc: "Board and Brew", desc: "Looking for 4 adventurers for a quick 3-hour dungeon crawl." },
  { name: "Ultimate Frisbee Pickup", cat: "Sports", loc: "Fraternity Row Field", desc: "Cleats recommended, we're playing pretty competitive today." },
  { name: "Calculus 2 Group Tutoring", cat: "Learning", loc: "Math Building", desc: "Going over integration by parts." },
  { name: "Open Mic Night", cat: "Music", loc: "TerpZone", desc: "Signups start at 7:30. Singers, comedians, poets welcome." },
  { name: "Spikeball Tournament", cat: "Sports", loc: "Engineering Field", desc: "Bracket style. Losers buy ice cream." },
  { name: "Machine Learning Reading Group", cat: "Learning", loc: "Iribe Center", desc: "Discussing the new Attention paper." },
  { name: "Board Game Night", cat: "Community", loc: "Stamp Student Union", desc: "Catan, Ticket to Ride, and more." },
  { name: "Run Club: 5k Pace", cat: "Outdoors", loc: "Xfinity Center", desc: "Easy 5k loop around campus." },
  { name: "Thrifting Trip Group", cat: "Community", loc: "Route 1", desc: "Walking down to the local thrift spots." },
  { name: "Tennis Beginners", cat: "Sports", loc: "Eppley Tennis Courts", desc: "Just hitting around, no pressure." },
  { name: "Physics 161 Study Group", cat: "Learning", loc: "Toll Physics Building", desc: "Reviewing kinematics." },
  { name: "Meditation Circle", cat: "Outdoors", loc: "Memorial Chapel Garden", desc: "Guided 20-minute mindfulness session." },
  { name: "Flag Football", cat: "Sports", loc: "Washington Quad", desc: "7v7 touch, flags provided." },
  { name: "Debate Prep", cat: "Learning", loc: "Skinner Building", desc: "Mock debate rounds." },
  { name: "Food Truck Meetup", cat: "Food & Drink", loc: "Lot 1", desc: "Grabbing tacos before class." },
  { name: "Sketching at the Stamp", cat: "Arts & Culture", loc: "Stamp Student Union", desc: "Life drawing practice." },
  { name: "Pickleball Doubles", cat: "Sports", loc: "Eppley Recreation Center", desc: "Winner stays on court." },
  { name: "Blockchain Talk", cat: "Learning", loc: "Van Munching Hall", desc: "Guest speaker on Web3." },
  { name: "Dog Walking Pack", cat: "Outdoors", loc: "Lake Artemesia", desc: "Bring your pups!" },
  { name: "C++ Debugging Help", cat: "Learning", loc: "Iribe Ground Floor", desc: "I am losing my mind over segfaults. Help." },
  { name: "Trivia Night", cat: "Community", loc: "Looney's Pub", desc: "Forming a team of 6. Need a history buff!" },
  { name: "Sunrise Cycling", cat: "Outdoors", loc: "Paint Branch Trail", desc: "15-mile ride out and back." }
];

// College park bounds:
// Lat: 38.980 to 39.000
// Lng: -76.950 to -76.920

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

const mockEvents = events.map((ev, i) => {
  const lat = randRange(38.980, 38.995);
  const lng = randRange(-76.945, -76.925);

  // Create a realistic date between March 3rd and March 30th, 2026
  const marchDay = Math.floor(Math.random() * (30 - 3 + 1)) + 3;
  const dateStr = `2026-03-${marchDay.toString().padStart(2, '0')}`;

  // Create a realistic time between 10 AM and 10 PM
  const hour = Math.floor(randRange(10, 22));
  const minute = Math.random() > 0.5 ? '00' : '30';
  const timeStr = `${hour.toString().padStart(2, '0')}:${minute}`;

  return `{
    id: "mock-event-${i}",
    name: "${ev.name}",
    category: "${ev.cat}",
    date: "${dateStr}",
    time: "${timeStr}",
    location: "${ev.loc}",
    geopoint: {
      latitude: ${lat.toFixed(6)},
      longitude: ${lng.toFixed(6)},
    },
    description: "${ev.desc}",
    currentPlayers: ${Math.floor(randRange(2, 10))},
    maxPlayers: ${Math.floor(randRange(10, 30))},
    createdBy: "mock-user",
    organizerName: "UMD Community",
    isBoosted: ${Math.random() > 0.8 ? 'true' : 'false'},
  }`;
});

const fileContent = `import { GameEvent } from "./types"

/**
 * 35 Highly realistic mock events centered around the University of Maryland (UMD)
 * to showcase Huddle's Hyperlocal Discovery capabilities to unauthenticated users.
 */
export const MOCK_EVENTS = [
  ${mockEvents.join(",\n  ")}
];
`;

fs.writeFileSync('lib/mock-data.ts', fileContent);
console.log("Mock data generated!");
