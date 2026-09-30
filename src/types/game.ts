export type WeaponKey = 'PISTOL' | 'SHOTGUN' | 'BAZOOKA' | 'SANDAL_BLASTER';

export interface WeaponInfo {
  key: WeaponKey;
  name: string;
  ammo: number;
  maxAmmo: number;
  fireRate: number; // seconds between shots
  damage: number;
  bulletsPerShot: number;
  spread: number;
  speed: number;
  isExplosive?: boolean;
  blastRadius?: number;
  knockback: number;
}

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'WAVE_CLEAR' | 'GAME_OVER';

export type CharacterRenderMode = 'FULL_SPRITE' | 'AVATAR_BODY';

export interface FighterCustomization {
  heroName: string;
  heroTitle: string;
  heroImage: string;
  heroAuraColor: string;
  heroScale: number;
  heroRenderMode?: CharacterRenderMode;
  heroOffsetY?: number;

  enemyName: string;
  enemyTitle: string;
  enemyImage: string;
  enemyAuraColor: string;
  enemyScale: number;
  enemyRenderMode?: CharacterRenderMode;
  enemyOffsetY?: number;

  hordeZombieImage?: string;
  hordeZombieName?: string;
  hordeZombieAuraColor?: string;
  hordeZombieScale?: number;
  hordeZombieOffsetY?: number;

  backgroundImage?: string;
}

export type ZombieType = 'WALKER' | 'PUNK_MOHAWK' | 'RUNNER' | 'CRAWLER' | 'LONTOY_BOSS';

export interface ZombieEntity {
  id: number;
  type: ZombieType;
  x: number;
  y: number;
  vx: number;
  speed: number;
  hp: number;
  maxHp: number;
  width: number;
  height: number;
  direction: 1 | -1; // 1 = moving right, -1 = moving left
  attackCooldown: number;
  isHit: number;
  walkFrame: number;
  isBoss?: boolean;
}

export interface BulletEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  isExplosive: boolean;
  blastRadius: number;
  knockback: number;
  radius: number;
  color: string;
  type: WeaponKey;
  rotation: number;
  life: number;
}

export interface FallingRocket {
  id: number;
  x: number;
  y: number;
  vy: number;
  targetY: number;
  damage: number;
  blastRadius: number;
}

export interface BloodSplatter {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  points: { dx: number; dy: number; r: number }[];
}

export interface DropCrate {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: 'AMMO_BAZOOKA' | 'AMMO_SHOTGUN' | 'MEDKIT' | 'AIRSTRIKE';
  duration: number;
}

export interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity?: number;
}

export interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface SurvivalStats {
  wave: number;
  totalKills: number;
  currentCombo: number;
  maxCombo: number;
  shotsFired: number;
  shotsHit: number;
  damageDealt: number;
  airstrikesUsed: number;
  score: number;
  highScore: number;
}
