/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色調
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        // 背景
        bg: {
          primary: '#0f0f1a',
          secondary: '#1a1a2e',
          card: '#16213e',
        },
        // 屬性顏色
        stat: {
          int: '#3b82f6',
          wis: '#8b5cf6',
          cha: '#ec4899',
          dex: '#10b981',
          con: '#f59e0b',
          str: '#ef4444',
          per: '#06b6d4',
        },
        // HP / XP
        hp: '#ef4444',
        xp: '#fbbf24',
        // 冒險者等級
        rank: {
          f: '#9ca3af',
          e: '#84cc16',
          d: '#22c55e',
          c: '#3b82f6',
          b: '#8b5cf6',
          a: '#f59e0b',
          s: '#ef4444',
          ur: '#ec4899',
        }
      },
      fontFamily: {
        rpg: ['Noto Sans TC', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
