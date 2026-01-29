# RPG Learning Web - 設計文件

## 專案概述

將 RPG 遊戲化學習系統實現為一個網頁端應用，讓用戶可以透過答題挑戰來提升等級、獲得屬性點，並以視覺化方式呈現成長進度。

---

## 技術棧

| 類別 | 技術 |
|------|------|
| Framework | Vue 3 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State | Pinia |
| Storage | LocalStorage |
| Animation | CSS Transitions + Keyframes |

---

## 核心功能模組

### 1. 角色系統 (Character Module)

```typescript
interface Character {
  level: number;           // 1-999
  xp: number;              // 當前經驗值
  xpToNext: number;        // 升級所需經驗值
  hp: number;              // 當前 HP
  maxHp: number;           // 最大 HP
  rank: AdventurerRank;    // 冒險者等級
  stats: Stats;            // 7 大屬性
  potential: PotentialMap; // 潛力等級
}

interface Stats {
  INT: number;  // 智力 - 邏輯、數學、程式
  WIS: number;  // 智慧 - 理解、分析、決策
  CHA: number;  // 魅力 - 溝通、表達、領導
  DEX: number;  // 敏捷 - 反應、速度、效率
  CON: number;  // 體質 - 耐力、堅持、專注
  STR: number;  // 力量 - 執行力、行動力
  PER: number;  // 感知 - 觀察、直覺、創意
}

type AdventurerRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'UR' | 'EX';
type PotentialRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'UR' | 'EX';
```

### 2. 經驗值系統 (XP Module)

```typescript
// 升級所需經驗值計算
const calculateXpRequired = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.8));
};

// 升級獎勵計算
const calculateLevelUpBonus = (stats: Stats): Partial<Stats> => {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const bonus: Partial<Stats> = {};

  for (const [key, value] of Object.entries(stats)) {
    bonus[key as keyof Stats] = Math.floor((value / total) * 30);
  }

  return bonus;
};
```

### 3. HP 系統 (Health Module)

```typescript
// 最大 HP 計算
const calculateMaxHp = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.2));
};

// 傷害計算 (答錯時)
const calculateDamage = (questionDifficulty: number): number => {
  // difficulty 1-10 對應不同傷害
  return questionDifficulty * 10;
};

// HP 自動恢復 (每小時 5%)
const calculateHpRegen = (maxHp: number): number => {
  return Math.floor(maxHp * 0.05);
};
```

### 4. 戰鬥系統 (Battle Module)

```typescript
interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;      // 1-10
  category: keyof Stats;   // 對應屬性
  explanation?: string;
}

interface Monster {
  name: string;
  level: number;
  rank: AdventurerRank;
  hp: number;
  maxHp: number;
  questions: Question[];   // 題組
  isBoss: boolean;
}

interface BattleResult {
  victory: boolean;
  xpGained: number;
  statsGained: Partial<Stats>;
  damageReceived: number;
}
```

### 5. 特殊關卡系統 (Threshold Module)

```typescript
interface ThresholdStage {
  id: string;
  name: string;
  requiredStat: keyof Stats;
  requiredValue: number;
  questions: Question[];   // 3-5 題
  rewards: {
    xp: number;
    stats: Partial<Stats>;
  };
}
```

---

## 頁面結構

```
/                     # 首頁 - 角色面板
/battle               # 戰鬥頁面
/battle/:monsterId    # 特定怪物戰鬥
/threshold            # 特殊關卡列表
/threshold/:stageId   # 特殊關卡挑戰
/history              # 戰鬥歷史記錄
/settings             # 設定頁面
```

---

## 組件結構

```
src/
├── components/
│   ├── character/
│   │   ├── StatusPanel.vue      # 角色狀態面板
│   │   ├── StatsRadar.vue       # 屬性雷達圖
│   │   ├── XpBar.vue            # 經驗條
│   │   ├── HpBar.vue            # 血量條
│   │   └── RankBadge.vue        # 冒險者等級徽章
│   │
│   ├── battle/
│   │   ├── BattleArena.vue      # 戰鬥場景
│   │   ├── MonsterCard.vue      # 怪物卡片
│   │   ├── QuestionCard.vue     # 題目卡片
│   │   ├── AnswerOptions.vue    # 選項按鈕
│   │   ├── BattleResult.vue     # 戰鬥結果
│   │   └── DamageNumber.vue     # 傷害數字動畫
│   │
│   ├── common/
│   │   ├── ProgressBar.vue      # 通用進度條
│   │   ├── Modal.vue            # 彈窗
│   │   ├── Toast.vue            # 提示訊息
│   │   └── LoadingSpinner.vue   # 載入動畫
│   │
│   └── layout/
│       ├── AppHeader.vue        # 頂部導航
│       ├── AppFooter.vue        # 底部導航
│       └── MobileNav.vue        # 移動端導航
│
├── composables/
│   ├── useCharacter.ts          # 角色狀態邏輯
│   ├── useBattle.ts             # 戰鬥邏輯
│   ├── useXp.ts                 # 經驗值邏輯
│   ├── useHp.ts                 # HP 邏輯
│   └── useStorage.ts            # LocalStorage 邏輯
│
├── stores/
│   ├── character.ts             # 角色 Store
│   ├── battle.ts                # 戰鬥 Store
│   └── settings.ts              # 設定 Store
│
├── types/
│   ├── character.ts             # 角色相關類型
│   ├── battle.ts                # 戰鬥相關類型
│   └── question.ts              # 題目相關類型
│
├── utils/
│   ├── formulas.ts              # 遊戲公式計算
│   ├── storage.ts               # 儲存工具
│   └── random.ts                # 隨機生成工具
│
├── data/
│   ├── questions/               # 題庫 JSON
│   │   ├── int.json             # 智力類題目
│   │   ├── wis.json             # 智慧類題目
│   │   └── ...
│   └── monsters.json            # 怪物資料
│
└── views/
    ├── HomeView.vue             # 首頁
    ├── BattleView.vue           # 戰鬥頁
    ├── ThresholdView.vue        # 特殊關卡頁
    ├── HistoryView.vue          # 歷史記錄頁
    └── SettingsView.vue         # 設定頁
```

