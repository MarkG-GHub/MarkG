import palOrenImg from '@/src/assets/images/pal_oren_survivor_1790668401173.jpg';
import zombieLontoyImg from '@/src/assets/images/zombie_lontoy_boss_1790668382717.jpg';
import altavasTerminalBg from '@/src/assets/images/game_background_1790775243469.jpg';
import { FighterCustomization, WeaponInfo } from '../types/game';

export const SURVIVAL_BACKGROUND = altavasTerminalBg;

export const DEFAULT_FIGHTERS: FighterCustomization = {
  heroName: 'Pal Oren',
  heroTitle: 'Street Survivor & Bazooka Striker',
  heroImage: palOrenImg,
  heroAuraColor: '#38bdf8',
  heroScale: 1.0,
  heroRenderMode: 'FULL_SPRITE',
  heroOffsetY: 0,

  enemyName: 'Zombie Lontoy',
  enemyTitle: 'Mutated Polo Horde Commander',
  enemyImage: zombieLontoyImg,
  enemyAuraColor: '#4ade80',
  enemyScale: 1.35,
  enemyRenderMode: 'FULL_SPRITE',
  enemyOffsetY: 0,

  hordeZombieImage: '',
  hordeZombieName: 'Swarm Zombie',
  hordeZombieAuraColor: '#ef4444',
  hordeZombieScale: 1.0,
  hordeZombieOffsetY: 0,

  backgroundImage: altavasTerminalBg,
};

export const WEAPON_REGISTRY: Record<string, WeaponInfo> = {
  BAZOOKA: {
    key: 'BAZOOKA',
    name: 'Bazooka',
    ammo: 12,
    maxAmmo: 24,
    fireRate: 0.65,
    damage: 180,
    bulletsPerShot: 1,
    spread: 0,
    speed: 720,
    isExplosive: true,
    blastRadius: 95,
    knockback: 18,
  },
  SHOTGUN: {
    key: 'SHOTGUN',
    name: 'Combat Shotgun',
    ammo: 24,
    maxAmmo: 48,
    fireRate: 0.45,
    damage: 42,
    bulletsPerShot: 5,
    spread: 0.18,
    speed: 840,
    isExplosive: false,
    knockback: 14,
  },
  PISTOL: {
    key: 'PISTOL',
    name: 'Tactical Pistol',
    ammo: Infinity,
    maxAmmo: Infinity,
    fireRate: 0.22,
    damage: 35,
    bulletsPerShot: 1,
    spread: 0.03,
    speed: 980,
    isExplosive: false,
    knockback: 6,
  },
  SANDAL_BLASTER: {
    key: 'SANDAL_BLASTER',
    name: 'Sandal Launcher',
    ammo: 18,
    maxAmmo: 36,
    fireRate: 0.35,
    damage: 95,
    bulletsPerShot: 1,
    spread: 0.05,
    speed: 780,
    isExplosive: false,
    knockback: 20,
  },
};

export const SURVIVAL_QUOTES = [
  "They're coming from both sides! Keep firing!",
  "Eat rocket fuel, zombies!",
  "Pal Oren never drops his sandals in battle!",
  "Watch the skies, incoming airstrike!",
  "Lontoy! You picked the wrong street!"
];

export const BOSS_ZOMBIE_QUOTES = [
  "BRAAAINS... AND POLO SHIRTS!",
  "PAL OREN CANNOT SURVIVE THE HORDE!",
  "YOU CANNOT STOP THE MINT MUTATION!",
  "ROAAAR! MY ZOMBIE ARMY WILL CRUSH YOU!"
];
