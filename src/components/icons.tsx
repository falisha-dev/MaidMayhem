
import type { SVGProps } from 'react';

// Cute Minion Maid Doll Icon
// Combining elements of a simple doll and a maid outfit
export const MaidIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    {/* Head */}
    <circle cx="32" cy="18" r="10" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))"/>
    {/* Eyes (simple dots) */}
    <circle cx="28" cy="16" r="1.5" fill="hsl(var(--primary))" />
    <circle cx="36" cy="16" r="1.5" fill="hsl(var(--primary))" />
    {/* Smile */}
    <path d="M29 21 Q 32 23 35 21" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" />
    
    {/* Hair/Bonnet outline */}
    <path d="M22 18 Q 32 10 42 18" stroke="hsl(var(--primary))" fill="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <path d="M22 18 C 20 22, 20 28, 22 30" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" />
    <path d="M42 18 C 44 22, 44 28, 42 30" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" />
    <rect x="24" y="8" width="16" height="4" rx="2" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" />


    {/* Body - simple dress shape */}
    <path d="M26 28 L 22 48 Q 32 54 42 48 L 38 28 Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
    
    {/* Apron */}
    <path d="M27 32 L 24 46 Q 32 50 40 46 L 37 32 Z" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--border))" />
    <rect x="28" y="30" width="8" height="4" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--border))" />


    {/* Arms (optional simple stubs) */}
    <ellipse cx="23" cy="36" rx="3" ry="5" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" transform="rotate(-30 23 36)" />
    <ellipse cx="41" cy="36" rx="3" ry="5" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" transform="rotate(30 41 36)" />

    {/* Legs (optional simple stubs) */}
    <ellipse cx="28" cy="52" rx="3" ry="6" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
    <ellipse cx="36" cy="52" rx="3" ry="6" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
  </svg>
);


export const CakeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 10.53V7.5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2V12H4v5.5a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 17.5v-1.97" />
    <path d="M4 12H2" />
    <path d="M12 12h10" />
    <path d="M12 5.5V4" />
    <path d="m12 12-2-2.5" />
    <path d="m16 12-2-2.5" />
    <path d="m20 12-2-2.5" />
    <path d="M12.5 19.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive))"/>
    <path d="M12 19v-3" />
  </svg>
);

export const SushiIcon = (props: SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7.38 12.29 5.32 3.83C5.18 3.24 5.66 2.62 6.28 2.62H17.7c.62 0 1.1.62.97 1.21L16.6 12.3c-.08.38-.32.7-.62.89l-4.34 2.74c-.26.16-.57.16-.84 0L7.98 13.2c-.3-.19-.53-.51-.62-.9Z"/>
    <path d="M12 16v5.93" />
    <path d="M12 22h.01" />
    <path d="M5 22h14" />
    <path d="M16 2.62c0 3.5-2 5.62-4 5.62s-4-2.12-4-5.62" fill="hsl(var(--primary))" strokeWidth="0.5"/>
  </svg>
);

export const DonutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" fill="hsl(var(--secondary))" stroke="hsl(var(--secondary))" />
    {/* Sprinkles */}
    <circle cx="10" cy="7" r="0.5" fill="hsl(var(--primary))" stroke="none"/>
    <circle cx="14" cy="7" r="0.5" fill="hsl(var(--destructive))" stroke="none"/>
    <circle cx="17" cy="10" r="0.5" fill="hsl(var(--primary))" stroke="none"/>
    <circle cx="17" cy="14" r="0.5" fill="hsl(var(--destructive))" stroke="none"/>
    <circle cx="14" cy="17" r="0.5" fill="hsl(var(--primary))" stroke="none"/>
    <circle cx="10" cy="17" r="0.5" fill="hsl(var(--destructive))" stroke="none"/>
    <circle cx="7" cy="14" r="0.5" fill="hsl(var(--primary))" stroke="none"/>
    <circle cx="7" cy="10" r="0.5" fill="hsl(var(--destructive))" stroke="none"/>
  </svg>
);

export const BittenAppleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20.5c-3.68-.04-7.84-1.69-9.53-4.67-.87-1.53-.9-3.38-.31-4.96.52-1.39 1.62-2.83 3.14-3.76.9-.55 2.07-.73 3.2-.39 1.13.34 2.28.99 3 1.88.72-.89 1.87-1.54 3-1.88 1.13-.34 2.3-.16 3.2.39 1.52.93 2.62 2.37 3.14 3.76.59 1.58.56 3.43-.31 4.96C19.84 18.81 15.68 20.46 12 20.5Z"/>
    <path d="m12 13.5-.01-7c0-.83.67-1.5 1.5-1.5h.01c.83 0 1.5.67 1.5 1.5l-.01 7" stroke="hsl(var(--card-foreground))" />
    <path d="M15.75 12.62c.6-.43 1.37-.5 2-.25.64.25.88.96.5 1.63-.38.67-1.15.75-1.75.5-.6-.25-.88-.96-.5-1.63h-.25Z" fill="hsl(var(--secondary))" stroke="hsl(var(--secondary))"/>
  </svg>
);