---

## UI 設計規範

### 配色方案 (RPG 風格)

```css
:root {
  /* 主色調 - 深紫 */
  --primary: #6366f1;
  --primary-dark: #4f46e5;

  /* 背景 - 深色主題 */
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: #16213e;

  /* 屬性顏色 */
  --stat-int: #3b82f6;  /* 藍 - 智力 */
  --stat-wis: #8b5cf6;  /* 紫 - 智慧 */
  --stat-cha: #ec4899;  /* 粉 - 魅力 */
  --stat-dex: #10b981;  /* 綠 - 敏捷 */
  --stat-con: #f59e0b;  /* 橙 - 體質 */
  --stat-str: #ef4444;  /* 紅 - 力量 */
  --stat-per: #06b6d4;  /* 青 - 感知 */

  /* HP / XP */
  --hp-color: #ef4444;
  --xp-color: #fbbf24;

  /* 冒險者等級顏色 */
  --rank-f: #9ca3af;
  --rank-e: #84cc16;
  --rank-d: #22c55e;
  --rank-c: #3b82f6;
  --rank-b: #8b5cf6;
  --rank-a: #f59e0b;
  --rank-s: #ef4444;
  --rank-ur: #ec4899;
  --rank-ex: linear-gradient(45deg, #f59e0b, #ef4444, #ec4899, #8b5cf6);
}
```

### 動畫效果

1. **升級動畫** - 光芒爆發 + 數字跳動
2. **傷害數字** - 浮動上升 + 淡出
3. **答對效果** - 綠色閃光 + 震動
4. **答錯效果** - 紅色閃光 + 搖晃
5. **Boss 登場** - 畫面震動 + 特效

### 移動端適配

- 觸控目標最小 44x44px
- 使用 `100dvh` 處理 Safari 高度
- 底部導航欄固定
- 支援手勢操作

---

## 數據持久化

### LocalStorage 結構

```typescript
interface SaveData {
  version: string;           // 存檔版本
  character: Character;      // 角色數據
  battleHistory: BattleLog[];// 戰鬥記錄
  settings: UserSettings;    // 用戶設定
  lastSaved: number;         // 最後保存時間戳
  lastHpRegen: number;       // 最後 HP 恢復時間
}

// 儲存 key
const STORAGE_KEY = 'rpg-learning-save';
```

### 自動保存機制

- 每次數據變更自動保存
- HP 恢復計算基於時間差
- 支援導出/導入存檔

---

## 開發階段規劃

### Phase 1 - 基礎框架
- [ ] 專案初始化 (Vite + Vue 3 + TS)
- [ ] 基礎組件搭建
- [ ] 角色狀態系統
- [ ] LocalStorage 存檔機制

### Phase 2 - 核心玩法
- [ ] 戰鬥系統
- [ ] 題目系統
- [ ] 經驗值 & 升級
- [ ] HP & 傷害

### Phase 3 - 進階功能
- [ ] 特殊關卡
- [ ] Boss 戰
- [ ] 戰鬥歷史
- [ ] 成就系統

### Phase 4 - 優化完善
- [ ] 動畫效果
- [ ] 音效系統
- [ ] PWA 支援
- [ ] 效能優化

---

## 題庫設計

題目來源可以是：
1. **預設題庫** - JSON 文件內建
2. **API 整合** - 外部題庫 API
3. **自定義題目** - 用戶自行添加

### 題目難度對應

| 難度 | 冒險者等級 | 傷害值 | 獎勵屬性點 |
|------|-----------|--------|-----------|
| 1-2  | F         | 10-20  | 1         |
| 3-4  | E-D       | 30-40  | 1-2       |
| 5-6  | C-B       | 50-60  | 2         |
| 7-8  | A-S       | 70-80  | 2-3       |
| 9-10 | UR-EX     | 90-100 | 3         |

---

## 注意事項

1. **效能考量** - 動畫使用 CSS transform，避免重排
2. **無障礙設計** - 支援鍵盤操作，色盲友善配色
3. **離線支援** - PWA 實現離線可用
4. **資源限制** - 遵循硬體 80% 使用上限
