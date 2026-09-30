import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  FighterCustomization,
  GameState,
  WeaponInfo,
  WeaponKey,
  ZombieEntity,
  BulletEntity,
  FallingRocket,
  BloodSplatter,
  DropCrate,
  ParticleEffect,
  FloatingNumber,
  SurvivalStats,
} from '../types/game';
import { sounds } from '../services/soundEffects';
import { SURVIVAL_BACKGROUND, WEAPON_REGISTRY, SURVIVAL_QUOTES, BOSS_ZOMBIE_QUOTES } from '../data/characters';

interface SurvivalCanvasProps {
  customization: FighterCustomization;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  activeWeapon: WeaponInfo;
  onUpdateWeaponAmmo: (key: WeaponKey, newAmmo: number) => void;
  onUpdateStats: (updater: (prev: SurvivalStats) => SurvivalStats) => void;
  onTriggerDialogue: (speaker: 'HERO' | 'ENEMY', text: string, name: string, avatar: string) => void;
  onUpdateHudState: (state: {
    hp: number;
    maxHp: number;
    totalKills: number;
    currentCombo: number;
    airstrikesAvailable: number;
    bossEntity: { hp: number; maxHp: number; active: boolean } | null;
  }) => void;
  airstrikeSignal: number;
  autoFire: boolean;
}

