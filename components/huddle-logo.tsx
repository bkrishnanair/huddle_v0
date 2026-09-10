import * as React from "react";

interface HuddleLogoProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string; // We can ignore or use as override
}

export function HuddleLogo({ size = 24, className = "", color, ...props }: HuddleLogoProps) {
    // The Ping: A central dot with two concentric arcs simulating a radar sweep.
    // Using currentColor makes it adaptable (e.g. text-live or text-ink)
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            stroke={color || "currentColor"}
            {...props}
        >
            {/* Core Ping */}
            <circle cx="50" cy="50" r="14" fill={color || "currentColor"} stroke="none" />
            
            {/* Inner arc */}
            <path
                d="M 25 50 A 25 25 0 0 1 75 50"
                strokeWidth="8"
                strokeLinecap="round"
            />
            {/* Outer arc */}
            <path
                d="M 12 50 A 38 38 0 0 1 88 50"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.5"
            />
        </svg>
    );
}
