import { GameEvent } from "./types";

export function generateGoogleCalendarUrl(event: GameEvent): string {
    const title = encodeURIComponent(event.name || event.title || "");
    const details = encodeURIComponent(event.description || "");
    const locationStr = typeof event.location === "string" ? event.location : (event.location?.name || event.venue || "");
    const location = encodeURIComponent(locationStr);

    try {
        const startDate = new Date(`${event.date}T${event.time || "00:00"}`);
        // Assume events are 2 hours long
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const formatGCalDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        const startStr = formatGCalDate(startDate);
        const endStr = formatGCalDate(endDate);
        const eventUrl = `https://huddlev1.vercel.app/map?eventId=${event.id}`;
        const finalDetails = details ? `${details}%0A%0A${encodeURIComponent(eventUrl)}` : encodeURIComponent(eventUrl);

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${finalDetails}&location=${location}`;
    } catch (e) {
        console.error("Error generating Google Calendar URL", e);
        return "";
    }
}

export function generateIcsContent(event: GameEvent): string {
    const title = event.name || event.title || "";
    const details = event.description || "";
    const locationStr = typeof event.location === "string" ? event.location : (event.location?.name || event.venue || "");

    try {
        const startDate = new Date(`${event.date}T${event.time || "00:00"}`);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        const now = new Date();

        const formatIcsDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        return [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Huddle//Huddle Web App//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            `SUMMARY:${title}`,
            `UID:${event.id}@huddle.com`,
            `SEQUENCE:0`,
            `STATUS:CONFIRMED`,
            `TRANSP:OPAQUE`,
            `DTSTART:${formatIcsDate(startDate)}`,
            `DTEND:${formatIcsDate(endDate)}`,
            `DTSTAMP:${formatIcsDate(now)}`,
            `LOCATION:${locationStr}`,
            `DESCRIPTION:${details.replace(/\n/g, "\\n")}\\n\\nhttps://huddlev1.vercel.app/map?eventId=${event.id}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");
    } catch (e) {
        console.error("Error generating ICS content", e);
        return "";
    }
}

export function downloadIcsFile(event: GameEvent) {
    const content = generateIcsContent(event);
    if (!content) return;

    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Huddle_${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
