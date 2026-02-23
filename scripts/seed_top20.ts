

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

const universities = [
    { name: "Princeton University", location: "Princeton, NJ", lat: 40.3439, lng: -74.6514 },
    { name: "MIT", location: "Cambridge, MA", lat: 42.3601, lng: -71.0942 },
    { name: "Harvard University", location: "Cambridge, MA", lat: 42.3770, lng: -71.1167 },
    { name: "Stanford University", location: "Stanford, CA", lat: 37.4275, lng: -122.1697 },
    { name: "Yale University", location: "New Haven, CT", lat: 41.3163, lng: -72.9223 },
    { name: "University of Chicago", location: "Chicago, IL", lat: 41.7886, lng: -87.5987 },
    { name: "Johns Hopkins University", location: "Baltimore, MD", lat: 39.3299, lng: -76.6205 },
    { name: "University of Pennsylvania", location: "Philadelphia, PA", lat: 39.9522, lng: -75.1932 },
    { name: "Caltech", location: "Pasadena, CA", lat: 34.1377, lng: -118.1253 },
    { name: "Duke University", location: "Durham, NC", lat: 36.0014, lng: -78.9382 },
    { name: "Northwestern University", location: "Evanston, IL", lat: 42.0565, lng: -87.6753 },
    { name: "Dartmouth College", location: "Hanover, NH", lat: 43.7044, lng: -72.2887 },
    { name: "Brown University", location: "Providence, RI", lat: 41.8268, lng: -71.4025 },
    { name: "Vanderbilt University", location: "Nashville, TN", lat: 36.1447, lng: -86.8027 },
    { name: "Rice University", location: "Houston, TX", lat: 29.7174, lng: -95.4018 },
    { name: "Washington University in St. Louis", location: "St. Louis, MO", lat: 38.6488, lng: -90.3108 },
    { name: "Cornell University", location: "Ithaca, NY", lat: 42.4534, lng: -76.4735 },
    { name: "Columbia University", location: "New York, NY", lat: 40.8075, lng: -73.9626 },
    { name: "University of Notre Dame", location: "Notre Dame, IN", lat: 41.7056, lng: -86.2353 },
    { name: "UC Berkeley", location: "Berkeley, CA", lat: 37.8715, lng: -122.2730 }
];

async function seed() {
    try {
        const userRecord = await auth.getUserByEmail('bk@email.com');
        const uid = userRecord.uid;
        const dbUser = await db.collection('users').doc(uid).get();
        const userData = dbUser.data() || {};
        const userName = userData.displayName || userData.name || "BK";

        console.log(`Authenticated as ${userName} (${uid})`);

        const categories = ['Sports', 'Music', 'Community', 'Tech', 'Learning', 'Food & Drink'];

        for (const uni of universities) {
            const lat = uni.lat + (Math.random() * 0.01 - 0.005);
            const lng = uni.lng + (Math.random() * 0.01 - 0.005);
            const geohash = geofire.geohashForLocation([lat, lng]);

            const dateStr = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const timeStr = `${Math.floor(Math.random() * 12 + 8).toString().padStart(2, '0')}:00`;
            const category = categories[Math.floor(Math.random() * categories.length)];

            const event = {
                name: `Pickup ${category} at ${uni.name}`,
                title: `Pickup ${category} at ${uni.name}`,
                category: category,
                sport: category, // For schema compatibility
                location: uni.location,
                maxPlayers: Math.floor(Math.random() * 20) + 10,
                currentPlayers: 1,
                description: `Come join us for a great time at ${uni.name} campus! Let's build community.`,
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

            await db.collection('events').add(event);
            console.log(`Created event at ${uni.name}`);
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seed();
