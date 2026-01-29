<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  max: number
}>()

const percentage = computed(() => (props.current / props.max) * 100)
const hpColor = computed(() => {
  if (percentage.value > 50) return 'bg-green-500'
  if (percentage.value > 25) return 'bg-yellow-500'
  return 'bg-hp'
})
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between text-sm">
      <span class="text-white/60">HP</span>
      <span class="font-medium">{{ current }} / {{ max }}</span>
    </div>
    <div class="h-3 bg-bg-secondary rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="hpColor"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
