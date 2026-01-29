// 冒險者等級
export type AdventurerRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'UR' | 'EX'

// 潛力等級
export type PotentialRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'UR' | 'EX'

// 屬性名稱
export type StatKey = 'INT' | 'WIS' | 'CHA' | 'DEX' | 'CON' | 'STR' | 'PER'

// 7 大屬性
export interface Stats {
  INT: number  // 智力 - 邏輯、數學、程式
  WIS: number  // 智慧 - 理解、分析、決策
  CHA: number  // 魅力 - 溝通、表達、領導
  DEX: number  // 敏捷 - 反應、速度、效率
  CON: number  // 體質 - 耐力、堅持、專注
  STR: number  // 力量 - 執行力、行動力
  PER: number  // 感知 - 觀察、直覺、創意
}

// 潛力等級映射
export type PotentialMap = Record<StatKey, PotentialRank>

// 角色資料
export interface Character {
  name: string
  level: number
  xp: number
  xpToNext: number
  hp: number
  maxHp: number
  rank: AdventurerRank
  stats: Stats
  potential: PotentialMap
  createdAt: number
  totalBattles: number
  totalCorrect: number
}

// 屬性顯示資訊
export const STAT_INFO: Record<StatKey, { name: string; description: string; color: string }> = {
  INT: { name: '智力', description: '邏輯、數學、程式', color: 'stat-int' },
  WIS: { name: '智慧', description: '理解、分析、決策', color: 'stat-wis' },
  CHA: { name: '魅力', description: '溝通、表達、領導', color: 'stat-cha' },
  DEX: { name: '敏捷', description: '反應、速度、效率', color: 'stat-dex' },
  CON: { name: '體質', description: '耐力、堅持、專注', color: 'stat-con' },
  STR: { name: '力量', description: '執行力、行動力', color: 'stat-str' },
  PER: { name: '感知', description: '觀察、直覺、創意', color: 'stat-per' },
}

// 冒險者等級資訊
export const RANK_INFO: Record<AdventurerRank, { name: string; minLevel: number; color: string }> = {
  F: { name: 'F 級', minLevel: 1, color: 'rank-f' },
  E: { name: 'E 級', minLevel: 5, color: 'rank-e' },
  D: { name: 'D 級', minLevel: 15, color: 'rank-d' },
  C: { name: 'C 級', minLevel: 30, color: 'rank-c' },
  B: { name: 'B 級', minLevel: 50, color: 'rank-b' },
  A: { name: 'A 級', minLevel: 80, color: 'rank-a' },
  S: { name: 'S 級', minLevel: 120, color: 'rank-s' },
  UR: { name: 'UR 級', minLevel: 200, color: 'rank-ur' },
  EX: { name: 'EX 級', minLevel: 500, color: 'rank-ex' },
}
