import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Image,
  Images,
  LockKeyhole,
  Music,
  PenLine,
  PlayCircle,
  RotateCcw,
  Save,
  Settings,
  SkipForward,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import { story } from "./data";
import type { Ending, FlagMap, GameStage, SaveData, SceneCharacter, VNNode } from "./types";
import "./styles.css";
import { useEffect, useMemo, useRef, useState } from "react";

const SAVE_KEY = "dream-about-him-save";
const ASSET_BASE = "/DreamAboutHim/assets";
const BGM_SRC = "/DreamAboutHim/assets/bgm/Your%20Name%20in%20Steam.mp3";

const characterSprites: Record<string, Record<string, string>> = {
  protagonist: {
    neutral: "blue/blue-normal.webp",
    soft: "blue/blue-sayhi.webp",
    sad: "blue/blue-shy.webp",
    surprised: "blue/blue-hold.webp",
  },
  him: {
    neutral: "white/white-normal.webp",
    soft: "white/white-smile.webp",
    sad: "white/white-humph.webp",
    surprised: "white/white-thumbup.webp",
  },
  friend: {
    neutral: "yellow/yellow-dressed-normal.webp",
    soft: "yellow/yellow-dressed-smile.webp",
    sad: "yellow/yellow-dressed-shy.webp",
    surprised: "yellow/yellow-dressed-stare.webp",
  },
};

const imageAssets = [
  `${ASSET_BASE}/ui/logo.webp`,
  `${ASSET_BASE}/diary/cover.webp`,
  `${ASSET_BASE}/diary/open-book.webp`,
  `${ASSET_BASE}/diary/page.webp`,
  `${ASSET_BASE}/bg/cafe.webp`,
  `${ASSET_BASE}/bg/bookstore.webp`,
  `${ASSET_BASE}/bg/starrysky.webp`,
  ...Object.values(characterSprites).flatMap((expressions) =>
    Object.values(expressions).map((spritePath) => `${ASSET_BASE}/role/${spritePath}`),
  ),
];

const preloadAssets = [...new Set(imageAssets), BGM_SRC];

