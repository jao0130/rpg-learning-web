<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character'
import { clearSaveData, exportSaveData, importSaveData } from '@/utils/storage'

const router = useRouter()
const characterStore = useCharacterStore()

const showConfirmDelete = ref(false)
const importText = ref('')
const showImport = ref(false)
const importError = ref('')

function goHome() {
  router.push('/')
}

function handleExport() {
  const data = exportSaveData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rpg-learning-save-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  if (!importText.value.trim()) {
    importError.value = '請輸入存檔數據'
    return
  }

  const success = importSaveData(importText.value)
  if (success) {
    characterStore.init()
    showImport.value = false
    importText.value = ''
    importError.value = ''
    router.push('/')
  } else {
    importError.value = '存檔數據格式錯誤'
  }
}

function handleDelete() {
  clearSaveData()
  characterStore.init()
  showConfirmDelete.value = false
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen p-4 safe-top safe-bottom">
    <div class="max-w-md mx-auto space-y-6">
      <!-- 頂部 -->
      <div class="flex items-center gap-4">
        <button
          class="p-2 rounded-lg bg-bg-card hover:bg-bg-secondary transition-colors"
          @click="goHome"
        >
          ← 返回
        </button>
        <h1 class="text-xl font-bold">設定</h1>
      </div>

      <!-- 存檔管理 -->
      <div class="card space-y-4">
        <h2 class="text-lg font-semibold">存檔管理</h2>

        <button
          class="w-full py-3 px-4 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors text-left flex items-center justify-between"
          @click="handleExport"
        >
          <span>導出存檔</span>
          <span class="text-white/60">📤</span>
        </button>

        <button
          class="w-full py-3 px-4 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors text-left flex items-center justify-between"
          @click="showImport = true"
        >
          <span>導入存檔</span>
          <span class="text-white/60">📥</span>
        </button>

        <button
          class="w-full py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-red-500 text-left flex items-center justify-between"
          @click="showConfirmDelete = true"
        >
          <span>刪除存檔</span>
          <span>🗑️</span>
        </button>
      </div>

      <!-- 關於 -->
      <div class="card space-y-2">
        <h2 class="text-lg font-semibold">關於</h2>
        <p class="text-white/60 text-sm">RPG Learning v0.1.0</p>
        <p class="text-white/60 text-sm">透過遊戲化機制，讓學習更有趣！</p>
      </div>

      <!-- 導入彈窗 -->
      <div
        v-if="showImport"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click.self="showImport = false"
      >
        <div class="card max-w-md w-full space-y-4">
          <h3 class="text-lg font-bold">導入存檔</h3>
          <textarea
            v-model="importText"
            class="w-full h-40 p-3 bg-bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none resize-none"
            placeholder="貼上存檔 JSON 數據..."
          />
          <p v-if="importError" class="text-red-500 text-sm">{{ importError }}</p>
          <div class="flex gap-4">
            <button
              class="flex-1 py-2 px-4 bg-bg-secondary rounded-lg"
              @click="showImport = false"
            >
              取消
            </button>
            <button
              class="flex-1 py-2 px-4 bg-primary rounded-lg font-semibold"
              @click="handleImport"
            >
              導入
            </button>
          </div>
        </div>
      </div>

      <!-- 刪除確認彈窗 -->
      <div
        v-if="showConfirmDelete"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click.self="showConfirmDelete = false"
      >
        <div class="card max-w-sm w-full space-y-4 text-center">
          <div class="text-4xl">⚠️</div>
          <h3 class="text-lg font-bold">確定要刪除存檔嗎？</h3>
          <p class="text-white/60 text-sm">此操作無法復原，所有進度將會遺失。</p>
          <div class="flex gap-4">
            <button
              class="flex-1 py-2 px-4 bg-bg-secondary rounded-lg"
              @click="showConfirmDelete = false"
            >
              取消
            </button>
            <button
              class="flex-1 py-2 px-4 bg-red-500 rounded-lg font-semibold"
              @click="handleDelete"
            >
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
