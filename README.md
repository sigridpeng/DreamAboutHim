# Dream About Him

一個可部署到 GitHub Pages 的互動式解謎視覺小說網頁遊戲。玩家會先輸入密碼，閱讀可翻動的日記，點擊最後一頁後進入視覺小說介面，透過選項與關鍵字觸發分支，最後抵達三個不同結局。

## Tech Stack

- Vite
- React
- TypeScript
- CSS
- localStorage 快速存檔

## Getting Started

```bash
npm install
npm run dev
```

開發伺服器預設網址：

```text
http://localhost:5173/DreamAboutHim/
```

## Build

```bash
npm run build
```

Build 結果會輸出到 `dist/`。目前 `vite.config.ts` 的 base path 設為 `/DreamAboutHim/`，適合部署到 GitHub Pages project site。

## Assets

背景音樂 placeholder 位於：

```text
public/assets/audio/bgm-placeholder.wav
```

之後可以直接用同名音檔替換，或在 `src/main.tsx` 修改 `BGM_SRC` 指向新的音樂路徑。瀏覽器需要玩家互動後才能播放音樂，所以音樂會從右上角音樂按鈕啟動。

## Game Test Flow

1. 在密碼頁輸入錯誤密碼，確認會出現錯誤提示。
2. 輸入 `dream`，點擊「打開」，進入日記。
3. 翻到第 3 頁，點擊最後一頁進入視覺小說介面。
4. 點「繼續」後選擇不同選項測試分支。
5. 在關鍵字節點輸入：
   - `remember`：進入「結局三：記得的人」
   - `醒來`：進入「結局二：醒來以後」
6. 在關鍵字節點選「我還沒準備好」：進入「結局一：夢中留白」。
7. 在視覺小說介面點「快速存檔」，重新整理後點「讀檔」，確認可回到存檔節點。

## Story Data

主要劇情資料在 `src/data/story.json`：

- `password`：開場固定密碼
- `diaryPages`：日記頁內容
- `nodes`：視覺小說節點、選項、關鍵字與結局轉場
- `endings`：三個結局與片尾 cast

正式劇情、場景、立繪與片尾素材可後續替換或擴充。
