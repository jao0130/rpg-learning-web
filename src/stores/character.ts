import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character, StatKey, Stats } from '@/types/character'
import { STAT_INFO, RANK_INFO } from '@/types/character'
import {
  calculateXpRequired,
  calculateMaxHp,
  calculateLevelUpBonus,
  calculateRank,
  calculateHpRegen,
  calculateDeathPenalty,
  createInitialCharacter,
} from '@/utils/formulas'
import {
  loadCharacter,
  saveCharacter,
  getLastHpRegenTime,
  updateHpRegenTime,
} from '@/utils/storage'

export const useCharacterStore = defineStore('character', () => {
  // State
  const character = ref<Character | null>(null)
  const isLoaded = ref(false)

  // Getters
  const hasCharacter = computed(() => character.value !== null)

  const xpProgress = computed(() => {
    if (!character.value) return 0
    return (character.value.xp / character.value.xpToNext) * 100
  })

  const hpProgress = computed(() => {
    if (!character.value) return 0
    return (character.value.hp / character.value.maxHp) * 100
  })

  const isDead = computed(() => {
    if (!character.value) return false
    return character.value.hp <= 0
  })

  const totalStats = computed(() => {
    if (!character.value) return 0
    return Object.values(character.value.stats).reduce((a, b) => a + b, 0)
  })

  // Actions
  function init() {
    const saved = loadCharacter()
    if (saved) {
      character.value = saved
      processHpRegen()
    }
    isLoaded.value = true
  }

  function createCharacter(name: string) {
    character.value = createInitialCharacter(name)
    save()
  }

  function save() {
    if (character.value) {
      saveCharacter(character.value)
    }
  }

  function processHpRegen() {
    if (!character.value) return

    const lastRegen = getLastHpRegenTime()
    const now = Date.now()
    const hoursPassed = (now - lastRegen) / (1000 * 60 * 60)

    if (hoursPassed >= 1) {
      const regenAmount = calculateHpRegen(character.value.maxHp, Math.floor(hoursPassed))
      character.value.hp = Math.min(character.value.hp + regenAmount, character.value.maxHp)
      updateHpRegenTime()
      save()
    }
  }

  function addXp(amount: number) {
    if (!character.value) return

    character.value.xp += amount

    // 檢查升級
    while (character.value.xp >= character.value.xpToNext) {
      levelUp()
    }

    save()
  }

  function levelUp() {
    if (!character.value) return

    character.value.xp -= character.value.xpToNext
    character.value.level++
    character.value.xpToNext = calculateXpRequired(character.value.level)

    // 更新最大 HP 並恢復
    const newMaxHp = calculateMaxHp(character.value.level)
    character.value.maxHp = newMaxHp
    character.value.hp = newMaxHp

    // 更新冒險者等級
    character.value.rank = calculateRank(character.value.level)

    // 屬性加成
    const bonus = calculateLevelUpBonus(character.value.stats)
    for (const [key, value] of Object.entries(bonus)) {
      if (value) {
        character.value.stats[key as StatKey] += value
      }
    }
  }

  function takeDamage(amount: number) {
    if (!character.value) return

    character.value.hp = Math.max(0, character.value.hp - amount)

    if (character.value.hp <= 0) {
      processDeath()
    }

    save()
  }

  function processDeath() {
    if (!character.value) return

    // 扣除經驗值
    const penalty = calculateDeathPenalty(character.value.xp)
    character.value.xp = Math.max(0, character.value.xp - penalty)

    // 恢復 HP 到 10%
    character.value.hp = Math.floor(character.value.maxHp * 0.1)
  }

  function addStat(stat: StatKey, amount: number) {
    if (!character.value) return
    character.value.stats[stat] += amount
    save()
  }

  function recordBattle(correct: boolean) {
    if (!character.value) return
    character.value.totalBattles++
    if (correct) {
      character.value.totalCorrect++
    }
    save()
  }

  function heal(amount: number) {
    if (!character.value) return
    character.value.hp = Math.min(character.value.hp + amount, character.value.maxHp)
    save()
  }

  return {
    // State
    character,
    isLoaded,
    // Getters
    hasCharacter,
    xpProgress,
    hpProgress,
    isDead,
    totalStats,
    // Actions
    init,
    createCharacter,
    save,
    addXp,
    takeDamage,
    addStat,
    recordBattle,
    heal,
  }
})
