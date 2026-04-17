import * as React from "react";

interface HuddleLogoProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
}

export function HuddleLogo({ size = 24, className = "", ...props }: HuddleLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <defs>
                <linearGradient id="huddleTeal" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2DD4BF" />
                    <stop offset="1" stopColor="#0D9488" />
                </linearGradient>
            </defs>
            {/* Outer ripples symbolizing community convergence */}
            <circle cx="256" cy="256" r="240" fill="url(#huddleTeal)" fillOpacity="0.15" />
            <circle cx="256" cy="256" r="180" fill="url(#huddleTeal)" fillOpacity="0.3" />

            {/* Map Pin base */}
            <path
                d="M256 80C167.634 80 96 151.634 96 240C96 360 256 480 256 480C256 480 416 360 416 240C416 151.634 344.366 80 256 80Z"
                fill="url(#huddleTeal)"
                className="shadow-[0_0_20px_rgba(13,148,136,0.5)]"
            />

            {/* Inner H */}
            <path
                d="M190 170V300M322 170V300M190 235H322"
                stroke="white"
                strokeWidth="42"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
