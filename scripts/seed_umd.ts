import * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { geohashForLocation } from 'geofire-common';

import { fileURLToPath } from 'url';

// Parse the service account from env logic or directly init
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, '');

        if (!projectId || !clientEmail || !privateKey) {
            throw new Error("Missing Firebase credentials strictly required for seeder.");
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey
            })
        });
    } catch (err) {
        console.error("Failed to initialize firebase admin.", err);
        process.exit(1);
    }
}

const db = admin.firestore();

// Known general coordinates for locations.
const COORDS: any = {
    "A. James Clark Hall": { lat: 38.9918, lng: -76.9366 },
    "University Libraries": { lat: 38.9859, lng: -76.9426 },
    "Cole Student Activities Building": { lat: 38.9881, lng: -76.9441 },
    "McKeldin Mall": { lat: 38.9859, lng: -76.9426 },
    "Adele H. Stamp Student Union": { lat: 38.9877, lng: -76.9446 },
    "Samuel Riggs IV Alumni Center": { lat: 38.9911, lng: -76.9472 },
    "Martin Hall": { lat: 38.9897, lng: -76.9364 },
    "Hornbake Library": { lat: 38.9871, lng: -76.9416 },
    "Edward St. John Learning and Teaching Center": { lat: 38.9866, lng: -76.9406 },
    "Arboretum Outreach Center": { lat: 38.9950, lng: -76.9333 },
    "Bob \"Turtle\" Smith Stadium at Shipley Field": { lat: 38.9893, lng: -76.9439 },
    "Tawes Hall": { lat: 38.9848, lng: -76.9434 },
    "The Clarice Smith Performing Arts Center": { lat: 38.9862, lng: -76.9482 },
    "Xfinity Center": { lat: 38.9954, lng: -76.9415 },
    "Marie Mount Hall": { lat: 38.9840, lng: -76.9405 },
    "St. Mary's Hall": { lat: 38.9842, lng: -76.9410 },
    "H.J. Patterson Hall": { lat: 38.9868, lng: -76.9446 },
    "John S. Toll Physics Building": { lat: 38.9854, lng: -76.9385 },
    "Jimenez Hall": { lat: 38.9852, lng: -76.9443 },
    "Tawes Plaza": { lat: 38.9848, lng: -76.9434 },
    "E.A. Fernandez IDEA Factory": { lat: 38.9912, lng: -76.9372 },
    "Multipurpose Room": { lat: 38.9877, lng: -76.9446 }, // Approximated pointing to Stamp
    "Memorial Chapel": { lat: 38.9839, lng: -76.9392 }
};

const getEventLocation = (locationName?: string) => {
    if (!locationName) return null;
    const match = Object.keys(COORDS).find(k => locationName.toLowerCase().includes(k.toLowerCase()));
    if (match) return COORDS[match];
    return { lat: 38.9869, lng: -76.9425 }; // Default fallback UMD center if it has a physical name
}

const formatCustomDate = (dateStr: string) => {
    // Expected format e.g. "Mar 05"
    const monthMap: any = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" };
    const parts = dateStr.split(" ");
    const month = monthMap[parts[0]];
    const day = parts[1].padStart(2, '0');
    return `2026-${month}-${day}`;
}

const timeTo24h = (time12: string) => {
    const [time, modifier] = time12.split(/(am|pm)/i);
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    if (h === 12) h = 0;
    if (modifier.toLowerCase() === 'pm') {
        h += 12;
    }
    return `${h.toString().padStart(2, '0')}:${minutes}`;
}

