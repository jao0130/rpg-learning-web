<script setup lang="ts">
import { computed } from 'vue'
import type { AdventurerRank } from '@/types/character'

const props = defineProps<{
  rank: AdventurerRank
}>()

const rankColors: Record<AdventurerRank, string> = {
  F: 'bg-rank-f text-black',
  E: 'bg-rank-e text-black',
  D: 'bg-rank-d text-white',
  C: 'bg-rank-c text-white',
  B: 'bg-rank-b text-white',
  A: 'bg-rank-a text-black',
  S: 'bg-rank-s text-white',
  UR: 'bg-rank-ur text-white',
  EX: 'bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 text-white',
}

const colorClass = computed(() => rankColors[props.rank])
</script>

<template>
  <span
    class="inline-flex items-center justify-center px-3 py-1 rounded-lg font-bold text-sm"
    :class="colorClass"
  >
    {{ rank }}
  </span>
</template>
