import type { Stats, StatKey, AdventurerRank, Character, PotentialMap } from '@/types/character'
import { RANK_INFO } from '@/types/character'

/**
 * 計算升級所需經驗值
 * 公式: 100 * (level ^ 1.8)
 */
export function calculateXpRequired(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.8))
}

/**
 * 計算最大 HP
 * 公式: 100 * (level ^ 1.2)
 */
export function calculateMaxHp(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.2))
}

/**
 * 計算升級獎勵屬性
 * 公式: (單項屬性/總屬性) * 30
 */
export function calculateLevelUpBonus(stats: Stats): Partial<Stats> {
  const total = Object.values(stats).reduce((a, b) => a + b, 0)
  if (total === 0) return {}

  const bonus: Partial<Stats> = {}
  for (const [key, value] of Object.entries(stats)) {
    const bonusValue = Math.floor((value / total) * 30)
    if (bonusValue > 0) {
      bonus[key as StatKey] = bonusValue
    }
  }
  return bonus
}

/**
 * 計算答題傷害
 * 難度 1-10 對應不同傷害
 */
export function calculateDamage(difficulty: number): number {
  return difficulty * 10
}

/**
 * 計算答對獎勵經驗值
 */
export function calculateXpReward(difficulty: number, isBoss: boolean): number {
  const base = difficulty * 20
  return isBoss ? base * 5 : base
}

/**
 * 計算答對獎勵屬性點
 */
export function calculateStatReward(difficulty: number, isBoss: boolean): number {
  if (isBoss) return 5
  if (difficulty <= 2) return 1
  if (difficulty <= 6) return 2
  return 3
}

/**
 * 計算 HP 恢復量
 * 每小時恢復 5% 最大 HP
 */
export function calculateHpRegen(maxHp: number, hoursPassed: number): number {
  return Math.floor(maxHp * 0.05 * hoursPassed)
}

/**
 * 根據等級計算冒險者等級
 */
export function calculateRank(level: number): AdventurerRank {
  const ranks: AdventurerRank[] = ['EX', 'UR', 'S', 'A', 'B', 'C', 'D', 'E', 'F']
  for (const rank of ranks) {
    if (level >= RANK_INFO[rank].minLevel) {
      return rank
    }
  }
  return 'F'
}

/**
 * 計算死亡懲罰
 * 損失 10% 經驗值
 */
export function calculateDeathPenalty(xp: number): number {
  return Math.floor(xp * 0.1)
}

/**
 * 創建初始角色
 */
export function createInitialCharacter(name: string): Character {
  const level = 1
  return {
    name,
    level,
    xp: 0,
    xpToNext: calculateXpRequired(level),
    hp: calculateMaxHp(level),
    maxHp: calculateMaxHp(level),
    rank: 'F',
    stats: {
      INT: 10,
      WIS: 10,
      CHA: 10,
      DEX: 10,
      CON: 10,
      STR: 10,
      PER: 10,
    },
    potential: {
      INT: 'F',
      WIS: 'F',
      CHA: 'F',
      DEX: 'F',
      CON: 'F',
      STR: 'F',
      PER: 'F',
    } as PotentialMap,
    createdAt: Date.now(),
    totalBattles: 0,
    totalCorrect: 0,
  }
}