export const CherryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 21c-2.1 0-3.9-1-5-2.5-1.1-1.6-1.3-3.8-.6-5.6l4.4-11.2c.2-.6.2-1.2 0-1.7A2.5 2.5 0 0 0 9.4 0L8 2.2M13 21c2.1 0 3.9-1 5-2.5 1.1-1.6 1.3-3.8.6-5.6l-4.4-11.2c-.2-.6-.2-1.2 0-1.7A2.5 2.5 0 0 1 14.6 0L16 2.2" />
    <circle cx="6.5" cy="17.5" r="3.5" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive-foreground))"/>
    <circle cx="17.5" cy="17.5" r="3.5" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive-foreground))"/>
  </svg>
);


export const PrincessAtTableIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    {/* Princess Gown (standing) */}
    <path d="M38 42 L30 58 C 20 70, 5 85, 2 95 L 98 95 C 95 85, 80 70, 70 58 L62 42 Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5" />
    
    {/* Puff Sleeves */}
    <circle cx="36" cy="48" r="6" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="64" cy="48" r="6" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1"/>

    {/* Bodice detail */}
    <path d="M50 40 Q 38 42 35 50  Q 38 58 50 60 Q 62 58 65 50 Q 62 42 50 40 Z" fill="hsl(var(--primary)/0.7)" stroke="hsl(var(--primary))" strokeWidth="1"/>

    {/* Forearms */}
    <path d="M36 53 C 34 63, 35 70, 37 75 L 40 74 C 38 68, 37 62, 39 54 Z" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <path d="M64 53 C 66 63, 65 70, 63 75 L 60 74 C 62 68, 63 62, 61 54 Z" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1"/>

    {/* Neck */}
    <rect x="47" y="35" width="6" height="5" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1"/>

    {/* Princess Head */}
    <circle cx="50" cy="25" r="10" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    {/* Eyes - larger and more expressive */}
    <ellipse cx="45" cy="23" rx="2.5" ry="3.5" fill="white" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="45" cy="23.5" r="1" fill="hsl(var(--primary))" /> 
    <ellipse cx="55" cy="23" rx="2.5" ry="3.5" fill="white" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="55" cy="23.5" r="1" fill="hsl(var(--primary))" />
    
    {/* Eyelashes */}
    <path d="M42.5 21 Q 43.5 19 45 19.5" stroke="hsl(var(--primary))" strokeWidth="0.7" fill="none"/>
    <path d="M44.5 20 Q 45.5 18 47 18.5" stroke="hsl(var(--primary))" strokeWidth="0.7" fill="none"/>
    <path d="M52.5 21 Q 53.5 19 55 19.5" stroke="hsl(var(--primary))" strokeWidth="0.7" fill="none" transform="scale(-1, 1) translate(-100, 0)"/>
    <path d="M54.5 20 Q 55.5 18 57 18.5" stroke="hsl(var(--primary))" strokeWidth="0.7" fill="none" transform="scale(-1, 1) translate(-109, 0)"/>

    {/* Smile - more defined and gentle */}
    <path d="M46 30 Q 50 32.5 54 30" stroke="hsl(var(--primary))" strokeWidth="1" fill="none" />

    {/* Blush */}
    <ellipse cx="43" cy="27" rx="3" ry="1.5" fill="hsl(0, 100%, 80%)" opacity="0.6" />
    <ellipse cx="57" cy="27" rx="3" ry="1.5" fill="hsl(0, 100%, 80%)" opacity="0.6" />

    {/* Princess Hair (flowing, elegant bun or waves) */}
    {/* Main hair mass */}
    <path d="M38 25 Q 35 10 50 8 Q 65 10 62 25 C 65 15, 68 28, 62 33 C 58 38, 42 38, 38 33 C 32 28, 35 15, 38 25 Z" stroke="hsl(50 100% 60%)" fill="hsl(50 100% 70%)" strokeWidth="1.5" />
    {/* Hair details/waves */}
    <path d="M40 15 Q 50 20 60 15" stroke="hsl(50 100% 50%)" strokeWidth="1" fill="none"/>
    <path d="M42 20 Q 50 25 58 20" stroke="hsl(50 100% 50%)" strokeWidth="1" fill="none"/>
    <path d="M45 25 Q 50 30 55 25" stroke="hsl(50 100% 50%)" strokeWidth="1" fill="none"/>
    
    {/* Crown */}
    <path d="M45 5 L 47 0 L 50 3 L 53 0 L 55 5 Z" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1"/>
  </svg>
);
