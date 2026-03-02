import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp, GeoPoint } from 'firebase-admin/firestore';
import * as geofire from 'geofire-common';
import * as fs from 'fs';
import * as path from 'path';

// Manual env loading for scripts
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [key, ...value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.join('=').trim().replace(/^"(.*)"$/, '$1');
                }
            }
        });
    }
}

loadEnv();

if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log("Seed Script Config:", {
        projectId: projectId ? "SET" : "MISSING",
        clientEmail: clientEmail ? "SET" : "MISSING",
        privateKey: privateKey ? "SET" : "MISSING"
    });

    if (!projectId) {
        console.error("FIREBASE_PROJECT_ID not set! Check .env.local");
        process.exit(1);
    }

    initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey
        } as any)
    });
}



const db = getFirestore();
const auth = getAuth();

const umdLocations = [
    { name: "Van Munching Hall Room 1335", location: "Van Munching Hall Room 1335", lat: 38.9871, lng: -76.9457, category: "Tech", event: "MCB Real Estate – Development and Acquisition", dateStr: "2026-03-02", timeStr: "17:00", organization: "The Real Estate Club" },
    { name: "Colony Ballroom, STAMP", location: "Colony Ballroom, STAMP", lat: 38.9924, lng: -76.9410, category: "Food & Drink", event: "Iftar at Stamp – Free!", dateStr: "2026-03-02", timeStr: "17:30", organization: "Hosted by 2 organizations" },
    { name: "Room 1303", location: "Room 1303", lat: 38.9920, lng: -76.9470, category: "Learning", event: "Guest Speaker Event", dateStr: "2026-03-03", timeStr: "18:00", organization: "Collegiate Financial Management Association" },
    { name: "McKeldin Library 4123", location: "McKeldin Library 4123", lat: 38.9887, lng: -76.9473, category: "Sports", event: "Restorative Rest Session: Yoga", dateStr: "2026-03-04", timeStr: "11:00", organization: "Hosted by 2 organizations" },
    { name: "STAMP Student Engagement Suite", location: "STAMP Student Engagement Suite", lat: 38.9924, lng: -76.9459, category: "Learning", event: "Snack and Study", dateStr: "2026-03-04", timeStr: "13:00", organization: "Hosted by 3 organizations" },
    { name: "St. Mary’s Hall Multipurpose Room", location: "St. Mary’s Hall Multipurpose Room", lat: 38.9917, lng: -76.9478, category: "Food & Drink", event: "Tea Club Meeting", dateStr: "2026-03-04", timeStr: "17:00", organization: "Tea Club at UMD" },
    { name: "STAMP Juan Jimenez Room", location: "STAMP Juan Jimenez Room", lat: 38.9834, lng: -76.9410, category: "Learning", event: "Lunch and Learn: Job & Internship Search Strategies", dateStr: "2026-03-05", timeStr: "12:00", organization: "Hosted by 2 organizations" },
    { name: "University Health Center", location: "University Health Center", lat: 38.9836, lng: -76.9409, category: "Food & Drink", event: "Recovery Brunch", dateStr: "2026-03-06", timeStr: "11:00", organization: "Hosted by 2 organizations" },
    { name: "STAMP Student Union", location: "STAMP Student Union", lat: 38.9842, lng: -76.9469, category: "Food & Drink", event: "Coffee @ UMD — Social", dateStr: "2026-03-06", timeStr: "14:00", organization: "Coffee @ UMD" },
    { name: "Van Munching Hall Room 1335", location: "Van Munching Hall Room 1335", lat: 38.9871, lng: -76.9409, category: "Tech", event: "Argus Workshop with Connor Lenox", dateStr: "2026-03-09", timeStr: "17:00", organization: "The Real Estate Club" },
    { name: "Stamp Student Union (room emailed to registrants)", location: "Stamp Student Union (room emailed to registrants)", lat: 38.9923, lng: -76.9448, category: "Learning", event: "GRadulting: From No Credit to Great Credit Score", dateStr: "2026-03-10", timeStr: "12:30", organization: "Graduate Student Legal Aid" },
    { name: "In‑Person (Exact Space TBA)", location: "In‑Person (Exact Space TBA)", lat: 38.9929, lng: -76.9426, category: "Community", event: "New Student Mixer: No Small Talk Required", dateStr: "2026-03-10", timeStr: "17:00", organization: "STRONG Connections" },
    { name: "Room 1303", location: "Room 1303", lat: 38.9922, lng: -76.9445, category: "Learning", event: "Personal Finance Foundations — Budgets & Balance", dateStr: "2026-03-10", timeStr: "18:00", organization: "Collegiate Financial Management Association" },
    { name: "STAMP Atrium", location: "STAMP Atrium", lat: 38.9900, lng: -76.9432, category: "Community", event: "Good Morning, Commuters!", dateStr: "2026-03-11", timeStr: "09:00", organization: "Hosted by 2 organizations" },
    { name: "STAMP Atrium", location: "STAMP Atrium", lat: 38.9915, lng: -76.9408, category: "Community", event: "(duplicate listing) Good Morning, Commuters!", dateStr: "2026-03-11", timeStr: "09:00", organization: "Hosted by 2 organizations" },
    { name: "Lee Building (2124)", location: "Lee Building (2124)", lat: 38.9913, lng: -76.9411, category: "Learning", event: "Wellness Course: Academic Wellness Session 1", dateStr: "2026-03-11", timeStr: "12:00", organization: "Graduate Pathways" },
    { name: "The Vista — The Unity Center", location: "The Vista — The Unity Center", lat: 38.9861, lng: -76.9426, category: "Learning", event: "Leadership Lunch: Neurodivergent Women & Leadership", dateStr: "2026-03-11", timeStr: "12:00", organization: "Leadership & Community Service‑Learning" },
    { name: "Grand Ballroom Lounge, STAMP", location: "Grand Ballroom Lounge, STAMP", lat: 38.9899, lng: -76.9415, category: "Learning", event: "Free Iftar & Late‑Night Study Zone at Stamp", dateStr: "2026-03-11", timeStr: "18:30", organization: "Memorial Chapel" },
    { name: "3112 Marie Mount Hall", location: "3112 Marie Mount Hall", lat: 38.9875, lng: -76.9430, category: "Food & Drink", event: "Nestlé Guest Speaker & Chocolate Tasting", dateStr: "2026-03-12", timeStr: "17:00", organization: "Food Science Club" },
    { name: "STAMP Student Union", location: "STAMP Student Union", lat: 38.9921, lng: -76.9439, category: "Food & Drink", event: "Coffee @ UMD — Social", dateStr: "2026-03-13", timeStr: "14:00", organization: "Coffee @ UMD" },
    { name: "STAMP Student Union", location: "STAMP Student Union", lat: 38.9879, lng: -76.9420, category: "Food & Drink", event: "Coffee @ UMD — Social", dateStr: "2026-03-20", timeStr: "14:00", organization: "Coffee @ UMD" },
    { name: "Van Munching Hall Room 1335", location: "Van Munching Hall Room 1335", lat: 38.9846, lng: -76.9404, category: "Tech", event: "Real Estate 101 with John Newman", dateStr: "2026-03-23", timeStr: "17:00", organization: "The Real Estate Club" },
    { name: "Lee Building (2124)", location: "Lee Building (2124)", lat: 38.9923, lng: -76.9454, category: "Learning", event: "Wellness Course: Academic Wellness Session Two", dateStr: "2026-03-25", timeStr: "12:00", organization: "Graduate Pathways" },
    { name: "St. Mary’s Hall Multipurpose Room", location: "St. Mary’s Hall Multipurpose Room", lat: 38.9879, lng: -76.9477, category: "Food & Drink", event: "Tea Club Meeting", dateStr: "2026-03-25", timeStr: "17:00", organization: "Tea Club at UMD" },
    { name: "VMH 1335", location: "VMH 1335", lat: 38.9915, lng: -76.9409, category: "Community", event: "BBB General Body Meeting", dateStr: "2026-03-25", timeStr: "19:00", organization: "Business Beyond Borders" },
    { name: "UHC Ground Floor Drop‑in Space", location: "UHC Ground Floor Drop‑in Space", lat: 38.9835, lng: -76.9477, category: "Food & Drink", event: "Tea with TFR", dateStr: "2026-03-26", timeStr: "10:00", organization: "Hosted by 2 organizations" },
    { name: "STAMP Student Union", location: "STAMP Student Union", lat: 38.9929, lng: -76.9487, category: "Food & Drink", event: "Coffee @ UMD — Social", dateStr: "2026-03-27", timeStr: "14:00", organization: "Coffee @ UMD" },
    { name: "Thurgood Marshall Hall (Atrium)", location: "Thurgood Marshall Hall (Atrium)", lat: 38.9835, lng: -76.9422, category: "Community", event: "Eat, Grow & Learn: Connecting with Alum", dateStr: "2026-03-27", timeStr: "18:30", organization: "Graduate Pathways" },
    { name: "Stamp Student Union (room emailed to registrants)", location: "Stamp Student Union (room emailed to registrants)", lat: 38.9903, lng: -76.9474, category: "Learning", event: "GRadulting: Why Create a Will & Estate Plan Now?", dateStr: "2026-03-31", timeStr: "12:30", organization: "Graduate Student Legal Aid" }
];

