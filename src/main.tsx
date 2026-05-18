import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Save, Upload } from "lucide-react";
import { story } from "./data";
import type { Ending, FlagMap, GameStage, SaveData, VNNode } from "./types";
import "./styles.css";
import { useMemo, useState } from "react";

const SAVE_KEY = "dream-about-him-save";

function App() {
  const [stage, setStage] = useState<GameStage>("password");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [nodeId, setNodeId] = useState(story.startNode);
  const [flags, setFlags] = useState<FlagMap>({});
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [keywordError, setKeywordError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const nodesById = useMemo(() => new Map(story.nodes.map((node) => [node.id, node])), []);
  const endingsById = useMemo(() => new Map(story.endings.map((ending) => [ending.id, ending])), []);
  const currentNode = nodesById.get(nodeId) ?? nodesById.get(story.startNode);
  const currentEnding = currentNode?.ending ? endingsById.get(currentNode.ending) : undefined;

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim() === story.password) {
      setStage("diary");
      setPasswordError("");
      return;
    }

    setPasswordError("密碼不正確。日記仍然鎖著。");
  }

  function enterVisualNovel() {
    setStage("visualNovel");
    setNodeId(story.startNode);
    setKeyword("");
    setKeywordError("");
  }

  function mergeFlags(nextFlags?: FlagMap) {
    if (!nextFlags) return;
    setFlags((current) => ({ ...current, ...nextFlags }));
  }

  function goToNode(nextId?: string, nextFlags?: FlagMap) {
    if (!nextId) return;
    mergeFlags(nextFlags);
    setKeyword("");
    setKeywordError("");
    setNodeId(nextId);

    const nextNode = nodesById.get(nextId);
    const endingId = nextNode?.ending;
    if (endingId) {
      setUnlockedEndings((current) =>
        current.includes(endingId) ? current : [...current, endingId],
      );
      setStage("ending");
    }
  }

  function advanceNode(node: VNNode) {
    goToNode(node.next, node.setFlags);
  }

  function submitKeyword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentNode?.keywordRules?.length) return;

    const normalized = keyword.trim().toLowerCase();
    const rule = currentNode.keywordRules.find((item) => item.keyword.toLowerCase() === normalized);

    if (!rule) {
      setKeywordError("這個詞沒有讓日記產生反應。");
      return;
    }

    goToNode(rule.next, rule.setFlags);
  }

  function saveGame() {
    if (stage !== "visualNovel") return;

    const saveData: SaveData = {
      stage: "visualNovel",
      nodeId,
      flags,
      unlockedEndings,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    setSaveMessage("已快速存檔");
  }

  function loadGame() {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) {
      setSaveMessage("沒有可讀取的存檔");
      return;
    }

    try {
      const saveData = JSON.parse(rawSave) as SaveData;
      if (!nodesById.has(saveData.nodeId)) {
        setSaveMessage("存檔節點不存在");
        return;
      }
      setStage("visualNovel");
      setNodeId(saveData.nodeId);
      setFlags(saveData.flags ?? {});
      setUnlockedEndings(saveData.unlockedEndings ?? []);
      setKeyword("");
      setKeywordError("");
      setSaveMessage(`已讀取 ${new Date(saveData.timestamp).toLocaleString()}`);
    } catch {
      setSaveMessage("存檔格式無法讀取");
    }
  }

  function restart() {
    setStage("password");
    setPassword("");
    setPasswordError("");
    setPageIndex(0);
    setNodeId(story.startNode);
    setFlags({});
    setKeyword("");
    setKeywordError("");
    setSaveMessage("");
  }

  return (
    <main className={`app stage-${stage}`}>
      {stage === "password" && (
        <section className="gate-screen">
          <div className="gate-panel">
            <p className="eyebrow">Dream About Him</p>
            <h1>鎖住的日記</h1>
            <form onSubmit={submitPassword} className="password-form">
              <label htmlFor="password">輸入密碼</label>
              <div className="inline-control">
                <input
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="試試 dream"
                  type="password"
                  autoComplete="off"
                />
                <button type="submit">打開</button>
              </div>
              {passwordError && <p className="error-text">{passwordError}</p>}
            </form>
          </div>
        </section>
      )}

      {stage === "diary" && (
        <section className="diary-screen">
          <div className="diary-shell">
            <header className="topbar">
              <div>
                <p className="eyebrow">Diary</p>
                <h1>被雨聲寫下的頁面</h1>
              </div>
              <button className="icon-button" type="button" onClick={restart} aria-label="重新開始">
                <RotateCcw size={18} />
              </button>
            </header>

            <article
              className={`diary-page ${story.diaryPages[pageIndex].isFinal ? "final-page" : ""}`}
              onClick={story.diaryPages[pageIndex].isFinal ? enterVisualNovel : undefined}
            >
              <BookOpen className="page-mark" size={28} />
              <h2>{story.diaryPages[pageIndex].title}</h2>
              <p>{story.diaryPages[pageIndex].body}</p>
              {story.diaryPages[pageIndex].isFinal && <span className="page-cta">觸碰頁角</span>}
            </article>

            <footer className="diary-controls">
              <button
                type="button"
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
              >
                <ChevronLeft size={18} />
                上一頁
              </button>
              <span>
                {pageIndex + 1} / {story.diaryPages.length}
              </span>
              <button
                type="button"
                disabled={pageIndex === story.diaryPages.length - 1}
                onClick={() => setPageIndex((current) => Math.min(story.diaryPages.length - 1, current + 1))}
              >
                下一頁
                <ChevronRight size={18} />
              </button>
            </footer>
          </div>
        </section>
      )}

      {stage === "visualNovel" && currentNode && (
        <NovelScreen
          node={currentNode}
          flags={flags}
          keyword={keyword}
          keywordError={keywordError}
          saveMessage={saveMessage}
          onKeywordChange={setKeyword}
          onKeywordSubmit={submitKeyword}
          onChoice={(next, nextFlags) => goToNode(next, nextFlags)}
          onAdvance={() => advanceNode(currentNode)}
          onSave={saveGame}
          onLoad={loadGame}
          onRestart={restart}
        />
      )}

      {stage === "ending" && currentEnding && (
        <EndingScreen ending={currentEnding} unlockedEndings={unlockedEndings} onRestart={restart} onLoad={loadGame} />
      )}
    </main>
  );
}

