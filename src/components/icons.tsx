
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" strokeWidth="1.5" {...props}>
    {/* Head */}
    <circle cx="50" cy="25" r="12" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    
    {/* Eyes - larger and more expressive with sparkle */}
    <ellipse cx="44" cy="23" rx="3" ry="4.5" fill="white" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="44" cy="24" r="1.5" fill="hsl(var(--primary))" /> 
    <circle cx="43" cy="22" r="0.75" fill="white" /> {/* Sparkle */}
    
    <ellipse cx="56" cy="23" rx="3" ry="4.5" fill="white" stroke="hsl(var(--primary))" strokeWidth="1"/>
    <circle cx="56" cy="24" r="1.5" fill="hsl(var(--primary))" />
    <circle cx="55" cy="22" r="0.75" fill="white" /> {/* Sparkle */}

    {/* Eyelashes - more delicate */}
    <path d="M40 20 Q 42 18 44 19" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none"/>
    <path d="M41.5 21.5 Q 43 19.5 45 20.5" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none"/>
    
    <path d="M60 20 Q 58 18 56 19" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none"/>
    <path d="M58.5 21.5 Q 57 19.5 55 20.5" stroke="hsl(var(--primary))" strokeWidth="0.8" fill="none"/>

    {/* Smile - gentle and sweet */}
    <path d="M46 31 Q 50 34 54 31" stroke="hsl(var(--primary))" strokeWidth="1.2" fill="none" />
    
    {/* Blush */}
    <ellipse cx="40" cy="28" rx="3.5" ry="2" fill="hsl(0, 100%, 85%)" opacity="0.7" />
    <ellipse cx="60" cy="28" rx="3.5" ry="2" fill="hsl(0, 100%, 85%)" opacity="0.7" />

    {/* Hair - Flowing style */}
    <path d="M38 25 Q 25 35 38 45 C 35 15 50 5 50 5 C 50 5 65 15 62 45 Q 75 35 62 25 C 65 20 60 10 50 10 C 40 10 35 20 38 25 Z"
          stroke="hsl(50 100% 60%)" fill="hsl(50 100% 70%)" strokeWidth="1.5" />
    <path d="M50 5 C 45 12, 40 15, 38 20" stroke="hsl(50 100% 50%)" strokeWidth="1" fill="none"/>
    <path d="M50 5 C 55 12, 60 15, 62 20" stroke="hsl(50 100% 50%)" strokeWidth="1" fill="none"/>
    <path d="M42 35 Q 50 40 58 35" stroke="hsl(50 100% 50%)" strokeWidth="1" fill="none"/>


    {/* Crown - more detailed */}
    <path d="M42 6 L 45 -2 L 50 4 L 55 -2 L 58 6 L 50 8 Z" fill="hsl(var(--accent))" stroke="hsl(var(--accent-foreground))" strokeWidth="1"/>
    <circle cx="45" cy="0" r="1" fill="hsl(var(--destructive))" />
    <circle cx="50" cy="5.5" r="1" fill="hsl(var(--destructive))" />
    <circle cx="55" cy="0" r="1" fill="hsl(var(--destructive))" />


    {/* Body - Torso (elegant neckline) */}
    <path d="M40 37 C 40 42, 42 48, 50 48 C 58 48, 60 42, 60 37 L 55 37 Q 50 39 45 37 Z" 
          fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    
    {/* Ball Gown Skirt - wide and flowing */}
    <path d="M25 48 C 5 65, 0 85, 2 98 L 98 98 C 100 85, 95 65, 75 48 Z" 
          fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    
    {/* Arms (graceful pose) */}
    {/* Left Arm */}
    <path d="M40 42 C 35 48, 30 58, 32 65" stroke="hsl(var(--primary-foreground))" fill="none" strokeWidth="2.5"/>
    <circle cx="31" cy="67" r="3.5" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
    {/* Right Arm */}
    <path d="M60 42 C 65 48, 70 58, 68 65" stroke="hsl(var(--primary-foreground))" fill="none" strokeWidth="2.5"/>
    <circle cx="69" cy="67" r="3.5" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>

    {/* Gown details - subtle folds or patterns */}
    <path d="M50 48 Q 35 60 28 75" stroke="hsl(var(--primary)/0.6)" strokeWidth="1.5" fill="none"/>
    <path d="M50 48 Q 65 60 72 75" stroke="hsl(var(--primary)/0.6)" strokeWidth="1.5" fill="none"/>
    <path d="M15 98 Q 50 88 85 98" stroke="hsl(var(--primary)/0.6)" strokeWidth="1.5" fill="none"/>
    <ellipse cx="50" cy="65" rx="20" ry="8" fill="hsl(var(--primary)/0.3)" />
  </svg>
);


    