async function seed() {
    try {
        const userRecord = await auth.getUserByEmail('bk@email.com');
        const uid = userRecord.uid;
        const dbUser = await db.collection('users').doc(uid).get();
        const userData = dbUser.data() || {};
        const userName = userData.displayName || userData.name || "BK";

        console.log(`Authenticated as ${userName} (${uid})`);

        // Cleanup: Remove existing seed events from this user to prevent duplicates
        const existingEvents = await db.collection('events').where('createdBy', '==', uid).get();
        if (!existingEvents.empty) {
            console.log(`Cleaning up ${existingEvents.size} existing seed events...`);
            const batch = db.batch();
            existingEvents.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        for (const loc of umdLocations) {
            // Adding some minor random variance to coordinates to spread them out slightly even if at same building
            const lat = loc.lat + (Math.random() * 0.001 - 0.0005);
            const lng = loc.lng + (Math.random() * 0.001 - 0.0005);
            const geohash = geofire.geohashForLocation([lat, lng]);

            const eventData = {
                name: loc.event,
                title: loc.event,
                category: loc.category,
                sport: loc.category,
                location: loc.name,
                venue: loc.name,
                maxPlayers: Math.floor(Math.random() * 15) + 5,
                currentPlayers: 1,
                description: `Join us for ${loc.event} at ${loc.name}. Hosted by ${loc.organization}. Go Terps!`,
                createdBy: uid,
                organizerName: loc.organization || userName,
                players: [uid],
                geopoint: new GeoPoint(lat, lng),
                geohash,
                date: loc.dateStr,
                time: loc.timeStr,
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

/*
*NOTE: if any of the details are missing you can add it yourself*
*for example if the end time of the event is missing keep it as 3 hours*
*if the organization is missing keep it as "Huddle" or "UMD"*
*if the location is missing keep it as "UMD"*
*if the venue is missing keep it as "UMD"*
*if the category is missing keep it as "Community"*
*if the sport is missing keep it as "Community"*
*if the description is missing keep it as "Join us for [event] at [location]. Go Terps!"*

MARCH EVENTS

Mon, Mar 2


MCB Real Estate – Development and Acquisition
5:00 PM EST · Van Munching Hall Room 1335
The Real Estate Club


Iftar at Stamp – Free!
5:30 PM EST · Colony Ballroom, STAMP
Hosted by 2 organizations



Tue, Mar 3

Guest Speaker Event
6:00 PM EST · Room 1303
Collegiate Financial Management Association


Wed, Mar 4


Restorative Rest Session: Yoga
11:00 AM EST · McKeldin Library 4123
Hosted by 2 organizations


Snack and Study
1:00 PM EST · STAMP Student Engagement Suite
Hosted by 3 organizations


Tea Club Meeting
5:00 PM EST · St. Mary’s Hall Multipurpose Room
Tea Club at UMD



Thu, Mar 5

Lunch and Learn: Job & Internship Search Strategies
12:00 PM EST · STAMP Juan Jimenez Room
Hosted by 2 organizations


Fri, Mar 6


Recovery Brunch
11:00 AM EST · University Health Center
Hosted by 2 organizations


Coffee @ UMD — Social
2:00 PM EST · STAMP Student Union
Coffee @ UMD



Mon, Mar 9

Argus Workshop with Connor Lenox
5:00 PM EDT · Van Munching Hall Room 1335
The Real Estate Club


Tue, Mar 10


GRadulting: From No Credit to Great Credit Score
12:30 PM EDT · Stamp Student Union (room emailed to registrants)
Graduate Student Legal Aid


New Student Mixer: No Small Talk Required
5:00 PM EDT · In‑Person (Exact Space TBA)
STRONG Connections


Personal Finance Foundations — Budgets & Balance
6:00 PM EDT · Room 1303
Collegiate Financial Management Association



Wed, Mar 11


Good Morning, Commuters!
9:00 AM EDT · STAMP Atrium
Hosted by 2 organizations


(duplicate listing) Good Morning, Commuters!
9:00 AM EDT · STAMP Atrium
Hosted by 2 organizations


Wellness Course: Academic Wellness Session 1
12:00 PM EDT · Lee Building (2124)
Graduate Pathways


Leadership Lunch: Neurodivergent Women & Leadership
12:00 PM EDT · The Vista — The Unity Center
Leadership & Community Service‑Learning


Free Iftar & Late‑Night Study Zone at Stamp
6:30 PM EDT · Grand Ballroom Lounge, STAMP
Memorial Chapel



Thu, Mar 12

Nestlé Guest Speaker & Chocolate Tasting
5:00 PM EDT · 3112 Marie Mount Hall
Food Science Club


Fri, Mar 13

Coffee @ UMD — Social
2:00 PM EDT · STAMP Student Union
Coffee @ UMD


Fri, Mar 20

Coffee @ UMD — Social
2:00 PM EDT · STAMP Student Union
Coffee @ UMD


Mon, Mar 23

Real Estate 101 with John Newman
5:00 PM EDT · Van Munching Hall Room 1335
The Real Estate Club


Wed, Mar 25


Wellness Course: Academic Wellness Session Two
12:00 PM EDT · Lee Building (2124)
Graduate Pathways


Tea Club Meeting
5:00 PM EDT · St. Mary’s Hall Multipurpose Room
Tea Club at UMD


BBB General Body Meeting
7:00 PM EDT · VMH 1335
Business Beyond Borders



Thu, Mar 26

Tea with TFR
10:00 AM EDT · UHC Ground Floor Drop‑in Space
Hosted by 2 organizations


Fri, Mar 27


Coffee @ UMD — Social
2:00 PM EDT · STAMP Student Union
Coffee @ UMD


Eat, Grow & Learn: Connecting with Alum
6:30 PM EDT · Thurgood Marshall Hall (Atrium)
Graduate Pathways



Tue, Mar 31

GRadulting: Why Create a Will & Estate Plan Now?
12:30 PM EDT · Stamp Student Union (room emailed to registrants)
Graduate Student Legal Aid


*/