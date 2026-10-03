"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getAccentTokens, getCategoryColor } from "@/lib/utils";
import styles from "./landing-motion.module.css";

const scenes = [
  { category: "Sports", emoji: "⚽", title: "One more for pickup?", short: "A little movement", place: "On the field", copy: "Find a game. Bring a friend. Leave the group chat on read.", x: 23, y: 52 },
  { category: "Community", emoji: "🤝", title: "New faces. Your kind of people.", short: "A new circle", place: "Around the quad", copy: "A club meetup, a shared interest, a conversation you didn’t plan on.", x: 50, y: 27 },
  { category: "Music", emoji: "🎵", title: "Your evening has other plans.", short: "A different evening", place: "Across campus", copy: "An open mic or a set worth staying for. See what’s on the map.", x: 77, y: 50 },
] as const;

/** A labeled illustration: no invented live inventory, locations, RSVPs or API reads. */
export function CampusScene() {
  const [selected, setSelected] = useState(1);
  const id = useId().replace(/:/g, "");
  const scene = scenes[selected];
  const tokens = getAccentTokens(getCategoryColor(scene.category));

  return (
    <div className="mx-auto w-full max-w-6xl" style={{ "--scene-accent": tokens.accent, "--scene-text": tokens.text } as CSSProperties}>
      <div className={styles.campus}>
        <svg viewBox="0 0 1000 460" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#64748B" strokeOpacity=".1" /></pattern>
            <radialGradient id={`${id}-light`}><stop stopColor={tokens.accent} stopOpacity=".12" /><stop offset="1" stopColor={tokens.accent} stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="1000" height="460" fill={`url(#${id}-grid)`} />
          <ellipse cx="500" cy="240" rx="460" ry="230" fill={`url(#${id}-light)`} />
          <g fill="#13252A" stroke="#254044" strokeWidth="1">
            <path d="M365 190H635V318H365Z" />
            <path d="M28 322H158V418H28ZM828 58H953V145H828Z" />
          </g>
          <g fill="#151F2F" stroke="#2A3545" strokeWidth="1.5">
            <rect x="82" y="102" width="104" height="63" rx="5" />
            <rect x="205" y="75" width="85" height="90" rx="5" />
            <rect x="332" y="44" width="112" height="54" rx="5" />
            <rect x="566" y="44" width="103" height="54" rx="5" />
            <rect x="721" y="104" width="94" height="61" rx="5" />
            <rect x="832" y="192" width="114" height="95" rx="5" />
            <rect x="65" y="222" width="103" height="70" rx="5" />
            <rect x="227" y="305" width="79" height="85" rx="5" />
            <rect x="690" y="300" width="83" height="87" rx="5" />
            <rect x="349" y="368" width="117" height="58" rx="5" />
            <rect x="530" y="368" width="102" height="58" rx="5" />
            <rect x="813" y="343" width="97" height="71" rx="5" />
          </g>
          <g fill="none" stroke="#536074" strokeOpacity=".35" strokeWidth="2">
            <path d="M0 190H340V125H665V190H1000M0 314H195V270H340V340H667V270H798V314H1000" />
            <path d="M316 0V105H195V195M688 0V88H795V195M195 270V460M798 270V460" />
          </g>
          <g fill="none" stroke="#637B80" strokeOpacity=".25" strokeWidth="1.5">
            <path d="M365 190L635 318M635 190L365 318M500 190V318" />
            <ellipse cx="500" cy="255" rx="44" ry="29" />
          </g>
          <g className={styles.route} fill="none" stroke={tokens.accent} strokeWidth="2" strokeDasharray="3 9" opacity=".55">
            <path d="M230 240H340V340H500V355M500 125H340V340H500V355M770 230H667V340H500V355" />
          </g>
          <g fill="#678779" opacity=".65">
            {[[48,90],[55,185],[102,191],[297,45],[710,58],[902,171],[940,329],[319,420],[675,425],[178,363],[820,435],[752,407]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />)}
          </g>
          <g fill={tokens.accent} stroke="#0B101B" strokeWidth="3">
            <circle r="5" className={styles.walkerOne} cx="230" cy="240" />
            <circle r="5" className={styles.walkerTwo} cx="770" cy="230" />
          </g>
          <text x="500" y="262" textAnchor="middle" fill="#729089" fontSize="10" letterSpacing="5" className="font-mono">THE QUAD</text>
        </svg>

        {scenes.map((item, index) => {
          const accent = getAccentTokens(getCategoryColor(item.category));
          return (
            <button
              key={item.category}
              type="button"
              aria-label={`Preview ${item.category.toLowerCase()} gatherings`}
              aria-pressed={selected === index}
              aria-controls={`${id}-description`}
              onClick={() => setSelected(index)}
              className={styles.eventMarker}
              style={{ left: `${item.x}%`, top: `${item.y}%`, "--pin-accent": accent.accent, "--pin-text": accent.text, "--float-delay": `${index * -1.7}s` } as CSSProperties}
            >
              <span className={styles.markerLabel}><span aria-hidden="true" className="text-base sm:text-xl">{item.emoji}</span><span>{item.short}</span><ArrowUpRight className="hidden h-3.5 w-3.5 sm:block" aria-hidden="true" /></span>
              <span className={styles.markerStem} />
              <span className={styles.markerDot} />
            </button>
          );
        })}

        <div className={styles.youMarker} aria-hidden="true">
          <span className={styles.ripple} /><span className={styles.rippleDelayed} />
          <span className="relative block h-4 w-4 rounded-full border-4 border-orange-100 bg-orange-500" />
          <span className="mt-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-orange-100">You, with possibilities.</span>
        </div>
        <div className="absolute bottom-1 left-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 sm:bottom-4 sm:left-6">
          <MapPin className="h-3 w-3" aria-hidden="true" /> College Park, MD
        </div>
        <span className="absolute bottom-1 right-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 sm:bottom-4 sm:right-6">Illustrative campus</span>
      </div>

      <div id={`${id}-description`} aria-live="polite" aria-atomic="true" className="relative mx-auto mt-3 max-w-xl rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 text-center backdrop-blur-md sm:mt-0">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: tokens.text }}>An example of what you could find</p>
        <h2 className="font-display text-xl font-semibold text-slate-100">{scene.title}</h2>
        <p className="mt-1 min-h-10 text-sm leading-5 text-slate-400">{scene.copy}</p>
      </div>
    </div>
  );
}

export function GatheringVisual() {
  return (
    <div className={styles.gathering} role="img" aria-label="Illustration of people connecting around a shared event">
      <div className={styles.gatheringOrbit} />
      <div className={styles.gatheringOrbitOuter} />
      <div className={styles.gatheringCenter}><MapPin className="h-8 w-8 text-orange-300" /><span className="mt-2 font-display text-lg font-semibold">Your next gathering</span><span className="mt-1 text-xs text-slate-400">One place to bring people together.</span></div>
      {[{ label: "The regulars", emoji: "👋", category: "Community" }, { label: "The new faces", emoji: "✨", category: "Arts & Culture" }, { label: "The +1s", emoji: "🤝", category: "Learning" }].map((group, index) => (
        <div key={group.label} className={`${styles.gatheringPerson} ${styles[`person${index}`]}`} style={{ "--float-delay": `${index * -2}s`, color: getAccentTokens(getCategoryColor(group.category)).text } as CSSProperties}>
          <span aria-hidden="true">{group.emoji}</span><span>{group.label}</span>
        </div>
      ))}
    </div>
  );
}
