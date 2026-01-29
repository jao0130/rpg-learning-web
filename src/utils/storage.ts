import type { Character } from '@/types/character'

const STORAGE_KEY = 'rpg-learning-save'
const VERSION = '1.0.0'

export interface SaveData {
  version: string
  character: Character | null
  lastSaved: number
  lastHpRegen: number
}

/**
 * 獲取預設存檔
 */
function getDefaultSaveData(): SaveData {
  return {
    version: VERSION,
    character: null,
    lastSaved: Date.now(),
    lastHpRegen: Date.now(),
  }
}

/**
 * 讀取存檔
 */
export function loadSaveData(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultSaveData()

    const data = JSON.parse(raw) as SaveData
    // 版本檢查與遷移可在此處理
    return data
  } catch {
    console.error('Failed to load save data')
    return getDefaultSaveData()
  }
}

/**
 * 保存存檔
 */
export function saveSaveData(data: SaveData): void {
  try {
    data.lastSaved = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.error('Failed to save data')
  }
}

/**
 * 保存角色資料
 */
export function saveCharacter(character: Character): void {
  const data = loadSaveData()
  data.character = character
  saveSaveData(data)
}

/**
 * 讀取角色資料
 */
export function loadCharacter(): Character | null {
  const data = loadSaveData()
  return data.character
}

/**
 * 更新 HP 恢復時間
 */
export function updateHpRegenTime(): void {
  const data = loadSaveData()
  data.lastHpRegen = Date.now()
  saveSaveData(data)
}

/**
 * 獲取上次 HP 恢復時間
 */
export function getLastHpRegenTime(): number {
  const data = loadSaveData()
  return data.lastHpRegen
}

/**
 * 清除存檔
 */
export function clearSaveData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * 導出存檔
 */
export function exportSaveData(): string {
  const data = loadSaveData()
  return JSON.stringify(data, null, 2)
}

/**
 * 導入存檔
 */
export function importSaveData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as SaveData
    if (!data.version || !data.character) {
      throw new Error('Invalid save data')
    }
    saveSaveData(data)
    return true
  } catch {
    console.error('Failed to import save data')
    return false
  }
}
