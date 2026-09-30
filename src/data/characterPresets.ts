/**
 * Built-in Animated Sprite Presets & Transparent PNGs for instant preview and testing
 */

// Animated Retro Pixel Hero with animated breathing, blinking visor and muzzle glow
export const ANIMATED_PIXEL_HERO_DATA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <g id="hero">
    <!-- Shadow -->
    <ellipse cx="50" cy="115" rx="28" ry="5" fill="rgba(0,0,0,0.4)" />
    
    <!-- Animated body bob -->
    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="0.8s" repeatCount="indefinite" />
    
    <!-- Boots & Legs -->
    <rect x="36" y="90" width="11" height="24" rx="2" fill="#1e293b" />
    <rect x="53" y="90" width="11" height="24" rx="2" fill="#1e293b" />
    <rect x="34" y="108" width="15" height="7" rx="3" fill="#38bdf8" />
    <rect x="51" y="108" width="15" height="7" rx="3" fill="#38bdf8" />

    <!-- Tactical Armor Pants -->
    <rect x="34" y="70" width="32" height="22" rx="3" fill="#0f172a" />
    <rect x="38" y="72" width="24" height="4" fill="#38bdf8" />

    <!-- Torso / Combat Vest -->
    <rect x="30" y="38" width="40" height="34" rx="6" fill="#f59e0b" stroke="#b45309" stroke-width="2" />
    <rect x="36" y="44" width="28" height="22" rx="3" fill="#0369a1" />
    
    <!-- Chest Arc Reactor / Emblem with pulsing glow -->
    <circle cx="50" cy="54" r="5" fill="#38bdf8" filter="url(#glow)">
      <animate attributeName="r" values="4;6;4" dur="1.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;1;0.8" dur="1.2s" repeatCount="indefinite" />
    </circle>

    <!-- Shoulders -->
    <circle cx="28" cy="42" r="7" fill="#0284c7" />
    <circle cx="72" cy="42" r="7" fill="#0284c7" />

    <!-- Helmet / Head -->
    <rect x="34" y="12" width="32" height="26" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    
    <!-- Glowing Visor Eye -->
    <rect x="38" y="20" width="24" height="8" rx="3" fill="#38bdf8" filter="url(#glow)">
      <animate attributeName="fill" values="#38bdf8;#67e8f9;#38bdf8" dur="0.9s" repeatCount="indefinite" />
    </rect>
    <rect x="42" y="22" width="6" height="4" rx="1" fill="#ffffff" />

    <!-- High-tech Antenna -->
    <line x1="62" y1="12" x2="68" y2="4" stroke="#38bdf8" stroke-width="2" />
    <circle cx="68" cy="4" r="2" fill="#ef4444">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" repeatCount="indefinite" />
    </circle>
  </g>
</svg>
`)}`;

