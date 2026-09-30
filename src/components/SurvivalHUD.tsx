import React from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles, Crosshair, Bomb, RefreshCw } from 'lucide-react';
import { WeaponInfo, FighterCustomization, WeaponKey } from '../types/game';

interface SurvivalHUDProps {
  customization: FighterCustomization;
  activeWeapon: WeaponInfo;
  availableWeapons: Record<string, WeaponInfo>;
  onSelectWeapon: (key: WeaponKey) => void;
  hp: number;
  maxHp: number;
  totalKills: number;
  currentCombo: number;
  airstrikesAvailable: number;
  onTriggerAirstrike: () => void;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenCustomizer: () => void;
  bossEntity: { hp: number; maxHp: number; active: boolean } | null;
}

export const SurvivalHUD: React.FC<SurvivalHUDProps> = ({
  customization,
  activeWeapon,
  availableWeapons,
  onSelectWeapon,
  hp,
  maxHp,
  totalKills,
  currentCombo,
  airstrikesAvailable,
  onTriggerAirstrike,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
  onOpenCustomizer,
  bossEntity,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* Top Header Row matching the Reference Image */}
      <div className="flex items-start justify-between w-full max-w-7xl mx-auto">
        {/* Left Zone: Weapon Display Box & Red Striped Health Bar */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Weapon Box */}
          <div className="pointer-events-auto bg-slate-900/85 border border-slate-700/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md flex items-center gap-3">
            {/* Weapon SVG / Icon preview */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-1 relative">
              {activeWeapon.key === 'BAZOOKA' && (
                <svg className="w-12 h-12 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" viewBox="0 0 48 48" fill="none">
                  {/* Bazooka Barrel */}
                  <rect x="6" y="20" width="30" height="9" rx="2" fill="currentColor" />
                  <polygon points="36,17 44,24.5 36,32" fill="#ef4444" />
                  <rect x="14" y="29" width="4" height="8" rx="1" fill="#94a3b8" />
                  <rect x="24" y="16" width="6" height="4" fill="#94a3b8" />
                </svg>
              )}
              {activeWeapon.key === 'SHOTGUN' && (
                <svg className="w-12 h-12 text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.6)]" viewBox="0 0 48 48" fill="none">
                  <rect x="4" y="21" width="36" height="6" rx="1" fill="currentColor" />
                  <rect x="12" y="27" width="10" height="5" rx="1" fill="#78350f" />
                  <rect x="6" y="26" width="6" height="8" rx="1" fill="#78350f" />
                </svg>
              )}
              {activeWeapon.key === 'PISTOL' && (
                <svg className="w-10 h-10 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" viewBox="0 0 48 48" fill="none">
                  <rect x="14" y="18" width="22" height="7" rx="1" fill="currentColor" />
                  <rect x="14" y="25" width="7" height="12" rx="1" fill="#334155" />
                </svg>
              )}
              {activeWeapon.key === 'SANDAL_BLASTER' && (
                <svg className="w-11 h-11 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" viewBox="0 0 48 48" fill="none">
                  <ellipse cx="24" cy="24" rx="18" ry="10" fill="#ffffff" />
                  <ellipse cx="24" cy="24" rx="14" ry="7" fill="#0f172a" />
                  <rect x="16" y="18" width="16" height="4" fill="#38bdf8" />
                </svg>
              )}
            </div>

            {/* Weapon Details */}
            <div className="flex flex-col">
              {/* Ammo Row (matching reference screenshot with 3 bullet icons + red count) */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-slate-300">
                  <span className="w-1 h-3.5 bg-slate-200 rounded-sm inline-block" />
                  <span className="w-1 h-3.5 bg-slate-200 rounded-sm inline-block" />
                  <span className="w-1 h-3.5 bg-slate-200 rounded-sm inline-block" />
                </div>
                <span className="font-action text-2xl font-extrabold text-rose-500 tabular-nums leading-none tracking-wider">
                  {activeWeapon.ammo === Infinity ? '∞' : activeWeapon.ammo}
                </span>
              </div>
              {/* Weapon Name */}
              <span className="font-action text-lg text-white font-bold tracking-wider leading-none mt-0.5">
                {activeWeapon.name}
              </span>
            </div>
          </div>

          {/* Red Diagonal Striped Health Bar (Matching reference image) */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="w-48 sm:w-64 h-6 sm:h-7 bg-slate-950/90 border-2 border-rose-600/90 rounded-sm overflow-hidden p-0.5 shadow-xl relative backdrop-blur-md">
              <div
                className="h-full transition-all duration-150 relative overflow-hidden"
                style={{
                  width: `${hpPercent}%`,
                  background: 'repeating-linear-gradient(45deg, #dc2626, #dc2626 8px, #ef4444 8px, #ef4444 16px)',
                  boxShadow: '0 0 10px rgba(239,68,68,0.7)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-action text-sm font-bold text-white tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                HP {Math.ceil(hp)} / {maxHp}
              </div>
            </div>

            {/* Quick Weapon Switch Tabs */}
            <div className="pointer-events-auto flex items-center gap-1 mt-1">
              {(['BAZOOKA', 'SHOTGUN', 'PISTOL', 'SANDAL_BLASTER'] as WeaponKey[]).map((wKey, idx) => {
                const w = availableWeapons[wKey];
                const isActive = activeWeapon.key === wKey;
                return (
                  <button
                    key={wKey}
                    onClick={() => onSelectWeapon(wKey)}
                    className={`px-2 py-1 rounded text-[11px] font-action tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                        : 'bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    [{idx + 1}] {w?.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Zone: Pause Button, Airstrike Call, & Moon Reference */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Airstrike Button (calls down the falling rockets seen in screenshot!) */}
          <button
            onClick={onTriggerAirstrike}
            disabled={airstrikesAvailable <= 0}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-action text-base tracking-wider transition-all ${
              airstrikesAvailable > 0
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 border-amber-400 text-white shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-slate-900/80 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Call Rocket Airstrike [R]"
          >
            <Bomb className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="hidden sm:inline font-bold">AIRSTRIKE</span>
            <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-amber-300">
              x{airstrikesAvailable}
            </span>
          </button>

          {/* Pause Button (White rounded box with black bars matching reference image) */}
          <button
            onClick={onTogglePause}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-white text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
          </button>

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Change Fighter Photos Button */}
          <button
            onClick={onOpenCustomizer}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sky-400 hover:text-sky-300 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
            title="Customize Fighter Photos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Zone: Zombie Kill Counter & Blood Splatter Kill Combo */}
        <div className="flex flex-col items-end gap-2">
          {/* Zombie Kill Counter (e.g. 152 with green zombie icon) */}
          <div className="flex items-center gap-2">
            <span className="font-action text-3xl sm:text-4xl font-extrabold text-white tracking-wider tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {totalKills}
            </span>
            {/* Cartoon Zombie Head Icon matching uploaded image (bloodshot eyes, green skin, red tie) */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden relative">
              <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none">
                {/* Green Head with Spiky Black Hair */}
                <path d="M12 10 C8 2, 22 2, 28 8 C32 14, 30 26, 26 30 C20 33, 14 30, 12 24 Z" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
                <path d="M11 12 C8 6, 14 4, 15 8 C12 6, 10 9, 11 12 Z" fill="#0f172a" />
                <path d="M8 16 C6 10, 11 8, 12 12 Z" fill="#0f172a" />
                {/* Bulging Bloodshot White/Red Eyes with tiny pupils */}
                <circle cx="16" cy="18" r="5.5" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
                <circle cx="25" cy="16" r="4.8" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
                {/* Red veins */}
                <path d="M13 16 Q15 17 16 18" stroke="#ef4444" strokeWidth="0.8" />
                <path d="M18 15 Q17 17 16 18" stroke="#ef4444" strokeWidth="0.8" />
                <path d="M23 14 Q24 15 25 16" stroke="#ef4444" strokeWidth="0.8" />
                <circle cx="16" cy="18" r="1.5" fill="#000000" />
                <circle cx="25" cy="16" r="1.4" fill="#000000" />
                {/* Nasal Cavity */}
                <ellipse cx="20" cy="22" rx="1.2" ry="1.8" fill="#365314" />
                {/* Jagged teeth */}
                <rect x="16" y="26" width="2" height="2" fill="#ffffff" stroke="#365314" strokeWidth="0.5" />
                <rect x="19" y="25" width="2" height="2.5" fill="#ffffff" stroke="#365314" strokeWidth="0.5" />
                <rect x="22" y="26" width="2" height="2" fill="#ffffff" stroke="#365314" strokeWidth="0.5" />
                {/* Red tie knot at neck */}
                <polygon points="19,32 23,32 22,38 20,38" fill="#ef4444" />
              </svg>
            </div>
          </div>

          {/* Blood Splatter Kill Combo (matching the bold red splatter in the screenshot!) */}
          {currentCombo > 0 && (
            <div className="relative flex items-center justify-center animate-in zoom-in-50 duration-150">
              {/* Dynamic Blood Splatter SVG Graphic */}
              <svg
                className="w-24 h-24 sm:w-28 sm:h-28 text-rose-600 drop-shadow-[0_4px_16px_rgba(225,29,72,0.8)]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M50 15 C65 10, 85 20, 82 40 C95 48, 92 68, 78 78 C68 92, 45 95, 30 85 C15 90, 8 72, 16 55 C5 42, 18 20, 35 22 Z" />
                <circle cx="20" cy="15" r="4" />
                <circle cx="88" cy="24" r="5" />
                <circle cx="85" cy="85" r="3" />
                <circle cx="12" cy="80" r="4.5" />
              </svg>

              {/* Kill Combo Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className="font-action text-3xl sm:text-4xl font-extrabold text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {currentCombo}
                </span>
                <span className="font-action text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase -mt-0.5">
                  KILL COMBO
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boss Health Bar Overlay if Boss Zombie Lontoy is Active */}
      {bossEntity && bossEntity.active && (
        <div className="self-center w-full max-w-xl bg-slate-900/90 border border-emerald-500/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-2">
              <img
                src={customization.enemyImage}
                alt={customization.enemyName}
                className="w-7 h-7 rounded-full object-cover border-2 border-emerald-400"
              />
              <span className="font-action text-lg font-bold text-emerald-400 tracking-wider">
                {customization.enemyName}
              </span>
              <span className="text-[11px] text-slate-400">· MUTATED POLO BOSS</span>
            </div>
            <span className="font-mono text-xs text-slate-300 tabular-nums">
              {Math.ceil(bossEntity.hp)} / {bossEntity.maxHp} HP
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)] transition-all duration-100"
              style={{ width: `${Math.max(0, Math.min(100, (bossEntity.hp / bossEntity.maxHp) * 100))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
