<script setup lang="ts">
import { computed } from 'vue'
import type { Character, StatKey } from '@/types/character'
import HpBar from './HpBar.vue'
import XpBar from './XpBar.vue'
import RankBadge from './RankBadge.vue'
import StatItem from './StatItem.vue'

const props = defineProps<{
  character: Character
}>()

const statKeys: StatKey[] = ['INT', 'WIS', 'CHA', 'DEX', 'CON', 'STR', 'PER']

const accuracy = computed(() => {
  if (props.character.totalBattles === 0) return 0
  return Math.round((props.character.totalCorrect / props.character.totalBattles) * 100)
})
</script>

<template>
  <div class="card space-y-6">
    <!-- 頭部信息 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">{{ character.name }}</h2>
        <p class="text-white/60 text-sm">冒險者</p>
      </div>
      <RankBadge :rank="character.rank" />
    </div>

    <!-- HP & XP -->
    <div class="space-y-4">
      <HpBar :current="character.hp" :max="character.maxHp" />
      <XpBar
        :current="character.xp"
        :required="character.xpToNext"
        :level="character.level"
      />
    </div>

    <!-- 統計資訊 -->
    <div class="flex justify-around text-center py-2 border-y border-white/10">
      <div>
        <div class="text-2xl font-bold text-primary">{{ character.totalBattles }}</div>
        <div class="text-xs text-white/60">總戰鬥</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-green-500">{{ character.totalCorrect }}</div>
        <div class="text-xs text-white/60">正確數</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-xp">{{ accuracy }}%</div>
        <div class="text-xs text-white/60">正確率</div>
      </div>
    </div>

    <!-- 屬性列表 -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold mb-3">屬性面板</h3>
      <StatItem
        v-for="key in statKeys"
        :key="key"
        :stat-key="key"
        :value="character.stats[key]"
        :potential="character.potential[key]"
      />
    </div>
  </div>
</template>
