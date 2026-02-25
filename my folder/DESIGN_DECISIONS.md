ything# Design Decisions

This document outlines the key design decisions made during the UI/UX overhaul of the Huddle application.

## Color System

The color system is designed to create a calm, focused experience with clear calls to action.

- **Primary Accent (`emerald`):** Used for all primary actions to guide the user and create a consistent visual hierarchy.
- **Background (`slate`):** A dark, desaturated background reduces visual noise and allows the accent color to stand out.
- **Surface (`white/10`):** A subtle glassmorphism effect is used for cards and modals to create a sense of depth and hierarchy.
- **Text (`slate-50`, `slate-300`, `slate-400`):** A range of neutral grays ensures readability and a clear typographic scale.

## Typography

The typographic scale is designed for clarity and scannability across all devices.

- **Headlines:** Large, bold headlines are used to grab attention and quickly communicate the purpose of a screen.
- **Body:** A clean, legible font is used for body copy to ensure readability.
- **Labels:** A smaller, lighter font is used for labels and secondary information to reduce visual clutter.

## Component Styling

All components have been updated to align with the new design system, with a focus on consistency and usability.

- **Buttons:** Buttons have clear visual distinctions between primary, secondary, and tertiary actions.
- **Cards:** Cards use a consistent glassmorphism effect with a subtle border to create a sense of depth.
- **Modals:** Modals use a consistent layout with a clear title, description, and actions.
- **Chips:** Filter chips have a distinct active state to provide clear visual feedback.

## Spacing

Generous whitespace is used throughout the application to create a sense of calm and improve scannability. A consistent spacing scale is used to ensure visual harmony between all elements.

## UX & User Flow

- **Personalized Discovery:** The Discover page is the primary landing screen for authenticated users, providing a personalized and actionable view of nearby games.
- **Actionable Empty States:** Empty states are designed to be opportunities for engagement, with clear calls to action to create the first game in an area.
- **Public Profiles:** Users can view each other's profiles to build trust and community.
- **Performance:** The application is designed to be fast and responsive, with viewport-based event fetching and memoized components to prevent unnecessary re-renders.