export const SurvivalCanvas: React.FC<SurvivalCanvasProps> = ({
  customization,
  gameState,
  setGameState,
  activeWeapon,
  onUpdateWeaponAmmo,
  onUpdateStats,
  onTriggerDialogue,
  onUpdateHudState,
  airstrikeSignal,
  autoFire,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cached Images
  const heroImgRef = useRef<HTMLImageElement | null>(null);
  const bossImgRef = useRef<HTMLImageElement | null>(null);
  const hordeZombieImgRef = useRef<HTMLImageElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Active DOM image refs for animated GIF continuous playback
  const heroDomRef = useRef<HTMLImageElement | null>(null);
  const bossDomRef = useRef<HTMLImageElement | null>(null);
  const hordeDomRef = useRef<HTMLImageElement | null>(null);

  // Ground Y-level where characters stand
  const GROUND_Y = 535;

  // Player State
  const playerRef = useRef({
    x: 480,
    y: GROUND_Y,
    vx: 0,
    speed: 310,
    facing: 1 as 1 | -1, // 1 = facing right, -1 = facing left
    width: 64,
    height: 78,
    hp: 100,
    maxHp: 100,
    shootCooldown: 0,
    invincibleTimer: 0,
    walkFrame: 0,
    recoil: 0,
    airstrikes: 2,
  });

  // Entities
  const zombiesRef = useRef<ZombieEntity[]>([]);
  const bulletsRef = useRef<BulletEntity[]>([]);
  const fallingRocketsRef = useRef<FallingRocket[]>([]);
  const bloodSplattersRef = useRef<BloodSplatter[]>([]);
  const dropCratesRef = useRef<DropCrate[]>([]);
  const particlesRef = useRef<ParticleEffect[]>([]);
  const floatingNumbersRef = useRef<FloatingNumber[]>([]);

  // Spawner and wave control
  const waveRef = useRef<number>(1);
  const spawnTimerRef = useRef<number>(0);
  const totalKillsRef = useRef<number>(0);
  const currentComboRef = useRef<number>(0);
  const comboTimerRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Input states
  const keysRef = useRef<Record<string, boolean>>({});
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 600, y: GROUND_Y, isDown: false });

  // Preload Images
  useEffect(() => {
    const hImg = heroDomRef.current || new Image();
    hImg.src = customization.heroImage;
    heroImgRef.current = hImg;

    const bImg = bossDomRef.current || new Image();
    bImg.src = customization.enemyImage;
    bossImgRef.current = bImg;

    if (customization.hordeZombieImage) {
      const hzImg = hordeDomRef.current || new Image();
      hzImg.src = customization.hordeZombieImage;
      hordeZombieImgRef.current = hzImg;
    } else {
      hordeZombieImgRef.current = null;
    }

    const bgImg = new Image();
    bgImg.src = customization.backgroundImage || SURVIVAL_BACKGROUND;
    bgImgRef.current = bgImg;
  }, [
    customization.heroImage,
    customization.enemyImage,
    customization.hordeZombieImage,
    customization.backgroundImage,
  ]);

  // Trigger Airstrike (spawns 2 falling rockets matching the reference screenshot!)
  const launchAirstrike = useCallback(() => {
    const p = playerRef.current;
    if (p.airstrikes <= 0) return;

    p.airstrikes--;
    sounds.playAirstrikeIncoming();
    screenShakeRef.current = 16;

    // Spawn 2 falling missiles from the sky, spaced across the zombie swarm!
    const targetX1 = p.x - 160 + (Math.random() * 80 - 40);
    const targetX2 = p.x + 160 + (Math.random() * 80 - 40);

    fallingRocketsRef.current.push(
      {
        id: Math.random(),
        x: targetX1,
        y: -100,
        vy: 580,
        targetY: GROUND_Y - 10,
        damage: 320,
        blastRadius: 160,
      },
      {
        id: Math.random(),
        x: targetX2,
        y: -180,
        vy: 610,
        targetY: GROUND_Y - 10,
        damage: 320,
        blastRadius: 160,
      }
    );

    floatingNumbersRef.current.push({
      id: Math.random(),
      x: p.x,
      y: p.y - 60,
      text: 'AIRSTRIKE INBOUND!',
      color: '#ef4444',
      alpha: 1,
      vy: -50,
    });

    onTriggerDialogue('HERO', 'Airstrike inbound! Clear the blast zone!', customization.heroName, customization.heroImage);

    onUpdateStats((prev) => ({
      ...prev,
      airstrikesUsed: prev.airstrikesUsed + 1,
    }));
  }, [customization, onTriggerDialogue, onUpdateStats]);

  useEffect(() => {
    if (airstrikeSignal > 0) {
      launchAirstrike();
    }
  }, [airstrikeSignal, launchAirstrike]);

  // Keyboard and mouse events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === 'r') {
        launchAirstrike();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [launchAirstrike]);

  // Reset Game on Start
  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 480,
      y: GROUND_Y,
      vx: 0,
      speed: 310,
      facing: 1,
      width: 64,
      height: 78,
      hp: 100,
      maxHp: 100,
      shootCooldown: 0,
      invincibleTimer: 0,
      walkFrame: 0,
      recoil: 0,
      airstrikes: 2,
    };

    zombiesRef.current = [];
    bulletsRef.current = [];
    fallingRocketsRef.current = [];
    dropCratesRef.current = [];
    particlesRef.current = [];
    floatingNumbersRef.current = [];

    // Leave a few ambient ground blood splatters like in the screenshot
    bloodSplattersRef.current = [
      {
        x: 220,
        y: GROUND_Y + 12,
        radius: 18,
        alpha: 0.85,
        points: [
          { dx: -6, dy: 2, r: 12 },
          { dx: 6, dy: -2, r: 10 },
          { dx: 14, dy: 4, r: 8 },
        ],
      },
      {
        x: 340,
        y: GROUND_Y + 14,
        radius: 22,
        alpha: 0.9,
        points: [
          { dx: -8, dy: -3, r: 14 },
          { dx: 5, dy: 3, r: 11 },
          { dx: 15, dy: 0, r: 9 },
        ],
      },
      {
        x: 680,
        y: GROUND_Y + 15,
        radius: 20,
        alpha: 0.85,
        points: [
          { dx: -5, dy: 4, r: 12 },
          { dx: 8, dy: -2, r: 10 },
        ],
      },
    ];

    waveRef.current = 1;
    spawnTimerRef.current = 0;
    totalKillsRef.current = 0;
    currentComboRef.current = 0;
    comboTimerRef.current = 0;

    sounds.startMusic(120);

    // Initial ambient quote
    onTriggerDialogue('HERO', "Night has fallen. Keep your finger on the trigger!", customization.heroName, customization.heroImage);
  }, [customization, onTriggerDialogue]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Main Loop
  useEffect(() => {
    let animId: number;

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = timestamp;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (gameState === 'PLAYING') {
            updateSurvival(dt, canvas.width, canvas.height);
          }
          renderSurvival(ctx, canvas.width, canvas.height);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, activeWeapon]);

  // Update Survival Logic
  const updateSurvival = (dt: number, width: number, height: number) => {
    const p = playerRef.current;

    // Screen Shake
    if (screenShakeRef.current > 0) {
      screenShakeRef.current = Math.max(0, screenShakeRef.current - 35 * dt);
    }

    // Recoil decay
    if (p.recoil > 0) {
      p.recoil = Math.max(0, p.recoil - 15 * dt);
    }

    // Invincible timer
    if (p.invincibleTimer > 0) {
      p.invincibleTimer -= dt;
    }

    // Combo timer
    if (currentComboRef.current > 0) {
      comboTimerRef.current -= dt;
      if (comboTimerRef.current <= 0) {
        currentComboRef.current = 0;
      }
    }

    // Player Horizontal Movement (A/D or Arrows)
    let moveDir = 0;
    const keys = keysRef.current;
    if (keys['arrowleft'] || keys['a']) moveDir -= 1;
    if (keys['arrowright'] || keys['d']) moveDir += 1;

    if (moveDir !== 0) {
      p.x += moveDir * p.speed * dt;
      p.facing = moveDir as 1 | -1;
      p.walkFrame += 12 * dt;
    } else {
      p.walkFrame = 0;
    }

    // Clamp Player on Street
    p.x = Math.max(60, Math.min(width - 60, p.x));

    // Player Shooting
    p.shootCooldown -= dt;
    const isTryingToShoot = autoFire || keys[' '] || keys['spacebar'] || mouseRef.current.isDown;

    if (isTryingToShoot && p.shootCooldown <= 0) {
      fireActiveWeapon(p);
    }

    // Zombie Spawning
    spawnTimerRef.current += dt;
    const spawnInterval = Math.max(0.65, 2.2 - waveRef.current * 0.25);
    if (spawnTimerRef.current >= spawnInterval) {
      spawnTimerRef.current = 0;
      spawnZombies(width);
    }

    // Update Zombies
    updateZombies(dt, width);

    // Update Bullets
    updateBullets(dt, width);

    // Update Falling Airstrike Rockets
    updateFallingRockets(dt);

    // Update Supply Drops
    updateDropCrates(dt);

    // Update Particles
    updateParticles(dt);

    // Update Floating Texts
    updateFloatingNumbers(dt);

    // Check Boss State for HUD
    const boss = zombiesRef.current.find((z) => z.isBoss);

    onUpdateHudState({
      hp: p.hp,
      maxHp: p.maxHp,
      totalKills: totalKillsRef.current,
      currentCombo: currentComboRef.current,
      airstrikesAvailable: p.airstrikes,
      bossEntity: boss ? { hp: boss.hp, maxHp: boss.maxHp, active: true } : null,
    });

    // Game Over check
    if (p.hp <= 0 && gameState === 'PLAYING') {
      sounds.playExplosion(true);
      sounds.stopMusic();
      setGameState('GAME_OVER');
    }
  };

  // Weapon Fire Logic
  const fireActiveWeapon = (p: typeof playerRef.current) => {
    if (activeWeapon.ammo !== Infinity && activeWeapon.ammo <= 0) {
      // Out of ammo, switch to pistol
      return;
    }

    p.shootCooldown = activeWeapon.fireRate;
    p.recoil = 8;

    // Deduct ammo
    if (activeWeapon.ammo !== Infinity) {
      onUpdateWeaponAmmo(activeWeapon.key, activeWeapon.ammo - 1);
    }

    const shootDir = p.facing;
    const spawnX = p.x + shootDir * 36;
    const spawnY = p.y - 18;

    if (activeWeapon.key === 'BAZOOKA') {
      sounds.playBazookaShot();
      screenShakeRef.current = 6;
      bulletsRef.current.push({
        id: Math.random(),
        x: spawnX,
        y: spawnY,
        vx: shootDir * activeWeapon.speed,
        vy: 0,
        damage: activeWeapon.damage,
        isExplosive: true,
        blastRadius: activeWeapon.blastRadius || 100,
        knockback: activeWeapon.knockback,
        radius: 10,
        color: '#f59e0b',
        type: 'BAZOOKA',
        rotation: shootDir === 1 ? 0 : Math.PI,
        life: 2.5,
      });
    } else if (activeWeapon.key === 'SHOTGUN') {
      sounds.playShotgunShot();
      screenShakeRef.current = 5;
      for (let i = 0; i < activeWeapon.bulletsPerShot; i++) {
        const spreadAngle = (Math.random() - 0.5) * activeWeapon.spread;
        bulletsRef.current.push({
          id: Math.random(),
          x: spawnX,
          y: spawnY,
          vx: shootDir * Math.cos(spreadAngle) * activeWeapon.speed,
          vy: Math.sin(spreadAngle) * activeWeapon.speed,
          damage: activeWeapon.damage,
          isExplosive: false,
          blastRadius: 0,
          knockback: activeWeapon.knockback,
          radius: 5,
          color: '#fbbf24',
          type: 'SHOTGUN',
          rotation: 0,
          life: 0.65,
        });
      }
    } else if (activeWeapon.key === 'SANDAL_BLASTER') {
      sounds.playSandalShot();
      bulletsRef.current.push({
        id: Math.random(),
        x: spawnX,
        y: spawnY,
        vx: shootDir * activeWeapon.speed,
        vy: -20,
        damage: activeWeapon.damage,
        isExplosive: false,
        blastRadius: 0,
        knockback: activeWeapon.knockback,
        radius: 14,
        color: '#ffffff',
        type: 'SANDAL_BLASTER',
        rotation: 0,
        life: 1.8,
      });
    } else {
      // PISTOL
      sounds.playPistolShot();
      bulletsRef.current.push({
        id: Math.random(),
        x: spawnX,
        y: spawnY,
        vx: shootDir * activeWeapon.speed,
        vy: (Math.random() - 0.5) * 20,
        damage: activeWeapon.damage,
        isExplosive: false,
        blastRadius: 0,
        knockback: activeWeapon.knockback,
        radius: 5,
        color: '#38bdf8',
        type: 'PISTOL',
        rotation: 0,
        life: 1.5,
      });
    }

    onUpdateStats((prev) => ({ ...prev, shotsFired: prev.shotsFired + 1 }));
  };

  // Zombie Spawning
  const spawnZombies = (width: number) => {
    // Determine spawn side: left (-40) or right (width + 40)
    const fromLeft = Math.random() < 0.5;
    const spawnX = fromLeft ? -40 : width + 40;
    const direction = fromLeft ? 1 : -1;

    // Check if we should spawn Boss Lontoy!
    const bossExists = zombiesRef.current.some((z) => z.isBoss);
    if (!bossExists && totalKillsRef.current >= 15 && totalKillsRef.current % 25 === 0) {
      zombiesRef.current.push({
        id: Math.random(),
        type: 'LONTOY_BOSS',
        x: spawnX,
        y: GROUND_Y - 14,
        vx: 0,
        speed: 75,
        hp: 1200,
        maxHp: 1200,
        width: 100,
        height: 110,
        direction,
        attackCooldown: 1.0,
        isHit: 0,
        walkFrame: 0,
        isBoss: true,
      });

      sounds.playAirstrikeIncoming();
      const bossQuote = BOSS_ZOMBIE_QUOTES[Math.floor(Math.random() * BOSS_ZOMBIE_QUOTES.length)];
      onTriggerDialogue('ENEMY', bossQuote, customization.enemyName, customization.enemyImage);
      return;
    }

    // Normal zombie types matching reference image
    const types: ('WALKER' | 'PUNK_MOHAWK' | 'RUNNER')[] = ['WALKER', 'PUNK_MOHAWK', 'RUNNER'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    const speed = chosenType === 'RUNNER' ? 140 : chosenType === 'PUNK_MOHAWK' ? 100 : 80;
    const hp = chosenType === 'PUNK_MOHAWK' ? 80 : chosenType === 'RUNNER' ? 50 : 60;

    zombiesRef.current.push({
      id: Math.random(),
      type: chosenType,
      x: spawnX,
      y: GROUND_Y,
      vx: 0,
      speed,
      hp,
      maxHp: hp,
      width: 56,
      height: 74,
      direction,
      attackCooldown: 1.0,
      isHit: 0,
      walkFrame: Math.random() * 5,
    });
  };

  // Update Zombies
  const updateZombies = (dt: number, width: number) => {
    const p = playerRef.current;

    zombiesRef.current.forEach((z) => {
      // Face towards player
      z.direction = z.x < p.x ? 1 : -1;
      z.x += z.direction * z.speed * dt;
      z.walkFrame += 6 * dt;

      if (z.isHit > 0) z.isHit -= dt;
      z.attackCooldown -= dt;

      // Check collision with player
      const distToPlayer = Math.abs(z.x - p.x);
      if (distToPlayer < 45 && z.attackCooldown <= 0 && p.invincibleTimer <= 0) {
        z.attackCooldown = 0.9;
        const damage = z.isBoss ? 28 : 14;
        p.hp = Math.max(0, p.hp - damage);
        p.invincibleTimer = 0.6;
        sounds.playZombieHit();
        screenShakeRef.current = 10;

        floatingNumbersRef.current.push({
          id: Math.random(),
          x: p.x,
          y: p.y - 40,
          text: `-${damage}`,
          color: '#ef4444',
          alpha: 1,
          vy: -40,
        });

        // Knockback player slightly
        p.x -= z.direction * 20;
      }
    });

    // Remove dead zombies
    zombiesRef.current = zombiesRef.current.filter((z) => z.hp > 0);
  };

  // Update Bullets & Collisions
  const updateBullets = (dt: number, width: number) => {
    bulletsRef.current.forEach((b) => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;

      if (b.type === 'SANDAL_BLASTER') {
        b.rotation += 15 * dt;
      }

      // Check hit on each zombie
      zombiesRef.current.forEach((z) => {
        const hitDist = Math.hypot(b.x - z.x, b.y - (z.y - z.height * 0.45));
        if (hitDist < b.radius + z.width * 0.45) {
          b.life = 0;

          if (b.isExplosive) {
            // Bazooka AoE blast!
            explodeRocket(b.x, b.y, b.blastRadius, b.damage);
          } else {
            // Direct Hit
            applyZombieDamage(z, b.damage, b.knockback * (b.vx > 0 ? 1 : -1));
          }
        }
      });
    });

    bulletsRef.current = bulletsRef.current.filter((b) => b.life > 0 && b.x > -80 && b.x < width + 80);
  };

  // Rocket Explosion AoE
  const explodeRocket = (x: number, y: number, radius: number, damage: number) => {
    sounds.playExplosion(true);
    screenShakeRef.current = 14;

    // Fiery smoke particles
    for (let i = 0; i < 28; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = Math.random() * 260 + 40;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 60,
        size: Math.random() * 12 + 6,
        color: i % 2 === 0 ? '#ef4444' : '#fbbf24',
        alpha: 1,
        decay: 1.8,
        gravity: 120,
      });
    }

    // Damage all zombies in radius
    zombiesRef.current.forEach((z) => {
      const dist = Math.hypot(x - z.x, y - z.y);
      if (dist < radius) {
        const falloff = 1 - dist / radius;
        const dealDmg = Math.round(damage * (0.5 + 0.5 * falloff));
        const knockDir = z.x > x ? 1 : -1;
        applyZombieDamage(z, dealDmg, 24 * knockDir);
      }
    });
  };

  // Apply damage & kill resolution
  const applyZombieDamage = (z: ZombieEntity, damage: number, knockbackX: number) => {
    z.hp -= damage;
    z.isHit = 0.12;
    z.x += knockbackX;
    sounds.playZombieHit();

    floatingNumbersRef.current.push({
      id: Math.random(),
      x: z.x,
      y: z.y - z.height - 10,
      text: `-${damage}`,
      color: z.isBoss ? '#ef4444' : '#fbbf24',
      alpha: 1,
      vy: -50,
    });

    if (z.hp <= 0) {
      handleZombieDeath(z);
    }
  };

  // Zombie Death Resolution
  const handleZombieDeath = (z: ZombieEntity) => {
    totalKillsRef.current++;
    currentComboRef.current++;
    comboTimerRef.current = 2.6;

    sounds.playComboDing(currentComboRef.current);

    // Add blood splatter and gibs on street pavement!
    bloodSplattersRef.current.push({
      x: z.x,
      y: GROUND_Y + 14,
      radius: Math.random() * 12 + 16,
      alpha: 0.9,
      points: [
        { dx: (Math.random() - 0.5) * 16, dy: (Math.random() - 0.5) * 8, r: 10 },
        { dx: (Math.random() - 0.5) * 20, dy: (Math.random() - 0.5) * 8, r: 8 },
        { dx: (Math.random() - 0.5) * 24, dy: (Math.random() - 0.5) * 6, r: 7 },
      ],
    });

    // Blood splatter burst particles
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = Math.random() * 160 + 30;
      particlesRef.current.push({
        x: z.x,
        y: z.y - 30,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 80,
        size: Math.random() * 6 + 3,
        color: '#dc2626',
        alpha: 1,
        decay: 2.2,
        gravity: 280,
      });
    }

    // Score & drop chance
    const scoreVal = z.isBoss ? 2500 : 150;
    onUpdateStats((prev) => ({
      ...prev,
      totalKills: prev.totalKills + 1,
      currentCombo: currentComboRef.current,
      maxCombo: Math.max(prev.maxCombo, currentComboRef.current),
      score: prev.score + scoreVal * (1 + currentComboRef.current * 0.1),
    }));

    // Chance to drop supply crates
    if (z.isBoss || Math.random() < 0.28) {
      dropCrate(z.x);
    }
  };

  // Drop Crate
  const dropCrate = (x: number) => {
    const types: DropCrate['type'][] = ['AMMO_BAZOOKA', 'AMMO_SHOTGUN', 'MEDKIT', 'AIRSTRIKE'];
    const chosen = types[Math.floor(Math.random() * types.length)];
    dropCratesRef.current.push({
      id: Math.random(),
      x,
      y: 0,
      vy: 160,
      type: chosen,
      duration: 15,
    });
  };

  // Update Falling Airstrike Rockets (Matching Reference Image)
  const updateFallingRockets = (dt: number) => {
    fallingRocketsRef.current.forEach((r) => {
      r.y += r.vy * dt;

      // Smoke trail
      particlesRef.current.push({
        x: r.x + (Math.random() * 6 - 3),
        y: r.y - 18,
        vx: (Math.random() - 0.5) * 20,
        vy: -40,
        size: Math.random() * 7 + 4,
        color: 'rgba(203, 213, 225, 0.7)',
        alpha: 0.8,
        decay: 2.0,
      });

      // Rocket impact
      if (r.y >= r.targetY) {
        explodeRocket(r.x, r.targetY, r.blastRadius, r.damage);
      }
    });

    fallingRocketsRef.current = fallingRocketsRef.current.filter((r) => r.y < r.targetY);
  };

  // Update Supply Crates
  const updateDropCrates = (dt: number) => {
    const p = playerRef.current;

    dropCratesRef.current.forEach((c) => {
      if (c.y < GROUND_Y - 10) {
        c.y += c.vy * dt;
      }
      c.duration -= dt;

      // Pickup distance
      const dist = Math.hypot(c.x - p.x, c.y - p.y);
      if (dist < 45) {
        c.duration = 0;
        sounds.playSupplyPickup();

        if (c.type === 'AMMO_BAZOOKA') {
          onUpdateWeaponAmmo('BAZOOKA', (WEAPON_REGISTRY.BAZOOKA.ammo = Math.min(24, activeWeapon.ammo + 6)));
          floatingNumbersRef.current.push({
            id: Math.random(),
            x: p.x,
            y: p.y - 45,
            text: '+6 ROCKETS',
            color: '#f59e0b',
            alpha: 1,
            vy: -45,
          });
        } else if (c.type === 'AMMO_SHOTGUN') {
          onUpdateWeaponAmmo('SHOTGUN', (WEAPON_REGISTRY.SHOTGUN.ammo = Math.min(48, activeWeapon.ammo + 16)));
          floatingNumbersRef.current.push({
            id: Math.random(),
            x: p.x,
            y: p.y - 45,
            text: '+16 SHELLS',
            color: '#fbbf24',
            alpha: 1,
            vy: -45,
          });
        } else if (c.type === 'MEDKIT') {
          p.hp = Math.min(p.maxHp, p.hp + 35);
          floatingNumbersRef.current.push({
            id: Math.random(),
            x: p.x,
            y: p.y - 45,
            text: '+35 HP',
            color: '#10b981',
            alpha: 1,
            vy: -45,
          });
        } else if (c.type === 'AIRSTRIKE') {
          p.airstrikes++;
          floatingNumbersRef.current.push({
            id: Math.random(),
            x: p.x,
            y: p.y - 45,
            text: '+1 AIRSTRIKE',
            color: '#ef4444',
            alpha: 1,
            vy: -45,
          });
        }
      }
    });

    dropCratesRef.current = dropCratesRef.current.filter((c) => c.duration > 0);
  };

  // Particles & Floats
  const updateParticles = (dt: number) => {
    particlesRef.current.forEach((part) => {
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      if (part.gravity) part.vy += part.gravity * dt;
      part.alpha -= part.decay * dt;
    });
    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);
  };

  const updateFloatingNumbers = (dt: number) => {
    floatingNumbersRef.current.forEach((ft) => {
      ft.y += ft.vy * dt;
      ft.alpha -= 1.0 * dt;
    });
    floatingNumbersRef.current = floatingNumbersRef.current.filter((ft) => ft.alpha > 0);
  };

  // Helper to draw equipped weapon model
  const drawWeaponModel = (ctx: CanvasRenderingContext2D, weaponKey: WeaponKey, walkBob: number) => {
    if (weaponKey === 'BAZOOKA') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(2, -8 + walkBob, 36, 12);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(38, -10 + walkBob, 10, 16);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(48, -8 + walkBob);
      ctx.lineTo(56, -2 + walkBob);
      ctx.lineTo(48, 4 + walkBob);
      ctx.closePath();
      ctx.fill();
    } else if (weaponKey === 'SHOTGUN') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(4, -6 + walkBob, 38, 7);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-4, -3 + walkBob, 14, 6);
    } else if (weaponKey === 'SANDAL_BLASTER') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, -6 + walkBob, 24, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(10, -8 + walkBob, 16, 4);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(8, -4 + walkBob, 18, 7);
    }
  };

  // RENDER SURVIVAL ENGINE
  const renderSurvival = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();

    // Screen Shake
    if (screenShakeRef.current > 0) {
      const sx = (Math.random() - 0.5) * screenShakeRef.current;
      const sy = (Math.random() - 0.5) * screenShakeRef.current;
      ctx.translate(sx, sy);
    }

    // 1. Draw Background (Street, Night Sky, Moon, Lampposts, Helicopter)
    if (bgImgRef.current && bgImgRef.current.complete) {
      ctx.drawImage(bgImgRef.current, 0, 0, width, height);
    } else {
      // Fallback Night Sky + City Pavement
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, GROUND_Y, width, height - GROUND_Y);
    }

    // 2. Draw Street Light Cones (ambient illumination onto sidewalk)
    ctx.save();
    const lampPositions = [width * 0.22, width * 0.44, width * 0.78];
    lampPositions.forEach((lx) => {
      const grad = ctx.createRadialGradient(lx, GROUND_Y - 140, 10, lx, GROUND_Y + 10, 110);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
      grad.addColorStop(0.7, 'rgba(254, 240, 138, 0.08)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(lx - 20, GROUND_Y - 140);
      ctx.lineTo(lx - 90, GROUND_Y + 30);
      ctx.lineTo(lx + 90, GROUND_Y + 30);
      ctx.lineTo(lx + 20, GROUND_Y - 140);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    // 3. Draw Persistent Blood Splatters and Guts on Ground (matching reference screenshot!)
    bloodSplattersRef.current.forEach((splatter) => {
      ctx.save();
      ctx.globalAlpha = splatter.alpha;
      ctx.fillStyle = '#991b1b';

      // Base splatter blob
      ctx.beginPath();
      ctx.ellipse(splatter.x, splatter.y, splatter.radius, splatter.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Splatter chunks / intestines curls
      ctx.fillStyle = '#dc2626';
      splatter.points.forEach((p) => {
        ctx.beginPath();
        ctx.ellipse(splatter.x + p.dx, splatter.y + p.dy, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    });

    // 4. Draw Supply Crates
    dropCratesRef.current.forEach((crate) => {
      ctx.save();
      ctx.translate(crate.x, crate.y);

      // Parachute if falling
      if (crate.y < GROUND_Y - 15) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-18, -25);
        ctx.moveTo(0, 0);
        ctx.lineTo(18, -25);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -25, 20, Math.PI, 0);
        ctx.fill();
      }

      // Wooden Box
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-15, -15, 30, 30);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.strokeRect(-15, -15, 30, 30);

      // Icon on crate
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label =
        crate.type === 'AMMO_BAZOOKA'
          ? 'BZ'
          : crate.type === 'AMMO_SHOTGUN'
          ? 'SG'
          : crate.type === 'MEDKIT'
          ? 'HP'
          : 'AIR';
      ctx.fillText(label, 0, 0);

      ctx.restore();
    });

    // 5. Draw Falling Airstrike Rockets (Silver Missiles with Red Cones, matching reference image!)
    fallingRocketsRef.current.forEach((r) => {
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(Math.PI / 2); // pointing straight down

      // White/Silver rocket body
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(-18, -6, 36, 12);

      // Red Conical Nose Tip
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(18, -6);
      ctx.lineTo(30, 0);
      ctx.lineTo(18, 6);
      ctx.closePath();
      ctx.fill();

      // Rocket fins at tail
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(-18, -6);
      ctx.lineTo(-24, -12);
      ctx.lineTo(-12, -6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-18, 6);
      ctx.lineTo(-24, 12);
      ctx.lineTo(-12, 6);
      ctx.closePath();
      ctx.fill();

      // Exhaust glow
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-20, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // 6. Draw Bullets & Rockets
    bulletsRef.current.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);

      if (b.type === 'BAZOOKA') {
        // Rocket in flight
        ctx.fillStyle = '#475569';
        ctx.fillRect(-14, -4, 28, 8);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(14, -5);
        ctx.lineTo(24, 0);
        ctx.lineTo(14, 5);
        ctx.closePath();
        ctx.fill();

        // Fire exhaust trail
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(-16, 0, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (b.type === 'SANDAL_BLASTER') {
        // Spinning Slide Sandal
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, 0, 13, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Pistol / Shotgun pellet
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 7. Draw Zombies (from both Left and Right)
    zombiesRef.current.forEach((z) => {
      ctx.save();
      ctx.translate(z.x, z.y);

      // Hit Flash
      if (z.isHit > 0) {
        ctx.filter = 'brightness(2.0)';
      }

      // Flip sprite based on direction
      ctx.scale(z.direction, 1);

      if (z.isBoss) {
        // Mutated Boss Zombie Lontoy!
        const bW = z.width;
        const bH = z.height;
        const isBossFullSprite = (customization.enemyRenderMode || 'FULL_SPRITE') === 'FULL_SPRITE';
        const bossScale = customization.enemyScale || 1.35;
        const bossOffY = customization.enemyOffsetY || 0;

        // Dark toxic aura
        ctx.shadowBlur = 24;
        ctx.shadowColor = customization.enemyAuraColor || '#10b981';

        if (isBossFullSprite && bossImgRef.current && bossImgRef.current.complete) {
          const img = bossImgRef.current;
          const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
          const drawH = 112 * bossScale;
          const drawW = drawH * aspect;
          const drawY = -drawH + bossOffY;

          // Render full transparent PNG / GIF Boss Sprite
          ctx.drawImage(img, -drawW / 2, drawY, drawW, drawH);

          // Glowing arcade yellow eyes on the boss
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(drawW * 0.1, drawY + drawH * 0.28, 4, 0, Math.PI * 2);
          ctx.arc(drawW * 0.24, drawY + drawH * 0.28, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw Classic Boss Body
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(-bW * 0.35, -bH * 0.65, bW * 0.7, bH * 0.65);

          // Circular Face Frame with Lontoy Boss Photo / GIF
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, -bH * 0.75, bW * 0.32, 0, Math.PI * 2);
          ctx.clip();

          if (bossImgRef.current && bossImgRef.current.complete) {
            ctx.drawImage(bossImgRef.current, -bW * 0.32, -bH * 1.07, bW * 0.64, bW * 0.64);
          } else {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(-bW * 0.32, -bH * 1.07, bW * 0.64, bW * 0.64);
          }
          ctx.restore();

          // Glowing Yellow Zombie Eyes
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(bW * 0.1, -bH * 0.75, 4.5, 0, Math.PI * 2);
          ctx.arc(bW * 0.22, -bH * 0.75, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Boss Stomp Arms
          ctx.fillStyle = '#047857';
          ctx.fillRect(bW * 0.2, -bH * 0.55, 25, 14);
        }
      } else {
        const zW = z.width;
        const zH = z.height;
        const walkBob = Math.sin(z.walkFrame) * 3;

        if (hordeZombieImgRef.current && hordeZombieImgRef.current.complete) {
          // Custom Horde Zombie PNG / Animated GIF!
          const img = hordeZombieImgRef.current;
          const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
          const scale = customization.hordeZombieScale || 1.0;
          const offY = customization.hordeZombieOffsetY || 0;
          const spriteH = zH * 0.95 * scale;
          const spriteW = Math.min(zW * 2, Math.max(zW * 0.6, spriteH * aspect));
          const drawY = -zH + offY + walkBob;

          // Walking leg animation under sprite
          const legAngle = Math.sin(z.walkFrame) * 12;
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-6, -zH * 0.2);
          ctx.lineTo(-6 - legAngle, 0);
          ctx.moveTo(6, -zH * 0.2);
          ctx.lineTo(6 + legAngle, 0);
          ctx.stroke();

          // Draw the custom PNG / GIF sprite
          ctx.drawImage(img, -spriteW / 2, drawY, spriteW, spriteH);

          // Glowing arcade yellow eyes on the custom zombie
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(spriteW * 0.08, drawY + spriteH * 0.25, 3, 0, Math.PI * 2);
          ctx.arc(spriteW * 0.22, drawY + spriteH * 0.25, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard Zombie matching reference image (Blue/Green skin, Glowing Eyes)
          // Zombie Body (Torn Shirt + Pants)
          ctx.fillStyle = z.type === 'PUNK_MOHAWK' ? '#047857' : '#1e3a8a';
          ctx.fillRect(-zW * 0.3, -zH * 0.6 + walkBob, zW * 0.6, zH * 0.4);

          // Zombie Head
          ctx.fillStyle = z.type === 'PUNK_MOHAWK' ? '#10b981' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(0, -zH * 0.75 + walkBob, zW * 0.34, 0, Math.PI * 2);
          ctx.fill();

          // Mohawk if punk
          if (z.type === 'PUNK_MOHAWK') {
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.moveTo(-6, -zH * 1.05 + walkBob);
            ctx.lineTo(6, -zH * 1.15 + walkBob);
            ctx.lineTo(8, -zH * 0.95 + walkBob);
            ctx.closePath();
            ctx.fill();
          }

          // Outstretched Arms
          ctx.fillStyle = z.type === 'PUNK_MOHAWK' ? '#10b981' : '#38bdf8';
          ctx.fillRect(zW * 0.15, -zH * 0.55 + walkBob, 22, 9);

          // Glowing Yellow Eyes (exactly as seen in reference image!)
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(zW * 0.12, -zH * 0.78 + walkBob, 3.5, 0, Math.PI * 2);
          ctx.arc(zW * 0.24, -zH * 0.78 + walkBob, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(zW * 0.14, -zH * 0.78 + walkBob, 1.2, 0, Math.PI * 2);
          ctx.arc(zW * 0.26, -zH * 0.78 + walkBob, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Legs with walking scissor animation
          const legAngle = Math.sin(z.walkFrame) * 12;
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-6, -zH * 0.2);
          ctx.lineTo(-6 - legAngle, 0);
          ctx.moveTo(6, -zH * 0.2);
          ctx.lineTo(6 + legAngle, 0);
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    // 8. Draw Player (Pal Oren)
    const p = playerRef.current;
    ctx.save();
    ctx.translate(p.x, p.y);

    // Invincible flicker
    if (p.invincibleTimer > 0 && Math.floor(p.invincibleTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Scale based on facing direction
    ctx.scale(p.facing, 1);

    // Recoil offset
    const recoilX = -p.recoil;

    // Head Bob from walking
    const walkBob = Math.sin(p.walkFrame) * 2;

    const isHeroFullSprite = (customization.heroRenderMode || 'FULL_SPRITE') === 'FULL_SPRITE';
    const heroScale = customization.heroScale || 1.0;
    const heroOffY = customization.heroOffsetY || 0;

    if (isHeroFullSprite && heroImgRef.current && heroImgRef.current.complete) {
      const img = heroImgRef.current;
      const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
      const spriteH = 84 * heroScale;
      const spriteW = spriteH * aspect;
      const drawY = -spriteH + heroOffY + walkBob;

      // Aura Glow
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = customization.heroAuraColor || '#38bdf8';

      // Draw Full Transparent PNG or Animated GIF
      ctx.drawImage(img, -spriteW / 2, drawY, spriteW, spriteH);
      ctx.restore();

      // Draw equipped weapon held at hand height
      ctx.save();
      ctx.translate(recoilX + spriteW * 0.12, drawY + spriteH * 0.58);
      drawWeaponModel(ctx, activeWeapon.key, 0);
      ctx.restore();
    } else {
      // Player Body (Athletic muscular torso & black shorts with PAL OREN text)
      // Athletic Shorts
      ctx.fillStyle = '#020617';
      ctx.fillRect(-18, -32, 36, 20);

      // White "PAL OREN" on shorts
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PAL OREN', 0, -20);

      // Legs & White Slides
      const legSwing = Math.sin(p.walkFrame) * 10;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.lineTo(-8 - legSwing, 0);
      ctx.moveTo(8, -14);
      ctx.lineTo(8 + legSwing, 0);
      ctx.stroke();

      // White Slide Sandals!
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14 - legSwing, -3, 13, 5);
      ctx.fillRect(2 + legSwing, -3, 13, 5);

      // Upper Body / Torso
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-16, -56 + walkBob, 32, 26);

      // Tactical Belts / Straps
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, -56 + walkBob);
      ctx.lineTo(16, -32 + walkBob);
      ctx.stroke();

      // Circular Avatar Head Frame with Pal Oren Photo / GIF
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, -68 + walkBob, 20, 0, Math.PI * 2);
      ctx.clip();

      if (heroImgRef.current && heroImgRef.current.complete) {
        ctx.drawImage(heroImgRef.current, -20, -88 + walkBob, 40, 40);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-20, -88 + walkBob, 40, 40);
      }
      ctx.restore();

      // Head outline
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -68 + walkBob, 20, 0, Math.PI * 2);
      ctx.stroke();

      // Equipped Weapon Model
      ctx.save();
      ctx.translate(recoilX, -40);
      drawWeaponModel(ctx, activeWeapon.key, walkBob);
      ctx.restore();
    }

    ctx.restore();

    // 9. Draw Particles (Fire, Smoke, Blood, Debris)
    particlesRef.current.forEach((part) => {
      ctx.save();
      ctx.globalAlpha = part.alpha;
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 10. Draw Floating Numbers
    floatingNumbersRef.current.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 15px "Teko", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  };

  // Pointer Handlers for Mouse Aim / Click to Shoot
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseRef.current.x = (e.clientX - rect.left) * scaleX;
    mouseRef.current.y = (e.clientY - rect.top) * scaleY;
    mouseRef.current.isDown = true;

    // Face towards click
    if (mouseRef.current.x > playerRef.current.x) {
      playerRef.current.facing = 1;
    } else {
      playerRef.current.facing = -1;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseRef.current.x = (e.clientX - rect.left) * scaleX;
    mouseRef.current.y = (e.clientY - rect.top) * scaleY;

    if (mouseRef.current.x > playerRef.current.x) {
      playerRef.current.facing = 1;
    } else {
      playerRef.current.facing = -1;
    }
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        width={1080}
        height={680}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full max-w-6xl max-h-[88vh] object-contain shadow-2xl rounded-xl border border-slate-800 touch-none cursor-crosshair"
      />

      {/* Hidden DOM Image elements ensuring browser active GIF frame decoders run continuously */}
      <div
        className="absolute -top-[9999px] -left-[9999px] pointer-events-none opacity-0 overflow-hidden w-1 h-1"
        aria-hidden="true"
      >
        <img ref={heroDomRef} src={customization.heroImage} alt="" crossOrigin="anonymous" />
        <img ref={bossDomRef} src={customization.enemyImage} alt="" crossOrigin="anonymous" />
        {customization.hordeZombieImage && (
          <img ref={hordeDomRef} src={customization.hordeZombieImage} alt="" crossOrigin="anonymous" />
        )}
      </div>
    </div>
  );
};
