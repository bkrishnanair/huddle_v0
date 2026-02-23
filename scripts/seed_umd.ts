import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, GeoPoint } from 'firebase-admin/firestore';
import * as geofire from 'geofire-common';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
    initializeApp({
        credential: cert({ projectId, clientEmail, privateKey })
    });
}

const db = getFirestore();
const auth = getAuth();

const umdLocations = [
    { name: "McKeldin Library", location: "UMD McKeldin", lat: 38.9859, lng: -76.9451, category: "Learning", event: "Late Night Study Session" },
    { name: "Iribe Center", location: "UMD Iribe", lat: 38.9904, lng: -76.9366, category: "Tech", event: "CMSC Project Meetup" },
    { name: "Eppley Recreation Center", location: "UMD Eppley", lat: 38.9937, lng: -76.9472, category: "Sports", event: "Intramural Volleyball" },
    { name: "Stamp Student Union", location: "UMD Stamp", lat: 38.9881, lng: -76.9447, category: "Food & Drink", event: "Coffee Chat at Stamp" },
    { name: "SECU Stadium", location: "Maryland Stadium", lat: 38.9903, lng: -76.9472, category: "Sports", event: "Flag Football Scrimmage" },
    { name: "Xfinity Center", location: "UMD Xfinity", lat: 38.9959, lng: -76.9416, category: "Sports", event: "Basketball Pickup Game" },
    { name: "Hornbake Plaza", location: "UMD Hornbake", lat: 38.9877, lng: -76.9427, category: "Community", event: "Outdoor Board Games" },
    { name: "Tawes Hall", location: "UMD Tawes", lat: 38.9886, lng: -76.9473, category: "Arts & Culture", event: "Poetry Open Mic" },
    { name: "Clark Hall", location: "UMD Engineering", lat: 38.9892, lng: -76.9365, category: "Tech", event: "Robotics Build Night" },
    { name: "Regents Drive Garage", location: "Regents Drive", lat: 38.9898, lng: -76.9416, category: "Community", event: "Car Enthusiast Meetup" },
    { name: "The Clarice Smith Performing Arts Center", location: "The Clarice", lat: 38.9912, lng: -76.9515, category: "Arts & Culture", event: "Classical Music Listen-In" },
    { name: "Discovery District", location: "Greater CP", lat: 38.9845, lng: -76.9284, category: "Tech", event: "Startup Pitch Deck Polish" },
    { name: "Vigilante Coffee", location: "College Park", lat: 38.9917, lng: -76.9338, category: "Food & Drink", event: "AeroPress Workshop" },
    { name: "Looney's Pub", location: "Route 1", lat: 38.9919, lng: -76.9339, category: "Food & Drink", event: "UMD Trivia Night" },
    { name: "The Varsity", location: "Route 1", lat: 38.9922, lng: -76.9331, category: "Community", event: "Apartment Game Night" },
    { name: "McKeldin Mall", location: "UMD Mall", lat: 38.9859, lng: -76.9418, category: "Community", event: "Frisbee on the Mall" },
    { name: "Washington Quad", location: "South Campus", lat: 38.9834, lng: -76.9425, category: "Community", event: "Hammock & Chill" },
    { name: "Nyumburu Cultural Center", location: "UMD Nyumburu", lat: 38.9873, lng: -76.9442, category: "Community", event: "Cultural Dialogue Series" },
    { name: "University View", location: "Route 1", lat: 38.9934, lng: -76.9328, category: "Community", event: "Poolside Meetup" },
    { name: "Lush Lab", location: "Iribe Center", lat: 38.9904, lng: -76.9366, category: "Learning", event: "VR Research Workshop" }
];

async function seed() {
    try {
        const userRecord = await auth.getUserByEmail('bk@email.com');
        const uid = userRecord.uid;
        const dbUser = await db.collection('users').doc(uid).get();
        const userData = dbUser.data() || {};
        const userName = userData.displayName || userData.name || "BK";

        console.log(`Authenticated as ${userName} (${uid})`);

        for (const loc of umdLocations) {
            // Adding some minor random variance to coordinates to spread them out slightly even if at same building
            const lat = loc.lat + (Math.random() * 0.001 - 0.0005);
            const lng = loc.lng + (Math.random() * 0.001 - 0.0005);
            const geohash = geofire.geohashForLocation([lat, lng]);

            // Future dates only
            const dateStr = new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const timeStr = `${Math.floor(Math.random() * 12 + 10).toString().padStart(2, '0')}:00`;

            const eventData = {
                name: loc.event,
                title: loc.event,
                category: loc.category,
                sport: loc.category,
                location: loc.name,
                venue: loc.name,
                maxPlayers: Math.floor(Math.random() * 15) + 5,
                currentPlayers: 1,
                description: `Join us for ${loc.event} at ${loc.name}. Very UMD vibes. Go Terps!`,
                createdBy: uid,
                organizerName: userName,
                players: [uid],
                geopoint: new GeoPoint(lat, lng),
                geohash,
                date: dateStr,
                time: timeStr,
                createdAt: Timestamp.now(),
                isPrivate: false,
            };

            await db.collection('events').add(eventData);
            console.log(`Created: ${loc.event} at ${loc.name}`);
        }

        console.log("UMD Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding UMD data:", error);
        process.exit(1);
    }
}

seed();