interface NovelScreenProps {
  node: VNNode;
  flags: FlagMap;
  keyword: string;
  keywordError: string;
  saveMessage: string;
  onKeywordChange: (value: string) => void;
  onKeywordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChoice: (next: string, flags?: FlagMap) => void;
  onAdvance: () => void;
  onSave: () => void;
  onLoad: () => void;
  onRestart: () => void;
}

function NovelScreen({
  node,
  flags,
  keyword,
  keywordError,
  saveMessage,
  onKeywordChange,
  onKeywordSubmit,
  onChoice,
  onAdvance,
  onSave,
  onLoad,
  onRestart,
}: NovelScreenProps) {
  return (
    <section className={`novel-screen bg-${node.background}`}>
      <header className="vn-toolbar">
        <button className="tool-button" type="button" onClick={onSave}>
          <Save size={17} />
          快速存檔
        </button>
        <button className="tool-button" type="button" onClick={onLoad}>
          <Upload size={17} />
          讀檔
        </button>
        <button className="icon-button" type="button" onClick={onRestart} aria-label="重新開始">
          <RotateCcw size={18} />
        </button>
      </header>

      <div className={`sprite ${node.sprite ? `sprite-${node.sprite}` : "sprite-empty"}`} aria-hidden="true" />

      <section className="dialogue-box">
        <div className="speaker-row">
          <strong>{node.speaker ?? "旁白"}</strong>
          {saveMessage && <span>{saveMessage}</span>}
        </div>
        <p>{node.text}</p>

        {node.keywordRules && (
          <form className="keyword-form" onSubmit={onKeywordSubmit}>
            <input
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="輸入關鍵字"
              autoComplete="off"
            />
            <button type="submit">送出</button>
            {keywordError && <p className="error-text">{keywordError}</p>}
          </form>
        )}

        {node.choices?.length ? (
          <div className="choices">
            {node.choices.map((choice) => (
              <button key={choice.label} type="button" onClick={() => onChoice(choice.next, choice.setFlags)}>
                {choice.label}
              </button>
            ))}
          </div>
        ) : (
          node.next && (
            <button className="next-button" type="button" onClick={onAdvance}>
              繼續
              <ChevronRight size={18} />
            </button>
          )
        )}
        <div className="flag-line">{Object.keys(flags).length ? `已記錄：${Object.keys(flags).join(" / ")}` : "尚未做出選擇"}</div>
      </section>
    </section>
  );
}

interface EndingScreenProps {
  ending: Ending;
  unlockedEndings: string[];
  onRestart: () => void;
  onLoad: () => void;
}

function EndingScreen({ ending, unlockedEndings, onRestart, onLoad }: EndingScreenProps) {
  return (
    <section className={`ending-screen bg-${ending.background}`}>
      <div className="credits-projector">
        <p className="eyebrow">Ending</p>
        <h1>{ending.title}</h1>
        <p>{ending.text}</p>
        <div className="projector-frame" aria-label="片尾影片佔位">
          <div className="scanline" />
          <span>Ending Movie Placeholder</span>
        </div>
        <ul>
          {ending.credits.map((credit) => (
            <li key={credit}>{credit}</li>
          ))}
        </ul>
        <p className="ending-count">已解鎖結局：{unlockedEndings.length} / {story.endings.length}</p>
        <div className="ending-actions">
          <button type="button" onClick={onRestart}>重新開始</button>
          <button type="button" onClick={onLoad}>讀取存檔</button>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
