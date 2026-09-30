/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SurvivalTitleMenu } from './components/SurvivalTitleMenu';
import { SurvivalCanvas } from './components/SurvivalCanvas';
import { SurvivalHUD } from './components/SurvivalHUD';
import { SurvivalControls } from './components/GameControls';
import { ImageUploaderModal } from './components/ImageUploaderModal';
import { BattleDialogue } from './components/BattleDialogue';
import { GameOverModal } from './components/GameOverModal';
import {
  FighterCustomization,
  GameState,
  SurvivalStats,
  WeaponInfo,
  WeaponKey,
} from './types/game';
import { DEFAULT_FIGHTERS, WEAPON_REGISTRY } from './data/characters';
import { sounds } from './services/soundEffects';
import { Swords, Volume2, VolumeX, Upload, Play, Pause, Skull } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');

  const [customization, setCustomization] = useState<FighterCustomization>(() => {
    const saved = localStorage.getItem('pal_oren_survival_customization');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_FIGHTERS,
          ...parsed,
          backgroundImage:
            parsed.backgroundImage && !parsed.backgroundImage.includes('survival_street_bg')
              ? parsed.backgroundImage
              : DEFAULT_FIGHTERS.backgroundImage,
        };
      } catch {
        return DEFAULT_FIGHTERS;
      }
    }
    return DEFAULT_FIGHTERS;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [customizerTab, setCustomizerTab] = useState<'hero' | 'enemy' | 'horde' | 'background'>('hero');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const openCustomizer = (tab: 'hero' | 'enemy' | 'horde' | 'background' = 'hero') => {
    setCustomizerTab(tab);
    setIsCustomizerOpen(true);
  };
  const [autoFire, setAutoFire] = useState<boolean>(false);
  const [airstrikeSignal, setAirstrikeSignal] = useState<number>(0);

  // Weapons State
  const [weapons, setWeapons] = useState<Record<string, WeaponInfo>>(WEAPON_REGISTRY);
  const [activeWeaponKey, setActiveWeaponKey] = useState<WeaponKey>('BAZOOKA');

  // Active Dialogue State
  const [dialogue, setDialogue] = useState<{
    id: number;
    speaker: 'HERO' | 'ENEMY';
    text: string;
    avatar: string;
    name: string;
  } | null>(null);

  // HUD State
  const [hudState, setHudState] = useState({
    hp: 100,
    maxHp: 100,
    totalKills: 0,
    currentCombo: 0,
    airstrikesAvailable: 2,
    bossEntity: null as { hp: number; maxHp: number; active: boolean } | null,
  });

  // Survival Stats
  const [stats, setStats] = useState<SurvivalStats>({
    wave: 1,
    totalKills: 0,
    currentCombo: 0,
    maxCombo: 0,
    shotsFired: 0,
    shotsHit: 0,
    damageDealt: 0,
    airstrikesUsed: 0,
    score: 0,
    highScore: 0,
  });

  // Load record high score
  useEffect(() => {
    const saved = localStorage.getItem('pal_oren_survival_highscore');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        setStats((prev) => ({ ...prev, highScore: parsed }));
      }
    }
  }, []);

  // Save customization changes
  const handleSaveCustomization = (newCust: FighterCustomization) => {
    setCustomization(newCust);
    localStorage.setItem('pal_oren_survival_customization', JSON.stringify(newCust));
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  // Dialogue Trigger
  const triggerDialogue = useCallback(
    (speaker: 'HERO' | 'ENEMY', text: string, name: string, avatar: string) => {
      setDialogue({
        id: Date.now(),
        speaker,
        text,
        name,
        avatar,
      });

      setTimeout(() => {
        setDialogue((prev) => (prev && prev.text === text ? null : prev));
      }, 4000);
    },
    []
  );

  // Weapon ammo updater
  const handleUpdateWeaponAmmo = (key: WeaponKey, newAmmo: number) => {
    setWeapons((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ammo: newAmmo,
      },
    }));
  };

  // Cycle Next Weapon (for mobile button)
  const handleCycleWeapon = () => {
    const keys: WeaponKey[] = ['BAZOOKA', 'SHOTGUN', 'PISTOL', 'SANDAL_BLASTER'];
    const currentIdx = keys.indexOf(activeWeaponKey);
    const nextKey = keys[(currentIdx + 1) % keys.length];
    setActiveWeaponKey(nextKey);
  };

  // Check Game Over & High Score
  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      if (stats.totalKills > stats.highScore) {
        localStorage.setItem('pal_oren_survival_highscore', stats.totalKills.toString());
        setStats((prev) => ({ ...prev, highScore: prev.totalKills }));
      }
    }
  }, [gameState, stats.totalKills, stats.highScore]);

  // Mobile movement simulation
  const handleMobileMoveStart = (dir: 'left' | 'right') => {
    const key = dir === 'left' ? 'a' : 'd';
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  const handleMobileMoveEnd = (dir: 'left' | 'right') => {
    const key = dir === 'left' ? 'a' : 'd';
    window.dispatchEvent(new KeyboardEvent('keyup', { key }));
  };

  const handleMobileShootStart = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  };

  const handleMobileShootEnd = () => {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Clean nav) - Zone 3 (1-2 primary actions) */}
      <header className="relative z-40 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setGameState('TITLE_MENU')}
          className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Skull className="w-5 h-5 text-rose-500" />
          <span>Pal Oren: 2D Zombie Survival</span>
        </button>

        {/* Zone 2: 4 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setGameState(gameState === 'PLAYING' ? 'TITLE_MENU' : 'PLAYING')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {gameState === 'PLAYING' ? 'Quit to Menu' : 'Play Survival'}
          </button>
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Custom Photos
          </button>
          <span className="text-slate-500 font-mono">
            Best Kills: {stats.highScore.toLocaleString()}
          </span>
        </nav>

        {/* Zone 3: 1-2 Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => openCustomizer('hero')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-lg hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Sprites & BG</span>
          </button>

          {gameState === 'TITLE_MENU' ? (
            <button
              onClick={() => setGameState('PLAYING')}
              className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 rounded-lg shadow-md shadow-rose-600/30 transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Start Survival
            </button>
          ) : (
            <button
              onClick={() => setGameState(gameState === 'PAUSED' ? 'PLAYING' : 'PAUSED')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {gameState === 'PAUSED' ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </header>

      {/* Main Arena View */}
      <main className="relative flex-1 flex items-center justify-center overflow-hidden">
        {gameState === 'TITLE_MENU' ? (
          <SurvivalTitleMenu
            customization={customization}
            weapons={weapons}
            onStartGame={() => setGameState('PLAYING')}
            onOpenCustomizer={openCustomizer}
            highScore={stats.highScore}
          />
        ) : (
          <div className="relative w-full h-[calc(100vh-56px)] flex flex-col items-center justify-center">
            {/* The 2D Side-scrolling Survival Canvas Engine */}
            <SurvivalCanvas
              customization={customization}
              gameState={gameState}
              setGameState={setGameState}
              activeWeapon={weapons[activeWeaponKey]}
              onUpdateWeaponAmmo={handleUpdateWeaponAmmo}
              onUpdateStats={setStats}
              onTriggerDialogue={triggerDialogue}
              onUpdateHudState={setHudState}
              airstrikeSignal={airstrikeSignal}
              autoFire={autoFire}
            />

            {/* Reference Image Survival HUD */}
            <SurvivalHUD
              customization={customization}
              activeWeapon={weapons[activeWeaponKey]}
              availableWeapons={weapons}
              onSelectWeapon={setActiveWeaponKey}
              hp={hudState.hp}
              maxHp={hudState.maxHp}
              totalKills={hudState.totalKills}
              currentCombo={hudState.currentCombo}
              airstrikesAvailable={hudState.airstrikesAvailable}
              onTriggerAirstrike={() => setAirstrikeSignal((s) => s + 1)}
              isPaused={gameState === 'PAUSED'}
              isMuted={isMuted}
              onTogglePause={() => setGameState(gameState === 'PAUSED' ? 'PLAYING' : 'PAUSED')}
              onToggleMute={handleToggleMute}
              onOpenCustomizer={() => openCustomizer('hero')}
              bossEntity={hudState.bossEntity}
            />

            {/* Comic Banter Dialogue Speech Bubbles */}
            <BattleDialogue dialogue={dialogue} />

            {/* Mobile / Tablet Virtual Controls */}
            <SurvivalControls
              onMoveStart={handleMobileMoveStart}
              onMoveEnd={handleMobileMoveEnd}
              onShootStart={handleMobileShootStart}
              onShootEnd={handleMobileShootEnd}
              onNextWeapon={handleCycleWeapon}
              onAirstrike={() => setAirstrikeSignal((s) => s + 1)}
              airstrikesAvailable={hudState.airstrikesAvailable}
            />

            {/* Pause Menu Overlay */}
            {gameState === 'PAUSED' && (
              <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center flex flex-col items-center">
                  <h3 className="font-action text-3xl font-bold text-amber-400 mb-1">
                    GAME PAUSED
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Reload your bazooka before jumping back into the zombie horde!
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={() => setGameState('PLAYING')}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                    >
                      Resume Fight
                    </button>
                    <button
                      onClick={() => openCustomizer('hero')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Change Sprites & BG (PNG)
                    </button>
                    <button
                      onClick={() => setGameState('TITLE_MENU')}
                      className="w-full py-2.5 bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Quit to Title Menu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Modal */}
            {gameState === 'GAME_OVER' && (
              <GameOverModal
                customization={customization}
                stats={stats}
                onRetry={() => setGameState('PLAYING')}
                onCustomize={() => openCustomizer('hero')}
              />
            )}
          </div>
        )}
      </main>

      {/* Photo Customizer Modal for Pal Oren, Zombie Lontoy, Horde Zombies & Arena Background */}
      {isCustomizerOpen && (
        <ImageUploaderModal
          customization={customization}
          onSave={handleSaveCustomization}
          onClose={() => setIsCustomizerOpen(false)}
          defaultTab={customizerTab}
        />
      )}
    </div>
  );
}