// Animated Toxic Mutant Boss with pulsing tentacles, toxic aura and roaring maw
export const ANIMATED_TOXIC_BOSS_DATA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" width="140" height="160">
  <defs>
    <filter id="toxicGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <g id="boss">
    <!-- Ground Shadow -->
    <ellipse cx="70" cy="152" rx="45" ry="8" fill="rgba(0,0,0,0.5)" />

    <!-- Stomping Animation -->
    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-4; 0,0" dur="1s" repeatCount="indefinite" />

    <!-- Toxic Cloud Aura Behind -->
    <circle cx="70" cy="75" r="48" fill="#10b981" opacity="0.25" filter="url(#toxicGlow)">
      <animate attributeName="r" values="44;52;44" dur="1.8s" repeatCount="indefinite" />
    </circle>

    <!-- Heavy Mutant Legs -->
    <rect x="36" y="115" width="22" height="34" rx="6" fill="#064e3b" />
    <rect x="82" y="115" width="22" height="34" rx="6" fill="#064e3b" />
    <!-- Claws on Feet -->
    <polygon points="32,150 44,148 40,154" fill="#facc15" />
    <polygon points="46,150 58,148 54,154" fill="#facc15" />
    <polygon points="78,150 90,148 86,154" fill="#facc15" />
    <polygon points="92,150 104,148 100,154" fill="#facc15" />

    <!-- Massive Mutated Torso -->
    <path d="M 26,45 C 26,45 70,30 114,45 C 124,80 118,125 105,125 C 80,128 60,128 35,125 C 22,125 16,80 26,45 Z" fill="#047857" stroke="#065f46" stroke-width="3" />
    
    <!-- Toxic Veins glowing -->
    <path d="M 40,65 Q 55,85 50,110" stroke="#34d399" stroke-width="3" fill="none" opacity="0.8" />
    <path d="M 100,65 Q 85,85 90,110" stroke="#34d399" stroke-width="3" fill="none" opacity="0.8" />
    <path d="M 70,55 Q 65,80 72,115" stroke="#a7f3d0" stroke-width="2.5" fill="none" opacity="0.9">
      <animate attributeName="stroke" values="#a7f3d0;#34d399;#a7f3d0" dur="1s" repeatCount="indefinite" />
    </path>

    <!-- Spikes on Shoulders -->
    <polygon points="18,48 5,30 28,40" fill="#064e3b" />
    <polygon points="122,48 135,30 112,40" fill="#064e3b" />
    <polygon points="26,38 20,20 38,32" fill="#10b981" />
    <polygon points="114,38 120,20 102,32" fill="#10b981" />

    <!-- Huge Mutant Head -->
    <ellipse cx="70" cy="38" rx="28" ry="24" fill="#064e3b" stroke="#10b981" stroke-width="2" />
    
    <!-- Triple Yellow Glowing Eyes -->
    <circle cx="56" cy="32" r="5" fill="#facc15" filter="url(#toxicGlow)">
      <animate attributeName="fill" values="#facc15;#ef4444;#facc15" dur="1.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="84" cy="32" r="5" fill="#facc15" filter="url(#toxicGlow)">
      <animate attributeName="fill" values="#facc15;#ef4444;#facc15" dur="1.4s" repeatCount="indefinite" />
    </circle>
    <circle cx="70" cy="24" r="6" fill="#facc15" filter="url(#toxicGlow)">
      <animate attributeName="r" values="5;7;5" dur="0.9s" repeatCount="indefinite" />
    </circle>

    <!-- Roaring Razor-Tooth Mouth -->
    <path d="M 48,46 Q 70,62 92,46 Z" fill="#1e1b4b" />
    <polygon points="52,46 56,52 60,46" fill="#ffffff" />
    <polygon points="64,46 68,54 72,46" fill="#ffffff" />
    <polygon points="76,46 80,54 84,46" fill="#ffffff" />
    <polygon points="84,46 88,52 92,46" fill="#ffffff" />
  </g>
</svg>
`)}`;

// Animated Cyber Ghoul for Horde Zombies
export const ANIMATED_HORD_ZOMBIE_DATA = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" width="80" height="100">
  <defs>
    <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <g id="horde-zombie">
    <!-- Ground Shadow -->
    <ellipse cx="40" cy="95" rx="20" ry="4" fill="rgba(0,0,0,0.4)" />

    <!-- Walking Scissor Bob -->
    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="0.6s" repeatCount="indefinite" />

    <!-- Shambling Tattered Legs -->
    <line x1="32" y1="65" x2="26" y2="92" stroke="#1e293b" stroke-width="6" stroke-linecap="round">
      <animate attributeName="x2" values="24;32;24" dur="0.6s" repeatCount="indefinite" />
    </line>
    <line x1="48" y1="65" x2="54" y2="92" stroke="#1e293b" stroke-width="6" stroke-linecap="round">
      <animate attributeName="x2" values="54;46;54" dur="0.6s" repeatCount="indefinite" />
    </line>

    <!-- Torn Zombie Shirt -->
    <rect x="24" y="38" width="32" height="30" rx="4" fill="#0f766e" />
    <polygon points="24,65 30,68 36,65 42,68 48,65 56,67" fill="#0f766e" />

    <!-- Outstretched Claw Arms -->
    <path d="M 24,42 Q 10,48 4,52" stroke="#2dd4bf" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M 56,42 Q 70,48 76,52" stroke="#2dd4bf" stroke-width="5" stroke-linecap="round" fill="none" />

    <!-- Zombie Head with exposed skull -->
    <circle cx="40" cy="24" r="15" fill="#14b8a6" />
    <path d="M 32,10 Q 40,8 48,11 Q 46,18 42,16 Z" fill="#991b1b" />

    <!-- Glowing Yellow Eyes -->
    <circle cx="34" cy="24" r="3.5" fill="#facc15" filter="url(#eyeGlow)" />
    <circle cx="46" cy="24" r="3.5" fill="#facc15" filter="url(#eyeGlow)" />
    <circle cx="35" cy="24" r="1.5" fill="#000000" />
    <circle cx="47" cy="24" r="1.5" fill="#000000" />

    <!-- Gaping Open Mouth -->
    <ellipse cx="40" cy="32" rx="4" ry="3" fill="#042f2e" />
  </g>
</svg>
`)}`;
