<script setup lang="ts">
import { onMounted } from 'vue'
import { useCharacterStore } from '@/stores/character'

const characterStore = useCharacterStore()

onMounted(() => {
  characterStore.init()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <router-view v-if="characterStore.isLoaded" />
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-xl text-white/60">載入中...</div>
    </div>
  </div>
</template>
