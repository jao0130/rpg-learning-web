<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  required: number
  level: number
}>()

const percentage = computed(() => (props.current / props.required) * 100)
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between text-sm">
      <span class="text-white/60">Lv.{{ level }}</span>
      <span class="font-medium text-xp">{{ current }} / {{ required }} XP</span>
    </div>
    <div class="h-2 bg-bg-secondary rounded-full overflow-hidden">
      <div
        class="h-full bg-xp rounded-full transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
