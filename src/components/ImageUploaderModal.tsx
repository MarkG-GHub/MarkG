import React, { useState } from 'react';
import {
  Upload,
  X,
  RotateCcw,
  Sparkles,
  Check,
  User,
  Skull,
  Ghost,
  Compass,
  Sliders,
  Play,
  Layers,
} from 'lucide-react';
import { FighterCustomization, CharacterRenderMode } from '../types/game';
import { DEFAULT_FIGHTERS, SURVIVAL_BACKGROUND } from '../data/characters';
import {
  ANIMATED_PIXEL_HERO_DATA,
  ANIMATED_TOXIC_BOSS_DATA,
  ANIMATED_HORD_ZOMBIE_DATA,
} from '../data/characterPresets';

interface ImageUploaderModalProps {
  customization: FighterCustomization;
  onSave: (newCustomization: FighterCustomization) => void;
  onClose: () => void;
  defaultTab?: 'hero' | 'enemy' | 'horde' | 'background';
}

type TabType = 'hero' | 'enemy' | 'horde' | 'background';

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({
  customization,
  onSave,
  onClose,
  defaultTab = 'hero',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  // Hero State
  const [heroImg, setHeroImg] = useState<string>(customization.heroImage);
  const [heroName, setHeroName] = useState<string>(customization.heroName);
  const [heroAura, setHeroAura] = useState<string>(customization.heroAuraColor);
  const [heroScale, setHeroScale] = useState<number>(customization.heroScale || 1.0);
  const [heroRenderMode, setHeroRenderMode] = useState<CharacterRenderMode>(
    customization.heroRenderMode || 'FULL_SPRITE'
  );
  const [heroOffsetY, setHeroOffsetY] = useState<number>(customization.heroOffsetY || 0);

  // Boss Enemy State
  const [enemyImg, setEnemyImg] = useState<string>(customization.enemyImage);
  const [enemyName, setEnemyName] = useState<string>(customization.enemyName);
  const [enemyAura, setEnemyAura] = useState<string>(customization.enemyAuraColor);
  const [enemyScale, setEnemyScale] = useState<number>(customization.enemyScale || 1.35);
  const [enemyRenderMode, setEnemyRenderMode] = useState<CharacterRenderMode>(
    customization.enemyRenderMode || 'FULL_SPRITE'
  );
  const [enemyOffsetY, setEnemyOffsetY] = useState<number>(customization.enemyOffsetY || 0);

  // Horde Zombie State
  const [hordeImg, setHordeImg] = useState<string>(customization.hordeZombieImage || '');
  const [hordeName, setHordeName] = useState<string>(customization.hordeZombieName || 'Swarm Zombie');
  const [hordeScale, setHordeScale] = useState<number>(customization.hordeZombieScale || 1.0);
  const [hordeOffsetY, setHordeOffsetY] = useState<number>(customization.hordeZombieOffsetY || 0);

  // Background State
  const [bgImg, setBgImg] = useState<string>(customization.backgroundImage || SURVIVAL_BACKGROUND);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'hero' | 'enemy' | 'horde' | 'background'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (target === 'hero') {
        setHeroImg(result);
        if (isGif || isPng) setHeroRenderMode('FULL_SPRITE');
      } else if (target === 'enemy') {
        setEnemyImg(result);
        if (isGif || isPng) setEnemyRenderMode('FULL_SPRITE');
      } else if (target === 'horde') {
        setHordeImg(result);
      } else if (target === 'background') {
        setBgImg(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetCurrentTab = () => {
    if (activeTab === 'hero') {
      setHeroImg(DEFAULT_FIGHTERS.heroImage);
      setHeroName(DEFAULT_FIGHTERS.heroName);
      setHeroAura(DEFAULT_FIGHTERS.heroAuraColor);
      setHeroScale(1.0);
      setHeroRenderMode('FULL_SPRITE');
      setHeroOffsetY(0);
    } else if (activeTab === 'enemy') {
      setEnemyImg(DEFAULT_FIGHTERS.enemyImage);
      setEnemyName(DEFAULT_FIGHTERS.enemyName);
      setEnemyAura(DEFAULT_FIGHTERS.enemyAuraColor);
      setEnemyScale(1.35);
      setEnemyRenderMode('FULL_SPRITE');
      setEnemyOffsetY(0);
    } else if (activeTab === 'horde') {
      setHordeImg('');
      setHordeName('Swarm Zombie');
      setHordeScale(1.0);
      setHordeOffsetY(0);
    } else if (activeTab === 'background') {
      setBgImg(SURVIVAL_BACKGROUND);
    }
  };

  const handleResetAll = () => {
    setHeroImg(DEFAULT_FIGHTERS.heroImage);
    setHeroName(DEFAULT_FIGHTERS.heroName);
    setHeroAura(DEFAULT_FIGHTERS.heroAuraColor);
    setHeroScale(1.0);
    setHeroRenderMode('FULL_SPRITE');
    setHeroOffsetY(0);

    setEnemyImg(DEFAULT_FIGHTERS.enemyImage);
    setEnemyName(DEFAULT_FIGHTERS.enemyName);
    setEnemyAura(DEFAULT_FIGHTERS.enemyAuraColor);
    setEnemyScale(1.35);
    setEnemyRenderMode('FULL_SPRITE');
    setEnemyOffsetY(0);

    setHordeImg('');
    setHordeName('Swarm Zombie');
    setHordeScale(1.0);
    setHordeOffsetY(0);

    setBgImg(SURVIVAL_BACKGROUND);
  };

  const handleSave = () => {
    onSave({
      ...customization,
      heroName: heroName.trim() || 'Pal Oren',
      heroImage: heroImg,
      heroAuraColor: heroAura,
      heroScale,
      heroRenderMode,
      heroOffsetY,

      enemyName: enemyName.trim() || 'Zombie Lontoy',
      enemyImage: enemyImg,
      enemyAuraColor: enemyAura,
      enemyScale,
      enemyRenderMode,
      enemyOffsetY,

      hordeZombieImage: hordeImg,
      hordeZombieName: hordeName.trim() || 'Swarm Zombie',
      hordeZombieScale: hordeScale,
      hordeZombieOffsetY: hordeOffsetY,

      backgroundImage: bgImg,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-6 my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
                GIF & PNG ENGINE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Sprites & Arena Customizer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload custom <strong className="text-sky-300">Animated GIFs</strong> and <strong className="text-emerald-300">Transparent PNGs</strong> for Main Character, Boss Villain, Horde Zombies, or change the Arena Background.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 py-3 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-sky-300" />
            <span>Main Character (Hero)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enemy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'enemy'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4 text-rose-300" />
            <span>Boss Villain (Lontoy)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('horde')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'horde'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Ghost className="w-4 h-4 text-emerald-300" />
            <span>Horde Zombie (PNG / GIF)</span>
            {hordeImg && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'background'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Arena Background</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* TAB 1: HERO (Main Character) */}
          {activeTab === 'hero' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-sky-500/20">
              {/* Preview with Transparency Checkered Grid */}
              <div className="flex flex-col items-center justify-center gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <div
                  className="w-44 h-48 rounded-xl border-2 shadow-2xl relative flex items-center justify-center overflow-hidden p-2"
                  style={{
                    borderColor: heroAura,
                    backgroundImage:
                      'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #090d16 1px)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 8px 8px',
                  }}
                >
                  <img
                    src={heroImg}
                    alt={heroName}
                    className="max-w-full max-h-full object-contain filter transition-transform duration-200"
                    style={{
                      transform: `scale(${heroScale}) translateY(${heroOffsetY}px)`,
                      filter: `drop-shadow(0 0 16px ${heroAura})`,
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-sky-300 font-mono border border-slate-700">
                    {heroRenderMode === 'FULL_SPRITE' ? 'Full Sprite Mode' : 'Avatar Head Mode'}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    Hero Preview (Animated GIF & PNG Supported)
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Transparent backgrounds stay transparent! Weapon will be wielded in hands.
                  </p>
                </div>

                {/* Built-in GIF / PNG Quick Presets */}
                <div className="w-full pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 text-center">
                    Quick Sample Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setHeroImg(ANIMATED_PIXEL_HERO_DATA);
                        setHeroRenderMode('FULL_SPRITE');
                        setHeroScale(1.0);
                        setHeroOffsetY(0);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-500/50 rounded-lg text-[11px] text-slate-300 hover:text-sky-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>Animated Commando</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroImg(DEFAULT_FIGHTERS.heroImage);
                        setHeroRenderMode('FULL_SPRITE');
                        setHeroScale(1.0);
                        setHeroOffsetY(0);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-sky-950 border border-slate-700 hover:border-sky-500/50 rounded-lg text-[11px] text-slate-300 hover:text-sky-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-3 h-3 text-amber-400" />
                      <span>Original Pal Oren</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3.5 justify-center">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Hero Name
                  </label>
                  <input
                    type="text"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    placeholder="Pal Oren"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Upload Hero (Animated GIF / Transparent PNG)
                  </span>
                  <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-sky-500/50 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-950/40 rounded-xl cursor-pointer text-xs font-semibold text-sky-300 transition-colors">
                    <Upload className="w-4 h-4 text-sky-400" />
                    <span>Upload GIF or PNG File</span>
                    <input
                      type="file"
                      accept="image/gif,image/png,image/jpeg,image/webp,.gif,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'hero')}
                    />
                  </label>
                </div>

                {/* Render Mode Toggle */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Character Sprite Style
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroRenderMode('FULL_SPRITE')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        heroRenderMode === 'FULL_SPRITE'
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Full GIF / PNG Sprite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroRenderMode('AVATAR_BODY')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        heroRenderMode === 'AVATAR_BODY'
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Fighter Head Avatar</span>
                    </button>
                  </div>
                </div>

                {/* Size and Offset Sliders */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Sprite Size</span>
                      <span className="text-sky-400 font-mono">{heroScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={heroScale}
                      onChange={(e) => setHeroScale(parseFloat(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Ground Offset</span>
                      <span className="text-sky-400 font-mono">{heroOffsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      step="2"
                      value={heroOffsetY}
                      onChange={(e) => setHeroOffsetY(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Aura Color Selection */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Hero Aura Glow:
                  </span>
                  <div className="flex items-center gap-2.5">
                    {['#38bdf8', '#3b82f6', '#f59e0b', '#10b981', '#ec4899', '#a855f7'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setHeroAura(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          heroAura === c ? 'scale-125 border-white shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOSS VILLAIN (Lontoy) */}
          {activeTab === 'enemy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-rose-500/20">
              {/* Preview with Transparency Checkered Grid */}
              <div className="flex flex-col items-center justify-center gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <div
                  className="w-44 h-48 rounded-xl border-2 shadow-2xl relative flex items-center justify-center overflow-hidden p-2"
                  style={{
                    borderColor: enemyAura,
                    backgroundImage:
                      'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #090d16 1px)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 8px 8px',
                  }}
                >
                  <img
                    src={enemyImg}
                    alt={enemyName}
                    className="max-w-full max-h-full object-contain filter transition-transform duration-200"
                    style={{
                      transform: `scale(${enemyScale * 0.75}) translateY(${enemyOffsetY}px)`,
                      filter: `drop-shadow(0 0 18px ${enemyAura})`,
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-rose-300 font-mono border border-slate-700">
                    {enemyRenderMode === 'FULL_SPRITE' ? 'Full Boss Sprite' : 'Avatar Head Mode'}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                    Boss Villain Preview (GIF & PNG Supported)
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Spawns with massive health bar and animated boss rage!
                  </p>
                </div>

                {/* Built-in Boss GIF / PNG Quick Presets */}
                <div className="w-full pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 text-center">
                    Quick Sample Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEnemyImg(ANIMATED_TOXIC_BOSS_DATA);
                        setEnemyRenderMode('FULL_SPRITE');
                        setEnemyScale(1.35);
                        setEnemyOffsetY(0);
                        setEnemyAura('#10b981');
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-500/50 rounded-lg text-[11px] text-slate-300 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Animated Toxic Boss</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEnemyImg(DEFAULT_FIGHTERS.enemyImage);
                        setEnemyRenderMode('FULL_SPRITE');
                        setEnemyScale(1.35);
                        setEnemyOffsetY(0);
                        setEnemyAura('#4ade80');
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-500/50 rounded-lg text-[11px] text-slate-300 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Skull className="w-3 h-3 text-rose-400" />
                      <span>Original Lontoy</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3.5 justify-center">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Boss Villain Name
                  </label>
                  <input
                    type="text"
                    value={enemyName}
                    onChange={(e) => setEnemyName(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                    placeholder="Zombie Lontoy"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Upload Boss Villain (Animated GIF / Transparent PNG)
                  </span>
                  <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-rose-500/50 hover:border-rose-400 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl cursor-pointer text-xs font-semibold text-rose-300 transition-colors">
                    <Upload className="w-4 h-4 text-rose-400" />
                    <span>Upload GIF or PNG File</span>
                    <input
                      type="file"
                      accept="image/gif,image/png,image/jpeg,image/webp,.gif,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'enemy')}
                    />
                  </label>
                </div>

                {/* Render Mode Toggle */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Boss Sprite Style
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEnemyRenderMode('FULL_SPRITE')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        enemyRenderMode === 'FULL_SPRITE'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Full GIF / PNG Sprite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnemyRenderMode('AVATAR_BODY')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        enemyRenderMode === 'AVATAR_BODY'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Skull className="w-3.5 h-3.5" />
                      <span>Boss Head Frame</span>
                    </button>
                  </div>
                </div>

                {/* Size and Offset Sliders */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Boss Scale</span>
                      <span className="text-rose-400 font-mono">{enemyScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.05"
                      value={enemyScale}
                      onChange={(e) => setEnemyScale(parseFloat(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Ground Offset</span>
                      <span className="text-rose-400 font-mono">{enemyOffsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      step="2"
                      value={enemyOffsetY}
                      onChange={(e) => setEnemyOffsetY(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Toxic Aura Selection */}
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Boss Toxic Aura:
                  </span>
                  <div className="flex items-center gap-2.5">
                    {['#4ade80', '#ef4444', '#a855f7', '#fb923c', '#eab308', '#ec4899'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEnemyAura(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                          enemyAura === c ? 'scale-125 border-white shadow-lg' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HORDE ZOMBIE (Swarm) */}
          {activeTab === 'horde' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-emerald-500/20">
              <div className="flex flex-col items-center justify-center gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
                <div
                  className="w-44 h-48 rounded-xl border-2 border-emerald-500/60 p-2 shadow-2xl relative flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage:
                      'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #090d16 1px)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 8px 8px',
                  }}
                >
                  {hordeImg ? (
                    <img
                      src={hordeImg}
                      alt={hordeName}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_14px_rgba(16,185,129,0.6)]"
                      style={{
                        transform: `scale(${hordeScale}) translateY(${hordeOffsetY}px)`,
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center text-slate-500">
                      <Ghost className="w-12 h-12 text-slate-600 mb-2" />
                      <span className="text-xs">Arcade Procedural Zombies</span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    {hordeImg ? 'Custom Horde Zombie Active' : 'Default Arcade Horde'}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Every swarm zombie marching down the road will display this sprite!
                  </p>
                </div>

                {/* Built-in Horde Zombie Quick Preset */}
                <div className="w-full pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5 text-center">
                    Quick Sample Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setHordeImg(ANIMATED_HORD_ZOMBIE_DATA);
                        setHordeScale(1.0);
                        setHordeOffsetY(0);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-[11px] text-slate-300 hover:text-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Animated Ghoul</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHordeImg('');
                        setHordeScale(1.0);
                        setHordeOffsetY(0);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-[11px] text-slate-300 hover:text-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>Procedural Classic</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3.5 justify-center">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Horde Zombie Classification / Name
                  </label>
                  <input
                    type="text"
                    value={hordeName}
                    onChange={(e) => setHordeName(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Swarm Zombie"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Upload Horde Zombie (GIF / Transparent PNG)
                  </span>
                  <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 rounded-xl cursor-pointer text-xs font-semibold text-emerald-300 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Zombie GIF / PNG</span>
                    <input
                      type="file"
                      accept="image/gif,image/png,image/jpeg,image/webp,.gif,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'horde')}
                    />
                  </label>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    ✨ Transparent PNGs or animated GIFs automatically get scissor-walking legs and glowing yellow eyes.
                  </span>
                </div>

                {/* Size and Offset Sliders */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Zombie Scale</span>
                      <span className="text-emerald-400 font-mono">{hordeScale.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.05"
                      value={hordeScale}
                      onChange={(e) => setHordeScale(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Ground Offset</span>
                      <span className="text-emerald-400 font-mono">{hordeOffsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      step="2"
                      value={hordeOffsetY}
                      onChange={(e) => setHordeOffsetY(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {hordeImg && (
                  <button
                    type="button"
                    onClick={() => setHordeImg('')}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revert to Default Procedural Zombies</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ARENA BACKGROUND */}
          {activeTab === 'background' && (
            <div className="flex flex-col gap-4 bg-slate-950/40 p-5 rounded-2xl border border-amber-500/20">
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
                <img
                  src={bgImg}
                  alt="Game Arena Background"
                  className="w-full h-full object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700">
                  <span className="text-xs font-bold text-amber-400">
                    Active Background: Altavas Public Transport Terminal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    Upload New Arena Background (PNG / JPG / GIF)
                  </span>
                  <label className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-amber-500/50 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40 rounded-xl cursor-pointer text-xs font-semibold text-amber-300 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Custom Background</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'background')}
                    />
                  </label>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    High-resolution widescreen 16:9 images look best in the 2D street arena.
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-slate-300">Quick Background Options</span>
                  <button
                    type="button"
                    onClick={() => setBgImg(SURVIVAL_BACKGROUND)}
                    className="w-full py-2.5 px-3 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-amber-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>Restore Altavas Terminal Background</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetCurrentTab}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Tab
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              className="flex-1 sm:flex-none px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              Reset All Defaults
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 rounded-xl shadow-lg shadow-sky-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save & Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
