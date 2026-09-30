import React from 'react';
import {
  Play,
  Sparkles,
  Upload,
  HelpCircle,
  ShieldAlert,
  Ghost,
  Compass,
  User,
  Skull,
  Image as ImageIcon,
} from 'lucide-react';
import { FighterCustomization, WeaponInfo } from '../types/game';

interface SurvivalTitleMenuProps {
  customization: FighterCustomization;
  weapons: Record<string, WeaponInfo>;
  onStartGame: () => void;
  onOpenCustomizer: (tab?: 'hero' | 'enemy' | 'horde' | 'background') => void;
  highScore: number;
}

export const SurvivalTitleMenu: React.FC<SurvivalTitleMenuProps> = ({
  customization,
  onStartGame,
  onOpenCustomizer,
  highScore,
}) => {
  return (
    <div className="relative z-30 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center min-h-[85vh]">
      {/* Title Lockup */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-rose-500 font-bold px-2 py-0.5 rounded bg-rose-950/70 border border-rose-500/40">
            2D HORDE SURVIVAL
          </span>
          <span className="text-xs uppercase tracking-widest text-sky-400 font-bold px-2 py-0.5 rounded bg-sky-950/70 border border-sky-500/40">
            ALTAVAS TERMINAL ARENA
          </span>
          {highScore > 0 && (
            <span className="text-xs text-amber-400 font-mono">
              RECORD KILLS: {highScore.toLocaleString()}
            </span>
          )}
        </div>

        <h1 className="font-action text-6xl md:text-8xl tracking-wider font-extrabold leading-none text-white drop-shadow-[0_4px_24px_rgba(225,29,72,0.4)]">
          <span className="text-amber-400">PAL OREN</span>
          <span className="text-slate-500 text-4xl md:text-6xl mx-3">·</span>
          <span className="text-rose-500">ZOMBIE SURVIVAL</span>
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mt-2 font-medium">
          Survive the midnight zombie outbreak at the <strong className="text-amber-300">Altavas Public Transport Terminal</strong>! Wield the{' '}
          <strong className="text-amber-400">Bazooka</strong>, shotgun, and unleash{' '}
          <strong className="text-rose-400">Rocket Airstrikes</strong> against Mutated Boss Lontoy.
        </p>
      </div>

      {/* Start and Customizer Actions (Top Center Stage) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mb-6">
        <button
          onClick={onStartGame}
          className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-action text-2xl font-extrabold tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-current" />
          START SURVIVAL
        </button>

        <button
          onClick={() => onOpenCustomizer('hero')}
          className="w-full sm:w-auto py-4 px-5 rounded-xl border border-sky-500/60 bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 hover:bg-sky-900/60 text-white font-action text-xl tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
          title="Upload Animated GIFs & Transparent PNGs for Main Character, Boss Villain, Horde Zombie, and Arena Background"
        >
          <Upload className="w-5 h-5 text-sky-400" />
          CHANGE SPRITES & BG (GIF / PNG)
        </button>
      </div>

      {/* 4 Customization Showcase Cards (Main Character, Boss Villain, Horde Zombie, Arena BG) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full max-w-5xl mb-6">
        {/* 1. Survivor Card */}
        <div className="bg-slate-900/85 border border-sky-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-2 p-0.5 shadow-lg shrink-0 bg-slate-800"
              style={{ borderColor: customization.heroAuraColor }}
            >
              <img
                src={customization.heroImage}
                alt={customization.heroName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3" /> Main Hero
              </span>
              <h3 className="font-action text-xl text-white font-bold leading-tight truncate">
                {customization.heroName}
              </h3>
              <span className="text-[11px] text-slate-400 truncate">Bazooka Striker</span>
            </div>
          </div>
          <button
            onClick={() => onOpenCustomizer('hero')}
            className="mt-3 w-full py-1.5 px-2 bg-sky-950/60 hover:bg-sky-900 border border-sky-500/30 text-sky-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Change Hero (GIF/PNG)</span>
          </button>
        </div>

        {/* 2. Zombie Boss Card */}
        <div className="bg-slate-900/85 border border-rose-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-2 p-0.5 shadow-lg shrink-0 bg-slate-800"
              style={{ borderColor: customization.enemyAuraColor }}
            >
              <img
                src={customization.enemyImage}
                alt={customization.enemyName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Skull className="w-3 h-3" /> Boss Villain
              </span>
              <h3 className="font-action text-xl text-white font-bold leading-tight truncate">
                {customization.enemyName}
              </h3>
              <span className="text-[11px] text-slate-400 truncate">Horde Commander</span>
            </div>
          </div>
          <button
            onClick={() => onOpenCustomizer('enemy')}
            className="mt-3 w-full py-1.5 px-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Change Boss (GIF/PNG)</span>
          </button>
        </div>

        {/* 3. Horde Zombie Card */}
        <div className="bg-slate-900/85 border border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-500/50 p-1 shadow-lg shrink-0 bg-slate-950 flex items-center justify-center">
              {customization.hordeZombieImage ? (
                <img
                  src={customization.hordeZombieImage}
                  alt={customization.hordeZombieName || 'Horde Zombie'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Ghost className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Ghost className="w-3 h-3" /> Horde Zombie
              </span>
              <h3 className="font-action text-xl text-white font-bold leading-tight truncate">
                {customization.hordeZombieName || 'Swarm Zombie'}
              </h3>
              <span className="text-[11px] text-slate-400 truncate">
                {customization.hordeZombieImage ? 'Custom GIF/PNG Active' : 'Procedural Swarm'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenCustomizer('horde')}
            className="mt-3 w-full py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Change Horde (GIF/PNG)</span>
          </button>
        </div>

        {/* 4. Arena Background Card */}
        <div className="bg-slate-900/85 border border-amber-500/40 rounded-xl p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-500/50 shadow-lg shrink-0 bg-slate-950">
              <img
                src={customization.backgroundImage}
                alt="Arena Background"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3" /> Arena Background
              </span>
              <h3 className="font-action text-xl text-white font-bold leading-tight truncate">
                Altavas Terminal
              </h3>
              <span className="text-[11px] text-slate-400 truncate">Uploaded Arena BG</span>
            </div>
          </div>
          <button
            onClick={() => onOpenCustomizer('background')}
            className="mt-3 w-full py-1.5 px-2 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Change Arena BG</span>
          </button>
        </div>
      </div>

      {/* Control Cheatsheet */}
      <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-400">
        <div className="flex items-center justify-between font-semibold text-slate-300 mb-1.5">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Street Survival Controls</span>
          </div>
          <span className="text-[11px] text-amber-400 font-mono">
            PRESS [R] FOR MISSILE AIRSTRIKE
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
            <span className="font-mono text-white block font-bold">A / D · ARROWS</span>
            <span className="text-[10px] text-slate-500">Run Left / Right</span>
          </div>
          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
            <span className="font-mono text-white block font-bold">SPACE / CLICK</span>
            <span className="text-[10px] text-slate-500">Fire Weapon</span>
          </div>
          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
            <span className="font-mono text-amber-300 block font-bold">KEYS 1, 2, 3, 4</span>
            <span className="text-[10px] text-slate-500">Switch Weapon</span>
          </div>
          <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
            <span className="font-mono text-rose-400 block font-bold">KEY [R]</span>
            <span className="text-[10px] text-slate-500">Rocket Airstrike</span>
          </div>
        </div>
      </div>
    </div>
  );
};