function App() {
  const [loadingRun, setLoadingRun] = useState(0);
  const [loadingState, setLoadingState] = useState({
    error: "",
    isReady: false,
    loaded: 0,
    status: "正在整理回憶碎片",
    total: preloadAssets.length + 1,
  });
  const [stage, setStage] = useState<GameStage>("cover");
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isMemoryTransitioning, setIsMemoryTransitioning] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [nodeId, setNodeId] = useState(story.startNode);
  const [flags, setFlags] = useState<FlagMap>({});
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [keywordError, setKeywordError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.38);
  const audioRef = useRef<HTMLAudioElement>(null);

  const nodesById = useMemo(() => new Map(story.nodes.map((node) => [node.id, node])), []);
  const endingsById = useMemo(() => new Map(story.endings.map((ending) => [ending.id, ending])), []);
  const currentNode = nodesById.get(nodeId) ?? nodesById.get(story.startNode);
  const currentEnding = currentNode?.ending ? endingsById.get(currentNode.ending) : undefined;

  useEffect(() => {
    let isCancelled = false;

    async function loadGameAssets() {
      const total = preloadAssets.length + 1;
      let loaded = 0;

      const markLoaded = (status: string) => {
        loaded += 1;
        if (!isCancelled) {
          setLoadingState({
            error: "",
            isReady: false,
            loaded,
            status,
            total,
          });
        }
      };

      setLoadingState({
        error: "",
        isReady: false,
        loaded: 0,
        status: "正在整理回憶碎片",
        total,
      });

      try {
        await Promise.all([
          ...preloadAssets.map(async (asset) => {
            if (asset.endsWith(".mp3")) {
              await preloadAudio(asset);
              markLoaded("正在確認音樂檔案");
              return;
            }

            await preloadImage(asset);
            markLoaded("正在翻找日記與立繪");
          }),
          waitForFonts().then(() => markLoaded("正在讓文字清晰")),
        ]);

        if (!isCancelled) {
          setLoadingState({
            error: "",
            isReady: true,
            loaded: total,
            status: "準備完成",
            total,
          });
        }
      } catch {
        if (!isCancelled) {
          setLoadingState((current) => ({
            ...current,
            error: "有素材暫時無法載入，請確認網路或重新整理。",
          }));
        }
      }
    }

    loadGameAssets();

    return () => {
      isCancelled = true;
    };
  }, [loadingRun]);

  async function toggleBgm() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = bgmVolume;
      try {
        await audio.play();
        setIsBgmPlaying(true);
      } catch {
        setIsBgmPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsBgmPlaying(false);
  }

  function changeBgmVolume(nextVolume: number) {
    const audio = audioRef.current;
    const clampedVolume = Math.min(1, Math.max(0, nextVolume));
    if (audio) {
      audio.volume = clampedVolume;
    }
    setBgmVolume(clampedVolume);
  }

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim() === story.password) {
      setPasswordError("");
      setIsPasswordOpen(false);
      setIsUnlocking(true);
      window.setTimeout(() => {
        setIsUnlocking(false);
        setStage("diary");
      }, 1050);
      return;
    }

    setPasswordError("密碼不正確。日記仍然鎖著。");
  }

  function enterVisualNovel() {
    setIsMemoryTransitioning(true);
    window.setTimeout(() => {
      setStage("visualNovel");
      setNodeId(story.startNode);
      setKeyword("");
      setKeywordError("");
      setIsMemoryTransitioning(false);
    }, 700);
  }

  function resolveEndingId(nextFlags: FlagMap) {
    if (nextFlags.keywordBFound) return "ending-promise";
    if (nextFlags.keywordAFound) return "ending-clear-memory";
    return "ending-faint-memory";
  }

  function goToNode(nextId?: string, nextFlags?: FlagMap) {
    if (!nextId) return;
    const effectiveFlags = { ...flags, ...(nextFlags ?? {}) };
    setFlags(effectiveFlags);
    setKeyword("");
    setKeywordError("");

    const resolvedNextId = nextId === "resolve-ending" ? resolveEndingId(effectiveFlags) : nextId;
    setNodeId(resolvedNextId);

    const nextNode = nodesById.get(resolvedNextId);
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
    setStage("cover");
    setIsPasswordOpen(false);
    setIsUnlocking(false);
    setIsMemoryTransitioning(false);
    setPassword("");
    setPasswordError("");
    setPageIndex(0);
    setNodeId(story.startNode);
    setFlags({});
    setKeyword("");
    setKeywordError("");
    setSaveMessage("");
  }

  if (!loadingState.isReady) {
    return (
      <main className="app">
        <LoadingScreen
          error={loadingState.error}
          loaded={loadingState.loaded}
          onRetry={() => setLoadingRun((current) => current + 1)}
          status={loadingState.status}
          total={loadingState.total}
        />
      </main>
    );
  }

  return (
    <main className={`app stage-${stage}`}>
      <audio ref={audioRef} src={BGM_SRC} loop preload="auto" />
      {stage === "cover" && (
        <section className={`cover-screen ${isUnlocking ? "unlocking" : ""}`}>
          <AppChrome
            variant="menu"
            isBgmPlaying={isBgmPlaying}
            bgmVolume={bgmVolume}
            onToggleBgm={toggleBgm}
            onVolumeChange={changeBgmVolume}
          />
          <div className="diary-cover" aria-label="Dream About Him 日記本封面">
            <div className="cover-title">
              <p className="cover-kicker">Dream of</p>
              <h1>Forgotten Memories</h1>
            </div>
            <p className="cover-subtitle">那些還沒有被想起的事，都被鎖在這裡。</p>
            <button className="lock-button" type="button" onClick={() => setIsPasswordOpen(true)} aria-label="打開日記鎖">
              <LockKeyhole size={32} />
            </button>
            <div className="password-hint">
              <strong>Enter Password</strong>
              <span>Click the lock to enter your password</span>
            </div>
          </div>
          {isUnlocking && <div className="unlock-light" aria-hidden="true" />}

          {isPasswordOpen && (
            <div className="modal-backdrop" role="presentation">
              <section className="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-title">
                <button
                  className="modal-close"
                  type="button"
                  onClick={() => {
                    setIsPasswordOpen(false);
                    setPasswordError("");
                  }}
                  aria-label="關閉密碼視窗"
                >
                  <X size={18} />
                </button>
                <p className="eyebrow">Locked Diary</p>
                <h2 id="password-title">輸入密碼</h2>
                <form onSubmit={submitPassword} className="password-form">
                  <label htmlFor="password">密碼</label>
                  <div className="inline-control">
                    <input
                      id="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="試試 dream"
                      type="password"
                      autoComplete="off"
                      autoFocus
                    />
                    <button type="submit">打開</button>
                  </div>
                  {passwordError && <p className="error-text">{passwordError}</p>}
                </form>
              </section>
            </div>
          )}
        </section>
      )}

      {stage === "diary" && (
        <section className="diary-screen">
          <AppChrome
            variant="menu"
            isBgmPlaying={isBgmPlaying}
            bgmVolume={bgmVolume}
            onToggleBgm={toggleBgm}
            onVolumeChange={changeBgmVolume}
          />
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
              className={`diary-page ${story.diaryPages[pageIndex].isEntryPage ? "entry-page" : ""}`}
            >
              <BookOpen className="page-mark" size={28} />
              <h2>{story.diaryPages[pageIndex].title}</h2>
              <p>{story.diaryPages[pageIndex].body}</p>
              {story.diaryPages[pageIndex].isEntryPage && (
                <button
                  className={`memory-photo ${isMemoryTransitioning ? "memory-opening" : ""}`}
                  type="button"
                  onClick={enterVisualNovel}
                  aria-label={story.diaryPages[pageIndex].entryLabel}
                >
                  <Image size={28} />
                  <span>褪色照片</span>
                </button>
              )}
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
          isBgmPlaying={isBgmPlaying}
          bgmVolume={bgmVolume}
          onToggleBgm={toggleBgm}
          onVolumeChange={changeBgmVolume}
        />
      )}

      {stage === "ending" && currentEnding && (
        <EndingScreen ending={currentEnding} unlockedEndings={unlockedEndings} onRestart={restart} onLoad={loadGame} />
      )}
    </main>
  );
}

function preloadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });
}

async function preloadAudio(src: string) {
  const response = await fetch(src, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Unable to load audio: ${src}`);
  }
}

async function waitForFonts() {
  if ("fonts" in document) {
    await document.fonts.ready;
  }
}

interface LoadingScreenProps {
  error: string;
  loaded: number;
  onRetry: () => void;
  status: string;
  total: number;
}

function LoadingScreen({ error, loaded, onRetry, status, total }: LoadingScreenProps) {
  const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <section className="loading-screen" aria-live="polite" aria-busy={!error}>
      <div className="loading-mark">
        <img src="/DreamAboutHim/assets/ui/logo.webp" alt="" />
      </div>
      <div className="loading-panel">
        <p className="eyebrow">Dream of Forgotten Memories</p>
        <h1>Loading</h1>
        <p>{error || status}</p>
        <div className="loading-bar" aria-label={`載入進度 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-meta">
          <span>{progress}%</span>
          <span>
            {loaded} / {total}
          </span>
        </div>
        {error && (
          <button type="button" onClick={onRetry}>
            重新載入
          </button>
        )}
      </div>
    </section>
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
  isBgmPlaying: boolean;
  bgmVolume: number;
  onToggleBgm: () => void;
  onVolumeChange: (volume: number) => void;
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
  isBgmPlaying,
  bgmVolume,
  onToggleBgm,
  onVolumeChange,
}: NovelScreenProps) {
  return (
    <section className={`novel-screen bg-${node.background}`}>
      <AppChrome
        variant="novel"
        isBgmPlaying={isBgmPlaying}
        bgmVolume={bgmVolume}
        onToggleBgm={onToggleBgm}
        onVolumeChange={onVolumeChange}
      />
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

      <div className="character-stage" aria-hidden="true">
        {node.characters?.map((character) => (
          <CharacterSprite key={`${character.position}-${character.id}`} character={character} />
        ))}
      </div>

      <section className="dialogue-box">
        <div className="speaker-row">
          <strong>{node.speaker ?? "旁白"}</strong>
          {saveMessage && <span>{saveMessage}</span>}
        </div>
        <p>{node.text}</p>
        {!node.keywordRules && !node.choices?.length && node.next && (
          <button className="next-button" type="button" onClick={onAdvance}>
            繼續
            <ChevronRight size={18} />
          </button>
        )}
        <div className="flag-line">{Object.keys(flags).length ? `已記錄：${Object.keys(flags).join(" / ")}` : "尚未做出選擇"}</div>
      </section>

      {(node.keywordRules || node.choices?.length) && (
        <section className="story-prompt" role="dialog" aria-label="劇情互動">
          {node.keywordRules && (
            <form className="keyword-form" onSubmit={onKeywordSubmit}>
              <label htmlFor="story-keyword">輸入想起的關鍵字</label>
              <div className="prompt-row">
                <input
                  id="story-keyword"
                  value={keyword}
                  onChange={(event) => onKeywordChange(event.target.value)}
                  placeholder="輸入關鍵字"
                  autoComplete="off"
                />
                <button type="submit">送出</button>
              </div>
              {keywordError && <p className="error-text">{keywordError}</p>}
            </form>
          )}

          {node.choices?.length ? (
            <div className="choices" aria-label="劇情分歧選項">
              {node.choices.map((choice) => (
                <button key={choice.label} type="button" onClick={() => onChoice(choice.next, choice.setFlags)}>
                  {choice.label}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      )}

      <div className="vn-bottom-tools">
        <button type="button">
          <PenLine size={18} />
          Log
        </button>
        <button type="button">
          <PlayCircle size={18} />
          Auto
        </button>
        <button type="button">
          <SkipForward size={18} />
          Skip
        </button>
      </div>
    </section>
  );
}

interface AppChromeProps {
  variant: "menu" | "novel";
  isBgmPlaying: boolean;
  bgmVolume: number;
  onToggleBgm: () => void;
  onVolumeChange: (volume: number) => void;
}

function AppChrome({ variant, isBgmPlaying, bgmVolume, onToggleBgm, onVolumeChange }: AppChromeProps) {
  return (
    <>
      <div className="brand-lockup" aria-label="The Dream of Forgotten Memories">
        <img src="/DreamAboutHim/assets/ui/logo.webp" alt="" />
        <span>The Dream of<br />Forgotten Memories</span>
      </div>
      <nav className="top-controls" aria-label="主要控制">
        <button
          className={isBgmPlaying ? "is-active" : ""}
          type="button"
          onClick={onToggleBgm}
          aria-label={isBgmPlaying ? "暫停背景音樂" : "播放背景音樂"}
        >
          <Music size={22} />
        </button>
        <label className="volume-control" aria-label="背景音樂音量">
          <Volume2 size={22} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={bgmVolume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
          />
        </label>
      </nav>
      {variant === "menu" && (
        <aside className="side-actions" aria-label="側邊選單">
          <button type="button">
            <Settings size={22} />
            Settings
          </button>
          <button type="button">
            <Images size={22} />
            Gallery
          </button>
        </aside>
      )}
    </>
  );
}

function CharacterSprite({ character }: { character: SceneCharacter }) {
  const expressionSprites = characterSprites[character.id];
  const spritePath = expressionSprites?.[character.expression] ?? expressionSprites?.neutral;

  return (
    <div
      style={spritePath ? { "--sprite-image": `url("/DreamAboutHim/assets/role/${spritePath}")` } as React.CSSProperties : undefined}
      className={[
        "character-sprite",
        `character-${character.id}`,
        `position-${character.position}`,
        `expression-${character.expression}`,
        character.active ? "active" : "inactive",
      ].join(" ")}
    >
      <span>{character.name}</span>
    </div>
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
      <div className="ending-movie" aria-label="全螢幕片尾影片佔位">
        <div className="film-grain" />
        <span>Ending Movie Placeholder</span>
      </div>
      <div className="credits-projector">
        <p className="eyebrow">Ending</p>
        <h1>{ending.title}</h1>
        <p>{ending.text}</p>
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