const SEED_DATA = [
    { name: "2026 PTK Symposium", date: "Mar 05", time: "9:00am - 5:00pm", location: "A. James Clark Hall", description: "Eight annual symposium to celebrate UMD's PTK faculty", category: "Learning" },
    { name: "Reading and Note Taking for the Literature Review", date: "Mar 05", time: "12:00pm - 1:00pm", location: "University Libraries", description: "Research Education at University Libraries workshops equip researchers with the tools, concepts, and skills needed for every stage of the research lifecycle.", category: "Learning" },
    { name: "Intro to R", date: "Mar 05", time: "12:00pm - 1:30pm", description: "The Data Science/GIS workshop series is powered by GIS and Data Service Center, and Research Education at University Libraries.", category: "Learning" },
    { name: "Trade Secrets & Trademarks", date: "Mar 05", time: "12:00pm - 1:00pm", description: "Trade Secrets & Trademarks (and the Costly Mistakes Founders Make)", category: "Learning" },
    { name: "Getting Creative with Media Access", date: "Mar 05", time: "12:00pm - 1:15pm", location: "Cole Student Activities Building", category: "Learning" },
    { name: "Make Your Panopto Videos Accessible with Captions and Audio Description", date: "Mar 05", time: "12:00pm - 1:00pm", description: "Learn how to make videos more accessible by enabling and editing automatic captions and adding audio descriptions in Panopto.", category: "Learning" },
    { name: "Spring Steps", date: "Mar 05", time: "12:00pm - 1:00pm", location: "McKeldin Mall", description: "Lunchtime laps around Mckeldin Mall.", category: "Sports" },
    { name: "GIS and Data Help Desk", date: "Mar 05", time: "1:00pm - 3:00pm", description: "The Data Science/GIS workshop series is powered by GIS and Data Service Center, and Research Education at University Libraries.", category: "Learning" },
    { name: "The Wellness Series: Dealing with Disappointment", date: "Mar 05", time: "4:00pm - 5:00pm", category: "Community" },
    { name: "Multiculturalism and Building Peace Roundtable", date: "Mar 05", time: "5:00pm - 8:00pm", description: "This event explores how several diverse nations are engaged in learning how to foster peaceful and cohesive societies.", category: "Community" },
    { name: "Mario Kart World Tournament", date: "Mar 05", time: "7:00pm - 9:00pm", location: "Adele H. Stamp Student Union", description: "Come to the TerpZone to show off your Mario Kart skills!", category: "Sports" },
    { name: "America Will Be! Exhibition", date: "Feb 09", endDate: "May 15", time: "12:00am - 11:59pm", location: "Cole Student Activities Building", description: "Visit the David C. Driskell Center's Spring 2026 Exhibition!", category: "Arts & Culture" },
    { name: "Intro to Mindfulness with Faculty Staff Assistance Program", date: "Mar 02", endDate: "Mar 30", time: "2:00pm - 3:15pm", description: "The Faculty Staff Assistance Program will be teaching an Intro to Mindfulness Class in March for Employee Appreciation Month.", category: "Community" },
    { name: "EnTERPreneur Conference", date: "Mar 06", time: "9:00am - 5:30pm", location: "Samuel Riggs IV Alumni Center", description: "Whether you’re starting to explore entrepreneurship, working to strengthen a growing venture, or ready to scale what you’ve built, the EnTERPreneur Conference is designed to meet you where you are and help you take the next step.", category: "Tech" },
    { name: "Seminar: Strengthening Resilience and Adaptation in the Built Environment", date: "Mar 06", time: "11:30am - 1:00pm", location: "Martin Hall", description: "Join Dr. Aslihan Karatas for a presentation on strengthening resilience and adaptation in the built environment.", category: "Learning" },
    { name: "Data Wrangling with Python", date: "Mar 06", time: "12:00pm - 1:30pm", description: "The Data Science/GIS workshop series.", category: "Learning" },
    { name: "Careers in Think Tanks", date: "Mar 06", time: "12:00pm - 1:00pm", description: "Panel to learn more about future careers in Think Tanks.", category: "Community" },
    { name: "How to Prepare for an Interview workshop", date: "Mar 06", time: "12:00pm - 1:00pm", location: "Hornbake Library", description: "Insightful session to prepare for interviews.", category: "Learning" },
    { name: "Getting Started with Your Teaching Philosophy Statement", date: "Mar 06", time: "1:00pm - 2:30pm", location: "Edward St. John Learning and Teaching Center", description: "Workshop to get guidance and clarity on articulating an effective teaching philosophy.", category: "Learning" },
    { name: "International Terp Career Development: Global Advantage", date: "Mar 06", time: "2:00pm - 3:00pm", description: "Panel highlighting diverse perspectives.", category: "Learning" },
    { name: "Friday Flower Power Hour", date: "Mar 06", time: "2:00pm - 3:00pm", location: "Arboretum Outreach Center", description: "Join us Friday afternoons for fresh air, good vibes, & garden therapy", category: "Community" },
    { name: "Maryland Softball v. Rutgers", date: "Mar 06", time: "6:00pm - 8:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
    { name: "Open Mic Night", date: "Mar 06", time: "6:30pm - 8:00pm", location: "Tawes Hall", description: "Join the LGBTQ+ Equity Center for an Open Mic Night!", category: "Arts & Culture" },
    { name: "Macbeth", date: "Mar 06", time: "7:30pm - 9:00pm", location: "The Clarice Smith Performing Arts Center", category: "Arts & Culture" },
    { name: "Baltimore Symphony Orchestra: Mahler’s Das Lied von der Erde", date: "Mar 06", time: "8:00pm - 10:00pm", location: "The Clarice Smith Performing Arts Center", category: "Music" },
    { name: "Weed Warriors on Campus", date: "Mar 07", time: "10:30am - 12:00pm", location: "Arboretum Outreach Center", description: "Volunteer event for educational invasive species removal.", category: "Community" },
    { name: "Women's Lacrosse v. James Madison", date: "Mar 07", time: "12:00pm - 2:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
    { name: "Macbeth", date: "Mar 07", time: "2:00pm - 4:30pm", location: "The Clarice Smith Performing Arts Center", category: "Arts & Culture" },
    { name: "Maryland Softball v. Rutgers", date: "Mar 07", time: "2:00pm - 5:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
    { name: "Macbeth", date: "Mar 07", time: "7:30pm - 9:30pm", location: "The Clarice Smith Performing Arts Center", category: "Arts & Culture" },
    { name: "Maryland Softball v. Rutgers", date: "Mar 08", time: "12:00pm - 3:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
    { name: "Richard Goode, piano", date: "Mar 08", time: "3:00pm - 5:00pm", location: "The Clarice Smith Performing Arts Center", category: "Music" },
    { name: "Men's Basketball vs. Illinois", date: "Mar 08", time: "3:00pm - 6:00pm", location: "Xfinity Center", category: "Sports" },
    { name: "Overview of the Ally ELMS-Canvas Accessibility Tool", date: "Mar 09", time: "11:00am - 12:00pm", category: "Learning" },
    { name: "Jam Session with the LGBTQ+ Equity Center", date: "Mar 09", time: "12:00pm - 2:00pm", location: "Marie Mount Hall", category: "Music" },
    { name: "Language House Language Chats", date: "Mar 09", time: "4:00pm - 5:30pm", location: "St. Mary's Hall", category: "Learning" },
    { name: "Intro to Python", date: "Mar 10", time: "12:00pm - 1:00pm", category: "Learning" },
    { name: "ChilLACS", date: "Mar 10", time: "2:00pm - 4:00pm", location: "H.J. Patterson Hall", category: "Arts & Culture" },
    { name: "Irving and Renee Milchberg Endowed Lecture: Missy Cummings", date: "Mar 10", time: "3:30pm - 5:00pm", location: "John S. Toll Physics Building", category: "Learning" },
    { name: "Virtual NYC Networking Night", date: "Mar 10", time: "6:00pm - 7:00pm", category: "Community" },
    { name: "Global Karaoke Night at the Language House", date: "Mar 10", time: "6:00pm - 7:30pm", location: "St. Mary's Hall", category: "Music" },
    { name: "Language House International Film Series: \"The Twelve Chairs\"", date: "Mar 10", time: "7:30pm - 9:30pm", location: "St. Mary's Hall", category: "Arts & Culture" },
    { name: "UMD University Orchestra March Concert", date: "Mar 10", time: "8:00pm - 9:30pm", location: "The Clarice Smith Performing Arts Center", category: "Music" },
    { name: "Introduction to Zotero", date: "Mar 11", time: "12:00pm - 1:00pm", category: "Learning" },
    { name: "Mindful Moments Walking Tour", date: "Mar 11", time: "12:00pm - 1:00pm", location: "Tawes Plaza", category: "Community" },
    { name: "Spring Into STAMP's Living Room ft. victhekidd", date: "Mar 11", time: "12:30pm - 1:30pm", location: "Adele H. Stamp Student Union", category: "Arts & Culture" },
    { name: "2026 Virtual Spring Career & Internship Fair", date: "Mar 11", time: "1:00pm - 4:00pm", category: "Community" },
    { name: "Weed It Wednesdays", date: "Mar 11", time: "1:30pm - 3:00pm", location: "Arboretum Outreach Center", category: "Community" },
    { name: "xFOUNDRY Mental Health Xperience MiXer", date: "Mar 11", time: "5:30pm - 6:30pm", location: "E.A. Fernandez IDEA Factory", category: "Community" },
    { name: "German Studies Department Film Series", date: "Mar 11", time: "6:30pm - 9:00pm", location: "Jimenez Hall", category: "Arts & Culture" },
    { name: "Memorial Chapel Open House", date: "Mar 14", time: "12:00pm - 2:00pm", location: "Memorial Chapel", category: "Community" },
    { name: "Men's Lacrosse v. Virginia", date: "Mar 14", time: "1:00pm - 3:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
    { name: "Maryland Baseball v. Purdue", date: "Mar 14", time: "2:00pm - 5:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
    { name: "Maryland Baseball v. Purdue", date: "Mar 15", time: "1:00pm - 4:00pm", location: "Bob \"Turtle\" Smith Stadium at Shipley Field", category: "Sports" },
];

async function seed() {
    const batch = db.batch();
    for (const item of SEED_DATA) {
        const docRef = db.collection("events").doc();
        const isVirtual = !item.location;

        const times = item.time.split(" - ");
        const startTimeStr = timeTo24h(times[0].trim());
        const endTimeStr = times.length > 1 ? timeTo24h(times[1].trim()) : undefined;

        const event: any = {
            title: item.name,
            name: item.name,
            date: formatCustomDate(item.date),
            time: startTimeStr,
            eventType: isVirtual ? "virtual" : "in-person",
            location: item.location || "Virtual",
            description: item.description || "",
            category: item.category,
            sport: item.category,
            createdBy: "UMD_SEEDER",
            organizerName: "UMD Org",
            players: [],
            currentPlayers: Math.floor(Math.random() * 20) + 1,
            maxPlayers: 50,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            checkInOpen: false,
            isBoosted: false,
            isPrivate: false,
        };

        if (endTimeStr) {
            event.endTime = endTimeStr;
        }

        if (item.endDate) {
            event.endDate = formatCustomDate(item.endDate);
        }

        if (isVirtual) {
            event.virtualLink = "https://umd.zoom.us/j/testlink";
        } else {
            const locCoords = getEventLocation(item.location);
            if (locCoords) {
                event.geopoint = new admin.firestore.GeoPoint(locCoords.lat, locCoords.lng);
                event.geohash = geohashForLocation([locCoords.lat, locCoords.lng]);
            }
        }
        batch.set(docRef, event);
    }

    await batch.commit();
    console.log("Successfully seeded 54+ UMD Events to Firebase!");
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) });