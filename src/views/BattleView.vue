<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character'
import type { StatKey } from '@/types/character'
import { calculateDamage, calculateXpReward, calculateStatReward } from '@/utils/formulas'

const router = useRouter()
const characterStore = useCharacterStore()

// 臨時題目數據（之後會從題庫載入）
const sampleQuestions = [
  {
    id: '1',
    content: '在 JavaScript 中，以下哪個方法可以將陣列轉換為字串？',
    options: ['toString()', 'toArray()', 'stringify()', 'convert()'],
    correctAnswer: 0,
    difficulty: 2,
    category: 'INT' as StatKey,
  },
  {
    id: '2',
    content: 'Vue 3 的 Composition API 中，用於定義響應式狀態的函數是？',
    options: ['reactive()', 'ref()', '以上皆是', 'state()'],
    correctAnswer: 2,
    difficulty: 3,
    category: 'INT' as StatKey,
  },
  {
    id: '3',
    content: 'CSS 中 flex-direction: column 會讓子元素如何排列？',
    options: ['水平排列', '垂直排列', '反向水平排列', '網格排列'],
    correctAnswer: 1,
    difficulty: 1,
    category: 'INT' as StatKey,
  },
]

const currentQuestion = ref(sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)])
const selectedAnswer = ref<number | null>(null)
const isAnswered = ref(false)
const isCorrect = ref(false)
const showResult = ref(false)

function selectAnswer(index: number) {
  if (isAnswered.value) return
  selectedAnswer.value = index
}

function submitAnswer() {
  if (selectedAnswer.value === null || isAnswered.value) return

  isAnswered.value = true
  isCorrect.value = selectedAnswer.value === currentQuestion.value.correctAnswer

  characterStore.recordBattle(isCorrect.value)

  if (isCorrect.value) {
    // 答對：獲得經驗和屬性
    const xpReward = calculateXpReward(currentQuestion.value.difficulty, false)
    const statReward = calculateStatReward(currentQuestion.value.difficulty, false)

    characterStore.addXp(xpReward)
    characterStore.addStat(currentQuestion.value.category, statReward)
  } else {
    // 答錯：扣血
    const damage = calculateDamage(currentQuestion.value.difficulty)
    characterStore.takeDamage(damage)
  }

  showResult.value = true
}

function nextQuestion() {
  currentQuestion.value = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
  selectedAnswer.value = null
  isAnswered.value = false
  isCorrect.value = false
  showResult.value = false
}

function goHome() {
  router.push('/')
}

const optionLabels = ['A', 'B', 'C', 'D']
</script>

<template>
  <div class="min-h-screen p-4 safe-top safe-bottom">
    <div class="max-w-md mx-auto space-y-6">
      <!-- 頂部狀態欄 -->
      <div class="flex items-center justify-between">
        <button
          class="p-2 rounded-lg bg-bg-card hover:bg-bg-secondary transition-colors"
          @click="goHome"
        >
          ← 返回
        </button>
        <div class="flex items-center gap-4">
          <div class="text-sm">
            <span class="text-white/60">HP:</span>
            <span class="ml-1 font-bold" :class="characterStore.character!.hp < 30 ? 'text-hp' : 'text-green-500'">
              {{ characterStore.character?.hp }} / {{ characterStore.character?.maxHp }}
            </span>
          </div>
        </div>
      </div>

      <!-- 題目卡片 -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm px-2 py-1 rounded bg-primary/20 text-primary">
            難度 {{ currentQuestion.difficulty }}
          </span>
          <span class="text-sm text-white/60">
            {{ currentQuestion.category }} 屬性
          </span>
        </div>

        <h2 class="text-lg font-medium leading-relaxed mb-6">
          {{ currentQuestion.content }}
        </h2>

        <!-- 選項 -->
        <div class="space-y-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="w-full p-4 rounded-lg border text-left transition-all"
            :class="{
              'border-white/10 bg-bg-secondary hover:border-primary/50': !isAnswered && selectedAnswer !== index,
              'border-primary bg-primary/20': !isAnswered && selectedAnswer === index,
              'border-green-500 bg-green-500/20': isAnswered && index === currentQuestion.correctAnswer,
              'border-red-500 bg-red-500/20': isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer,
              'opacity-50': isAnswered && index !== currentQuestion.correctAnswer && selectedAnswer !== index,
            }"
            :disabled="isAnswered"
            @click="selectAnswer(index)"
          >
            <span class="font-bold mr-3 text-white/60">{{ optionLabels[index] }}.</span>
            {{ option }}
          </button>
        </div>

        <!-- 提交按鈕 -->
        <button
          v-if="!isAnswered"
          class="w-full mt-6 py-3 px-4 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="selectedAnswer === null"
          @click="submitAnswer"
        >
          確認答案
        </button>
      </div>

      <!-- 結果彈窗 -->
      <div
        v-if="showResult"
        class="card"
        :class="isCorrect ? 'border-green-500/50' : 'border-red-500/50'"
      >
        <div class="text-center space-y-4">
          <div class="text-4xl">{{ isCorrect ? '✅' : '❌' }}</div>
          <h3 class="text-xl font-bold" :class="isCorrect ? 'text-green-500' : 'text-red-500'">
            {{ isCorrect ? '答對了！' : '答錯了！' }}
          </h3>
          <p v-if="isCorrect" class="text-white/60">
            獲得 {{ calculateXpReward(currentQuestion.difficulty, false) }} XP 和
            {{ calculateStatReward(currentQuestion.difficulty, false) }} {{ currentQuestion.category }} 屬性點
          </p>
          <p v-else class="text-white/60">
            受到 {{ calculateDamage(currentQuestion.difficulty) }} 點傷害
          </p>

          <div class="flex gap-4 pt-2">
            <button
              class="flex-1 py-3 px-4 bg-bg-secondary rounded-lg hover:bg-bg-secondary/80 transition-colors"
              @click="goHome"
            >
              返回首頁
            </button>
            <button
              class="flex-1 py-3 px-4 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              @click="nextQuestion"
            >
              繼續挑戰
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
