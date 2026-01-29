<script setup lang="ts">
import type { StatKey, PotentialRank } from '@/types/character'
import { STAT_INFO } from '@/types/character'

const props = defineProps<{
  statKey: StatKey
  value: number
  potential: PotentialRank
}>()

const info = STAT_INFO[props.statKey]

const statColors: Record<StatKey, string> = {
  INT: 'text-stat-int border-stat-int/30',
  WIS: 'text-stat-wis border-stat-wis/30',
  CHA: 'text-stat-cha border-stat-cha/30',
  DEX: 'text-stat-dex border-stat-dex/30',
  CON: 'text-stat-con border-stat-con/30',
  STR: 'text-stat-str border-stat-str/30',
  PER: 'text-stat-per border-stat-per/30',
}
</script>

<template>
  <div
    class="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/50 border"
    :class="statColors[statKey]"
  >
    <div class="flex items-center gap-3">
      <span class="font-bold w-10">{{ statKey }}</span>
      <span class="text-white/60 text-sm hidden sm:inline">{{ info.name }}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xl font-bold text-white">{{ value }}</span>
      <span class="text-xs px-1.5 py-0.5 rounded bg-white/10">({{ potential }})</span>
    </div>
  </div>
</template>
