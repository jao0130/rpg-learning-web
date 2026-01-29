<script setup lang="ts">
import { ref } from 'vue'
import { useCharacterStore } from '@/stores/character'
import StatusPanel from '@/components/character/StatusPanel.vue'

const characterStore = useCharacterStore()
const newName = ref('')
const isCreating = ref(false)

function createCharacter() {
  if (newName.value.trim()) {
    characterStore.createCharacter(newName.value.trim())
    isCreating.value = false
    newName.value = ''
  }
}

function startCreating() {
  isCreating.value = true
}
</script>

<template>
  <div class="min-h-screen p-4 safe-top safe-bottom">
    <!-- 有角色：顯示狀態面板 -->
    <template v-if="characterStore.hasCharacter && characterStore.character">
      <div class="max-w-md mx-auto space-y-4">
        <!-- 標題 -->
        <div class="text-center py-4">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            RPG Learning
          </h1>
          <p class="text-white/60 mt-1">冒險者之路</p>
        </div>

        <!-- 狀態面板 -->
        <StatusPanel :character="characterStore.character" />

        <!-- 操作按鈕 -->
        <div class="grid grid-cols-2 gap-4 mt-6">
          <router-link
            to="/battle"
            class="flex items-center justify-center gap-2 py-4 px-6 bg-primary hover:bg-primary-dark rounded-xl font-semibold transition-colors"
          >
            <span class="text-xl">⚔️</span>
            <span>開始挑戰</span>
          </router-link>
          <router-link
            to="/settings"
            class="flex items-center justify-center gap-2 py-4 px-6 bg-bg-card hover:bg-bg-secondary rounded-xl font-semibold border border-white/10 transition-colors"
          >
            <span class="text-xl">⚙️</span>
            <span>設定</span>
          </router-link>
        </div>
      </div>
    </template>

    <!-- 沒有角色：創建角色 -->
    <template v-else>
      <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full space-y-8 text-center">
          <!-- Logo -->
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              RPG Learning
            </h1>
            <p class="text-white/60 mt-2">踏上冒險者之路，開啟學習旅程</p>
          </div>

          <!-- 創建角色表單 -->
          <div v-if="isCreating" class="card space-y-6">
            <h2 class="text-xl font-bold">創建角色</h2>
            <div>
              <label class="block text-left text-white/60 text-sm mb-2">冒險者名稱</label>
              <input
                v-model="newName"
                type="text"
                placeholder="輸入你的名字..."
                class="w-full px-4 py-3 bg-bg-secondary rounded-lg border border-white/10 focus:border-primary focus:outline-none transition-colors"
                maxlength="20"
                @keyup.enter="createCharacter"
              />
            </div>
            <div class="flex gap-4">
              <button
                class="flex-1 py-3 px-4 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors"
                @click="isCreating = false"
              >
                取消
              </button>
              <button
                class="flex-1 py-3 px-4 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50"
                :disabled="!newName.trim()"
                @click="createCharacter"
              >
                開始冒險
              </button>
            </div>
          </div>

          <!-- 開始按鈕 -->
          <button
            v-else
            class="w-full py-4 px-6 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-lg transition-all hover:scale-105"
            @click="startCreating"
          >
            開始新遊戲
          </button>

          <!-- 特色說明 -->
          <div class="grid grid-cols-3 gap-4 pt-8">
            <div class="text-center">
              <div class="text-3xl mb-2">📚</div>
              <div class="text-sm text-white/60">答題升級</div>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">⚔️</div>
              <div class="text-sm text-white/60">戰鬥冒險</div>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">📈</div>
              <div class="text-sm text-white/60">屬性成長</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
