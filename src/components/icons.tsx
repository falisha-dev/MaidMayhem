
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

export const PrincessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150" fill="none" strokeWidth="1.5" {...props}>
    {/* Head */}
    <circle cx="50" cy="30" r="15" fill="hsl(35, 78%, 88%)" stroke="hsl(30, 50%, 60%)" strokeWidth="1.5"/> {/* Skin tone */}

    {/* Eyes - larger and more expressive with sparkle */}
    <ellipse cx="42" cy="28" rx="4" ry="6" fill="white" stroke="hsl(240, 50%, 30%)" strokeWidth="1"/>
    <circle cx="42" cy="30" r="2.5" fill="hsl(190, 70%, 50%)" />
    <circle cx="41" cy="27" r="1" fill="white" /> {/* Sparkle */}

    <ellipse cx="58" cy="28" rx="4" ry="6" fill="white" stroke="hsl(240, 50%, 30%)" strokeWidth="1"/>
    <circle cx="58" cy="30" r="2.5" fill="hsl(190, 70%, 50%)" />
    <circle cx="57" cy="27" r="1" fill="white" /> {/* Sparkle */}

    {/* Eyelashes */}
    <path d="M36 24 Q 40 20 44 23" stroke="hsl(240, 50%, 30%)" strokeWidth="1" fill="none"/>
    <path d="M37 26 Q 41 22 45 25" stroke="hsl(240, 50%, 30%)" strokeWidth="1" fill="none"/>

    <path d="M64 24 Q 60 20 56 23" stroke="hsl(240, 50%, 30%)" strokeWidth="1" fill="none"/>
    <path d="M63 26 Q 59 22 55 25" stroke="hsl(240, 50%, 30%)" strokeWidth="1" fill="none"/>

    {/* Smile - gentle and sweet */}
    <path d="M45 38 Q 50 42 55 38" stroke="hsl(0, 70%, 60%)" strokeWidth="1.2" fill="none" />

    {/* Blush */}
    <ellipse cx="38" cy="35" rx="5" ry="3" fill="hsl(0, 100%, 85%)" opacity="0.6" />
    <ellipse cx="62" cy="35" rx="5" ry="3" fill="hsl(0, 100%, 85%)" opacity="0.6" />

    {/* Hair - Flowing golden blonde style */}
    <path d="M35 30 Q 20 45 35 60 C 30 10 50 0 50 0 C 50 0 70 10 65 60 Q 80 45 65 30 C 70 20 60 5 50 5 C 40 5 30 20 35 30 Z"
          stroke="hsl(50 100% 60%)" fill="hsl(50 100% 75%)" strokeWidth="2" />
    <path d="M50 0 C 40 15, 30 20, 35 35" stroke="hsl(50 100% 50%)" strokeWidth="1.5" fill="none"/>
    <path d="M50 0 C 60 15, 70 20, 65 35" stroke="hsl(50 100% 50%)" strokeWidth="1.5" fill="none"/>
    <path d="M38 50 Q 50 60 62 50" stroke="hsl(50 100% 50%)" strokeWidth="1.5" fill="none"/>
    <path d="M45 55 Q 50 65 55 55" stroke="hsl(50 100% 50%)" strokeWidth="1.5" fill="none"/>

    {/* Crown - elegant */}
    <path d="M40 5 L 44 -2 L 50 8 L 56 -2 L 60 5 L 50 12 Z" fill="hsl(50, 80%, 70%)" stroke="hsl(50, 70%, 50%)" strokeWidth="1"/>
    <circle cx="44" cy="0" r="1.5" fill="hsl(300, 70%, 70%)" />
    <circle cx="50" cy="9.5" r="2" fill="hsl(0, 70%, 70%)" />
    <circle cx="56" cy="0" r="1.5" fill="hsl(300, 70%, 70%)" />

    {/* Body - Torso (elegant neckline) - Pink with white trim */}
    <path d="M38 45 C 38 55, 40 65, 50 65 C 60 65, 62 55, 62 45 L 58 48 Q 50 52 42 48 Z"
          fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>

    {/* Ball Gown Skirt - wide and flowing, extending downwards - Pink with white trim */}
    <path d="M20 65 C -10 90, -15 130, 10 148 L 90 148 C 115 130, 110 90, 80 65 Z"
          fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>

    {/* Arms (graceful pose, skin tone) */}
    {/* Left Arm */}
    <path d="M38 55 C 30 65, 25 80, 30 90" stroke="hsl(35, 78%, 88%)" fill="none" strokeWidth="4"/>
    <circle cx="29" cy="92" r="4" fill="hsl(35, 78%, 88%)" stroke="hsl(30, 50%, 60%)" strokeWidth="1"/>
    {/* Right Arm */}
    <path d="M62 55 C 70 65, 75 80, 70 90" stroke="hsl(35, 78%, 88%)" fill="none" strokeWidth="4"/>
    <circle cx="71" cy="92" r="4" fill="hsl(35, 78%, 88%)" stroke="hsl(30, 50%, 60%)" strokeWidth="1"/>

    {/* Gown details - White lines for trimmings/folds */}
    <path d="M50 65 Q 25 85 20 110" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>
    <path d="M50 65 Q 75 85 80 110" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>
    <path d="M15 148 Q 50 130 85 148" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>

    {/* White Waist Sash */}
    <rect x="42" y="62" width="16" height="7" rx="2" fill="hsl(var(--primary-foreground))" stroke="hsl(var(--border))" strokeWidth="1"/>

    {/* Bodice Embellishments (White "Bows"/gems) */}
    <circle cx="45" cy="52" r="1.5" fill="hsl(var(--primary-foreground))"/>
    <circle cx="50" cy="50" r="1.5" fill="hsl(var(--primary-foreground))"/>
    <circle cx="55" cy="52" r="1.5" fill="hsl(var(--primary-foreground))"/>
  </svg>
);
