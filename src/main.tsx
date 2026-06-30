import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Gamepad2,
  Image,
  Images,
  Lightbulb,
  LockKeyhole,
  PenLine,
  PlayCircle,
  RotateCcw,
  Save,
  SkipForward,
  Upload,
  X,
} from "lucide-react";
import { story } from "./data";
import { endingRoutes, type EndingRouteLine, type RouteEnding } from "./endingRoutes";
import type { Ending, FlagMap, GameStage, PersistentProgress, SaveData, SceneCharacter, VNNode } from "./types";
import "./styles.css";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";

const SAVE_KEY = "dream-about-him-save";
const PROGRESS_KEY = "dream-about-him-progress";
const ASSET_BASE = "/DreamAboutHim/assets";
const BGM_SRC = "/DreamAboutHim/assets/bgm/bgm1.m4a";
const BGM_VOLUME = 0.38;
const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 900;
const INTRO_ANSWER_HASH = "e7db3ceaf3815ff9d3400834aeb9dfea7cc569b3895de2692546868453a31f25";
const DIARY_LOCK_HASH = "dfcae7d467db336f082cee92f87c5083f1a13fa9dd2a829a1923f9dddc67588c";
const YELLOW_NAME_HASHES = new Set([
  "de7de338bfa305172e0b2417fa0533e2a2359c719c78faee98c7358b66c225e0",
  "81f56eab3d930e5f7b4e15d959d83a65806191aac0b791a9833e60efcb25df74",
]);
const WHITE_NAME_HASHES = new Set([
  "0b25136078e9ad17acd877536e73d881c7bf3737812b38ebe7efe8b866b5614b",
  "b3d3e7059e715381234aee454e6917f05a31dc64841f6934e834d39a6a5afc1f",
]);
const BRANCH_TWO_HASH = "8f05623d9e0ef55b9b8e813fdec8be84811170caef5515620bd37cf309adbc61";
const BRANCH_THREE_HASHES = new Set([
  "ae40aeb3c5b4f62cd7443a5755ab06212cca822d39f1aa9fb54c473f403bad0b",
  "98509e3312f3d5a0e957d78c4a09aa27542776690f739790e076c92c051193b6",
  "b46d5d06ab987fb8906b83030ed8f42f2fa3d145be73a60db80f2e0d086b719e",
]);

type LockWheelIndex = 0 | 1 | 2;

const lockWheels = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  ["A", "E", "I", "O", "U"],
  ["A", "B", "C", "P", "Q", "R", "X", "Y", "Z"],
] as const;

const diaryPages = [
  {
    id: "page-3",
    title: "X月O日",
    body: "來回想一下今天...",
  },
];

const photoPages = [
  {
    ending: "ending-1",
    title: "糖紙裡的初戀",
    caption: "照片裡亮起第一個位置。",
    image: `${ASSET_BASE}/photo/end1.png`,
  },
  {
    ending: "ending-2",
    title: "記憶的顏色",
    caption: "照片裡多了些熟悉的笑聲。",
    image: `${ASSET_BASE}/photo/end2.png`,
  },
  {
    ending: "ending-3",
    title: "喊出你的名字",
    caption: "所有模糊的回憶終於清晰了。",
    image: `${ASSET_BASE}/photo/end3.png`,
  },
];

const diaryPageCount = 1 + photoPages.length;

const creditsSlides = {
  end1: [
    `${ASSET_BASE}/slide/end1/P1.png`,
    `${ASSET_BASE}/slide/end1/P2.png`,
    `${ASSET_BASE}/slide/end1/P3.png`,
  ],
  end3: [
    [`${ASSET_BASE}/slide/end3/P1-1.png`, `${ASSET_BASE}/slide/end3/P1-2.png`],
    [`${ASSET_BASE}/slide/end3/P2-1.png`, `${ASSET_BASE}/slide/end3/P2-2.png`],
    [`${ASSET_BASE}/slide/end3/P3-1.png`, `${ASSET_BASE}/slide/end3/P3-2.png`],
  ],
} as const;

const creditsAudio = {
  end1: `${ASSET_BASE}/bgm/end1.m4a`,
  end3: `${ASSET_BASE}/bgm/end3.m4a`,
} as const;

const creditLines = [
  { role: "劇本", name: "克拉珊" },
  { role: "謎題", name: "克拉珊" },
  { role: "美工及歌曲", name: "克拉珊 / ChatGPT / Dream / Suno" },
];

const characterSprites: Record<string, Record<string, string>> = {
  protagonist: {
    normal: "blue/blue-normal.webp",
    sayhi: "blue/blue-sayhi.webp",
    shy: "blue/blue-shy.webp",
    hold: "blue/blue-hold.webp",
    box: "blue/blue-box.webp",
    neutral: "blue/blue-normal.webp",
    soft: "blue/blue-sayhi.webp",
    sad: "blue/blue-shy.webp",
    surprised: "blue/blue-hold.webp",
  },
  him: {
    normal: "white/white-normal.webp",
    smile: "white/white-smile.webp",
    humph: "white/white-humph.webp",
    thumbup: "white/white-thumbup.webp",
    neutral: "white/white-normal.webp",
    soft: "white/white-smile.webp",
    sad: "white/white-humph.webp",
    surprised: "white/white-thumbup.webp",
  },
  friend: {
    normal: "yellow/yellow-dressed-normal.webp",
    smile: "yellow/yellow-dressed-smile.webp",
    shy: "yellow/yellow-dressed-shy.webp",
    stare: "yellow/yellow-dressed-stare.webp",
    think: "yellow/yellow-dressed-think.webp",
    wish: "yellow/yellow-dressed-wish.webp",
    neutral: "yellow/yellow-dressed-normal.webp",
    soft: "yellow/yellow-dressed-smile.webp",
    sad: "yellow/yellow-dressed-shy.webp",
    surprised: "yellow/yellow-dressed-stare.webp",
  },
  "friend-casual": {
    normal: "yellow/yellow-normal.webp",
    smile: "yellow/yellow-smile.webp",
    shy: "yellow/yellow-shy.webp",
    stare: "yellow/yellow-stare.webp",
    think: "yellow/yellow-think.webp",
    wish: "yellow/yellow-wish.webp",
    neutral: "yellow/yellow-normal.webp",
    soft: "yellow/yellow-smile.webp",
    sad: "yellow/yellow-shy.webp",
    surprised: "yellow/yellow-stare.webp",
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
  ...photoPages.map((page) => page.image),
  ...creditsSlides.end1,
  ...creditsSlides.end3.flat(),
  ...Object.values(characterSprites).flatMap((expressions) =>
    Object.values(expressions).map((spritePath) => `${ASSET_BASE}/role/${spritePath}`),
  ),
];

const preloadAssets = [...new Set(imageAssets), BGM_SRC, creditsAudio.end1, creditsAudio.end3];

function readPersistentProgress(): PersistentProgress {
  const emptyProgress: PersistentProgress = {
    version: 1,
    introSolved: false,
    diaryUnlocked: false,
    unlockedEndings: [],
  };

  try {
    const rawProgress = localStorage.getItem(PROGRESS_KEY);
    if (!rawProgress) return emptyProgress;

    const progress = JSON.parse(rawProgress) as Partial<PersistentProgress>;
    if (progress.version !== 1) return emptyProgress;

    return {
      version: 1,
      introSolved: Boolean(progress.introSolved || progress.diaryUnlocked),
      diaryUnlocked: Boolean(progress.diaryUnlocked),
      unlockedEndings: Array.isArray(progress.unlockedEndings)
        ? progress.unlockedEndings.filter((ending): ending is string => typeof ending === "string")
        : [],
    };
  } catch {
    return emptyProgress;
  }
}

function App() {
  const initialProgress = useMemo(readPersistentProgress, []);
  const [loadingRun, setLoadingRun] = useState(0);
  const [loadingState, setLoadingState] = useState({
    error: "",
    isReady: false,
    loaded: 0,
    status: "正在整理回憶碎片",
    total: preloadAssets.length + 1,
  });
  const [stage, setStage] = useState<GameStage>(initialProgress.diaryUnlocked ? "diary" : "cover");
  const [isIntroSolved, setIsIntroSolved] = useState(initialProgress.introSolved);
  const [isDiaryUnlocked, setIsDiaryUnlocked] = useState(initialProgress.diaryUnlocked);
  const [isIntroTransitioning, setIsIntroTransitioning] = useState(false);
  const [introAnswer, setIntroAnswer] = useState("");
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockIndices, setLockIndices] = useState<[number, number, number]>([0, 0, 0]);
  const [passwordError, setPasswordError] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [isWritingDiary, setIsWritingDiary] = useState(false);
  const [diaryRouteCount, setDiaryRouteCount] = useState<2 | 3 | 4 | null>(null);
  const [diaryStep, setDiaryStep] = useState(0);
  const [diaryInputs, setDiaryInputs] = useState({
    count: "",
    yellow: "",
    white: "",
    person: "",
    date: "",
  });
  const [diaryModal, setDiaryModal] = useState("");
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [isResetProgressOpen, setIsResetProgressOpen] = useState(false);
  const [isMoreGamesOpen, setIsMoreGamesOpen] = useState(false);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const [isDiaryReturnFading, setIsDiaryReturnFading] = useState(false);
  const [routeEnding, setRouteEnding] = useState<RouteEnding>("ending-1");
  const [routeWasUnlocked, setRouteWasUnlocked] = useState(false);
  const [nodeId, setNodeId] = useState(story.startNode);
  const [flags, setFlags] = useState<FlagMap>({});
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(initialProgress.unlockedEndings);
  const [keyword, setKeyword] = useState("");
  const [keywordError, setKeywordError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const viewportScale = useViewportScale();
  const viewportStyle = {
    height: DESIGN_HEIGHT * viewportScale,
    width: DESIGN_WIDTH * viewportScale,
  };
  const appStyle = {
    transform: `scale(${viewportScale})`,
  };

  const nodesById = useMemo(() => new Map(story.nodes.map((node) => [node.id, node])), []);
  const endingsById = useMemo(() => new Map(story.endings.map((ending) => [ending.id, ending])), []);
  const currentNode = nodesById.get(nodeId) ?? nodesById.get(story.startNode);
  const currentEnding = currentNode?.ending ? endingsById.get(currentNode.ending) : undefined;
  const lockPassword = lockIndices
    .map((letterIndex, wheelIndex) => lockWheels[wheelIndex][letterIndex])
    .join("");
  const currentHint = getCurrentHint(stage, isIntroSolved);

  useEffect(() => {
    const progress: PersistentProgress = {
      version: 1,
      introSolved: isIntroSolved,
      diaryUnlocked: isDiaryUnlocked,
      unlockedEndings,
    };
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // The game remains playable when browser storage is unavailable.
    }
  }, [isDiaryUnlocked, isIntroSolved, unlockedEndings]);

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
            if (asset.endsWith(".mp3") || asset.endsWith(".m4a")) {
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!loadingState.isReady || !audio) return;

    audio.volume = BGM_VOLUME;

    const playBgm = async () => {
      try {
        await audio.play();
        window.removeEventListener("pointerdown", playBgm);
        window.removeEventListener("keydown", playBgm);
      } catch {
        window.addEventListener("pointerdown", playBgm, { once: true });
        window.addEventListener("keydown", playBgm, { once: true });
      }
    };

    playBgm();

    return () => {
      window.removeEventListener("pointerdown", playBgm);
      window.removeEventListener("keydown", playBgm);
    };
  }, [loadingState.isReady]);

  function changeIntroAnswer(value: string) {
    setIntroAnswer(value.toUpperCase());
  }

  async function submitIntroAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await matchesHash(introAnswer, INTRO_ANSWER_HASH, "upper")) {
      setIsIntroTransitioning(true);
      window.setTimeout(() => {
        setIsIntroSolved(true);
      }, 980);
      window.setTimeout(() => {
        setIsIntroTransitioning(false);
      }, 1600);
    }
  }

  function rotateLockWheel(wheelIndex: LockWheelIndex, direction: 1 | -1) {
    setLockIndices((current) => {
      const next = [...current] as [number, number, number];
      const wheelLength = lockWheels[wheelIndex].length;
      next[wheelIndex] = (next[wheelIndex] + direction + wheelLength) % wheelLength;
      return next;
    });
    setPasswordError("");
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await matchesHash(lockPassword, DIARY_LOCK_HASH, "upper")) {
      setPasswordError("");
      setIsPasswordOpen(false);
      setIsDiaryUnlocked(true);
      setIsUnlocking(true);
      window.setTimeout(() => {
      setIsUnlocking(false);
      setStage("diary");
      setIsIntroTransitioning(false);
    }, 1050);
      return;
    }

    setPasswordError("密碼不正確。日記仍然鎖著。");
  }

  function changeDiaryInput(field: keyof typeof diaryInputs, value: string) {
    const nextValue = field === "count" ? value.replace(/\D/g, "").slice(0, 1) : value.trim();
    if (field !== "count") {
      setDiaryInputs((current) => ({ ...current, [field]: nextValue }));
      return;
    }

    const nextCount = Number(nextValue);
    const isValidRouteCount = nextCount === 2 || nextCount === 3 || nextCount === 4;

    setDiaryInputs((current) => ({
      ...current,
      count: nextValue,
      white: nextCount >= 3 ? current.white : "",
      person: nextCount === 4 ? current.person : "",
      date: "",
    }));

    if (!isValidRouteCount) {
      setDiaryRouteCount(null);
      setDiaryStep(0);
      return;
    }

    setDiaryRouteCount(nextCount);
    setDiaryStep((current) => (current > 1 ? 1 : current));
  }

  function rememberWrong() {
    setDiaryModal("我記錯了");
  }

  function startRouteEnding(nextEnding: RouteEnding) {
    const route = endingRoutes[nextEnding];
    setRouteWasUnlocked(unlockedEndings.includes(route.albumEnding));
    playMagicTransitionSound();
    setIsRouteTransitioning(true);
    setRouteEnding(nextEnding);
    setUnlockedEndings((current) =>
      current.includes(route.albumEnding) ? current : [...current, route.albumEnding],
    );
    window.setTimeout(() => setStage("visualNovel"), 650);
    window.setTimeout(() => setIsRouteTransitioning(false), 1900);
  }

  function returnToDiaryFromCredits() {
    setPageIndex(0);
    setIsWritingDiary(false);
    setStage("diary");
    setIsDiaryReturnFading(true);
    window.setTimeout(() => setIsDiaryReturnFading(false), 1500);
  }

  function submitDiaryCount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const count = Number(diaryInputs.count);
    if (count !== 2 && count !== 3 && count !== 4) {
      rememberWrong();
      return;
    }
    setDiaryRouteCount(count);
    setDiaryStep(1);
  }

  async function submitDiaryNames(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentCount = Number(diaryInputs.count);

    if (
      (currentCount !== 2 && currentCount !== 3 && currentCount !== 4) ||
      diaryRouteCount !== currentCount
    ) {
      rememberWrong();
      return;
    }

    const yellowName = await sha256(diaryInputs.yellow.trim());
    const whiteName = await sha256(diaryInputs.white.trim());
    const personName = await sha256(diaryInputs.person.trim());

    if (!YELLOW_NAME_HASHES.has(yellowName)) {
      rememberWrong();
      return;
    }

    if (diaryRouteCount === 2) {
      startRouteEnding("ending-1");
      return;
    }

    if (!WHITE_NAME_HASHES.has(whiteName)) {
      rememberWrong();
      return;
    }

    if (diaryRouteCount === 3) {
      startRouteEnding("ending-2");
      return;
    }

    if (personName === BRANCH_TWO_HASH) {
      startRouteEnding("ending-2-branch");
      return;
    }

    if (BRANCH_THREE_HASHES.has(personName)) {
      setDiaryStep(2);
      return;
    }

    rememberWrong();
  }

  async function submitDiaryDate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const [month, day] = diaryInputs.date.split(",");
    if (Number(month) !== 7 || Number(day) !== 24) {
      rememberWrong();
      return;
    }
    startRouteEnding("ending-3");
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
    setStage(isDiaryUnlocked ? "diary" : "cover");
    setIsIntroTransitioning(false);
    setIntroAnswer("");
    setIsPasswordOpen(false);
    setIsUnlocking(false);
    setLockIndices([0, 0, 0]);
    setPasswordError("");
    setPageIndex(0);
    setIsWritingDiary(false);
    setDiaryRouteCount(null);
    setDiaryStep(0);
    setDiaryInputs({ count: "", yellow: "", white: "", person: "", date: "" });
    setDiaryModal("");
    setIsHintsOpen(false);
    setIsResetProgressOpen(false);
    setIsMoreGamesOpen(false);
    setNodeId(story.startNode);
    setFlags({});
    setKeyword("");
    setKeywordError("");
    setSaveMessage("");
  }

  function resetProgress() {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }

  if (!loadingState.isReady) {
    return (
      <div className="app-viewport" style={viewportStyle}>
        <main className="app" style={appStyle}>
          <LoadingScreen
            error={loadingState.error}
            loaded={loadingState.loaded}
            onRetry={() => setLoadingRun((current) => current + 1)}
            status={loadingState.status}
            total={loadingState.total}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-viewport" style={viewportStyle}>
      <main className={`app stage-${stage} ${isRouteTransitioning ? "route-transitioning" : ""}`} style={appStyle}>
        <section className="orientation-guard" aria-label="請將手機橫放">
          <div className="orientation-panel">
            <RotateCcw size={34} />
            <p>請將手機橫放</p>
          </div>
        </section>
        <audio ref={audioRef} src={BGM_SRC} loop preload="auto" />
        {isRouteTransitioning && (
          <div className="route-transition" aria-hidden="true">
            <div className="route-transition-core" />
            <div className="route-transition-ring ring-one" />
            <div className="route-transition-ring ring-two" />
            <div className="route-transition-sparks">
              {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
            </div>
          </div>
        )}
        {stage === "cover" && (
          <section className={`cover-screen ${isIntroSolved ? "intro-solved" : "intro-active"} ${isIntroTransitioning ? "intro-transitioning" : ""} ${isUnlocking ? "unlocking" : ""}`}>
          <AppChrome
            variant="menu"
            onOpenHints={() => setIsHintsOpen(true)}
            onOpenMoreGames={() => setIsMoreGamesOpen(true)}
          />
          {(!isIntroSolved || isIntroTransitioning) && (
            <form className="intro-layer" onSubmit={submitIntroAnswer}>
              <div className="hidden-item" aria-label="隱藏物件" />
              <div className="intro-divider">
                <span>Enter the answer</span>
              </div>
              <input
                className="intro-input"
                value={introAnswer}
                onChange={(event) => changeIntroAnswer(event.target.value)}
                autoComplete="off"
                autoFocus
                aria-label="入口密語"
              />
              <button className="intro-submit" type="submit">Submit</button>
            </form>
          )}
          {isIntroTransitioning && <div className="intro-starlight" aria-hidden="true" />}
          {isIntroSolved && (
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
          )}
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
                <form onSubmit={submitPassword} className="password-form lock-code-form">
                  <div className="lock-wheels" aria-label="旋轉密碼鎖">
                    {lockWheels.map((wheel, wheelIndex) => (
                      <div className="lock-wheel" key={wheel.join("")}>
                        <button type="button" onClick={() => rotateLockWheel(wheelIndex as LockWheelIndex, -1)} aria-label={`第 ${wheelIndex + 1} 格上一個字母`}>
                          <ChevronUp size={18} />
                        </button>
                        <span>{wheel[lockIndices[wheelIndex]]}</span>
                        <button type="button" onClick={() => rotateLockWheel(wheelIndex as LockWheelIndex, 1)} aria-label={`第 ${wheelIndex + 1} 格下一個字母`}>
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="submit">打開</button>
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
              onOpenHints={() => setIsHintsOpen(true)}
              onOpenMoreGames={() => setIsMoreGamesOpen(true)}
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

              <article className={`diary-page ${pageIndex === 0 ? "entry-page writing-page" : "photo-page"}`}>
                <BookOpen className="page-mark" size={28} />
                {pageIndex === 0 ? (
                  <>
                    <h2>{diaryPages[0].title}</h2>
                    <p>{diaryPages[0].body}</p>
                    {!isWritingDiary ? (
                      <button className="write-diary-button" type="button" onClick={() => setIsWritingDiary(true)}>
                        寫日記
                      </button>
                    ) : (
                      <DiaryWriting
                        routeCount={diaryRouteCount}
                        step={diaryStep}
                        inputs={diaryInputs}
                        onChange={changeDiaryInput}
                        onSubmitCount={submitDiaryCount}
                        onSubmitNames={submitDiaryNames}
                        onSubmitDate={submitDiaryDate}
                      />
                    )}
                  </>
                ) : (
                  <PhotoDiaryPage page={photoPages[pageIndex - 1]} isUnlocked={unlockedEndings.includes(photoPages[pageIndex - 1].ending)} />
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
                  {pageIndex + 1} / {diaryPageCount}
                </span>
                <button
                  type="button"
                  disabled={pageIndex === diaryPageCount - 1}
                  onClick={() => setPageIndex((current) => Math.min(diaryPageCount - 1, current + 1))}
                >
                  下一頁
                  <ChevronRight size={18} />
                </button>
              </footer>
            </div>
            {diaryModal && (
              <div className="modal-backdrop" role="presentation">
                <section className="memory-error-modal" role="dialog" aria-modal="true">
                  <p>{diaryModal}</p>
                  <button type="button" onClick={() => setDiaryModal("")}>再想一次</button>
                </section>
              </div>
            )}
          </section>
        )}

        {stage === "visualNovel" && (
          <RouteNovelScreen
            route={endingRoutes[routeEnding]}
            routeEnding={routeEnding}
            canSkipCredits={routeWasUnlocked}
            mainAudioRef={audioRef}
            onOpenGallery={() => {
              setPageIndex(1);
              setStage("diary");
            }}
            onReturnToDiary={returnToDiaryFromCredits}
            onRestart={restart}
          />
        )}

        {stage === "ending" && currentEnding && (
          <EndingScreen ending={currentEnding} unlockedEndings={unlockedEndings} onRestart={restart} onLoad={loadGame} />
        )}

        {isDiaryReturnFading && <div className="diary-return-fade" aria-hidden="true" />}

        {isHintsOpen && (
          <div className="modal-backdrop" role="presentation">
            <section className="password-modal hint-modal" role="dialog" aria-modal="true" aria-labelledby="hint-title">
              <button className="modal-close" type="button" onClick={() => setIsHintsOpen(false)} aria-label="關閉提示">
                <X size={18} />
              </button>
              <p className="eyebrow">Hints</p>
              <h2 id="hint-title">提示</h2>
              <p>{currentHint}</p>
              <button
                className="reset-progress-button"
                type="button"
                onClick={() => {
                  setIsHintsOpen(false);
                  setIsResetProgressOpen(true);
                }}
              >
                <RotateCcw size={17} />
                重置進度
              </button>
            </section>
          </div>
        )}

        {isResetProgressOpen && (
          <div className="modal-backdrop" role="presentation">
            <section className="password-modal reset-progress-modal" role="dialog" aria-modal="true" aria-labelledby="reset-progress-title">
              <p className="eyebrow">Reset Progress</p>
              <h2 id="reset-progress-title">確定要重置嗎？</h2>
              <p>入口密碼、日記鎖、已解鎖相片與快速存檔都會被清除。</p>
              <div className="reset-progress-actions">
                <button type="button" onClick={() => setIsResetProgressOpen(false)}>取消</button>
                <button className="confirm-reset" type="button" onClick={resetProgress}>確認重置</button>
              </div>
            </section>
          </div>
        )}

        {isMoreGamesOpen && <MoreGamesScreen onClose={() => setIsMoreGamesOpen(false)} />}
      </main>
    </div>
  );
}

function getViewportScale() {
  const scale = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT);
  return Math.floor(scale * 10000) / 10000;
}

function useViewportScale() {
  const [scale, setScale] = useState(getViewportScale);

  useEffect(() => {
    function updateScale() {
      const nextScale = getViewportScale();
      setScale((current) => (current === nextScale ? current : nextScale));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    window.visualViewport?.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.visualViewport?.removeEventListener("resize", updateScale);
    };
  }, []);

  return scale;
}

function playMagicTransitionSound() {
  try {
    const context = new AudioContext();
    const now = context.currentTime;
    const master = context.createGain();
    master.gain.setValueAtTime(0.5, now);
    master.connect(context.destination);

    [659.25, 783.99, 987.77, 1318.51].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.1;
      oscillator.type = index % 2 === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.04, start + 0.65);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.14, start + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.95);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(start + 1);
    });

    const shimmerLength = Math.floor(context.sampleRate * 0.9);
    const shimmerBuffer = context.createBuffer(1, shimmerLength, context.sampleRate);
    const shimmerData = shimmerBuffer.getChannelData(0);
    for (let index = 0; index < shimmerLength; index += 1) {
      const progress = index / shimmerLength;
      shimmerData[index] = (Math.random() * 2 - 1) * Math.sin(progress * Math.PI) * 0.22;
    }

    const shimmer = context.createBufferSource();
    const highPass = context.createBiquadFilter();
    const shimmerGain = context.createGain();
    shimmer.buffer = shimmerBuffer;
    highPass.type = "highpass";
    highPass.frequency.setValueAtTime(4200, now);
    shimmerGain.gain.setValueAtTime(0.0001, now);
    shimmerGain.gain.exponentialRampToValueAtTime(0.18, now + 0.18);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    shimmer.connect(highPass);
    highPass.connect(shimmerGain);
    shimmerGain.connect(master);
    shimmer.start(now);

    void context.resume().catch(() => undefined);
    window.setTimeout(() => void context.close(), 1800);
  } catch {
    // The visual transition still works when Web Audio is unavailable.
  }
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

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function matchesHash(value: string, expectedHash: string, transform: "none" | "upper" = "none") {
  const normalized = transform === "upper" ? value.trim().toUpperCase() : value.trim();
  return (await sha256(normalized)) === expectedHash;
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

interface DiaryWritingProps {
  routeCount: 2 | 3 | 4 | null;
  step: number;
  inputs: {
    count: string;
    yellow: string;
    white: string;
    person: string;
    date: string;
  };
  onChange: (field: keyof DiaryWritingProps["inputs"], value: string) => void;
  onSubmitCount: (event: React.FormEvent<HTMLFormElement>) => void;
  onSubmitNames: (event: React.FormEvent<HTMLFormElement>) => void;
  onSubmitDate: (event: React.FormEvent<HTMLFormElement>) => void;
}

function PhotoDiaryPage({ page, isUnlocked }: { page: (typeof photoPages)[number]; isUnlocked: boolean }) {
  return (
    <>
      <div className="photo-page-copy">
        <p className="eyebrow">Memory Photo</p>
        <h2>{page.title}</h2>
        <p>{isUnlocked ? page.caption : "這張照片還沒有顯影。"}</p>
      </div>
      <figure className={`diary-photo-frame ${isUnlocked ? "is-unlocked" : "is-locked"}`}>
        {isUnlocked ? (
          <img src={page.image} alt={page.title} />
        ) : (
          <figcaption>
            <Image size={42} />
            <span>尚未解鎖</span>
          </figcaption>
        )}
      </figure>
    </>
  );
}

function DiaryWriting({ routeCount, step, inputs, onChange, onSubmitCount, onSubmitNames, onSubmitDate }: DiaryWritingProps) {
  const [dateMonth = "", dateDay = ""] = inputs.date.split(",");
  const changeDatePart = (part: "month" | "day", value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(0, 2);
    onChange("date", part === "month" ? `${nextValue},${dateDay}` : `${dateMonth},${nextValue}`);
  };

  return (
    <section className="diary-writing" aria-label="寫日記">
      <form onSubmit={onSubmitCount} className="diary-line-form diary-count-form">
        <span className="diary-blank-group">
          <span>今天，我和老友吃飯，我們</span>
          <input
            value={inputs.count}
            onChange={(event) => onChange("count", event.target.value)}
            inputMode="numeric"
            aria-label="人數"
          />
          <span>人</span>
        </span>
        <span>一起去了一間咖啡廳敘舊。</span>
        {step === 0 && <button type="submit">寫下去</button>}
      </form>

      {step >= 1 && (
        <form onSubmit={onSubmitNames} className="diary-right-form diary-names-form">
          <div className="diary-line-form diary-name-block">
            <span className="diary-blank-group">
              <span>真是好久不見了，</span>
              <input value={inputs.yellow} onChange={(event) => onChange("yellow", event.target.value)} aria-label="黃兔名字" />
            </span>
            <span>她變得更漂亮了，而且還回到了我們以前的小學當老師！</span>
            {routeCount && routeCount >= 3 && (
              <>
              <span className="diary-blank-group">
                <span>還有</span>
                <input value={inputs.white} onChange={(event) => onChange("white", event.target.value)} aria-label="白兔名字" />
              </span>
              <span>，當年的小白兔居然已經長這麼高了，不過完全不意外他成為了美髮師，總覺得很適合他呢！</span>
              </>
            )}
            {step === 1 && routeCount !== 4 && <button type="submit">確認</button>}
          </div>
          {routeCount === 4 && (
            <div className="diary-line-form diary-person-block">
              <span>我們還聊到了</span>
              <input value={inputs.person} onChange={(event) => onChange("person", event.target.value)} aria-label="聊到的人" />
              <span>的事。</span>
              {step === 1 && <button type="submit">確認</button>}
            </div>
          )}
        </form>
      )}

      {step >= 2 && (
        <form onSubmit={onSubmitDate} className="diary-line-form diary-right-form diary-date-form">
          <span>沒想到...他真的回來了，我們真的要見面了！就在</span>
          <input
            className="diary-date-input"
            value={dateMonth}
            onChange={(event) => changeDatePart("month", event.target.value)}
            inputMode="numeric"
            aria-label="見面月份"
          />
          <span>月</span>
          <input
            className="diary-date-input"
            value={dateDay}
            onChange={(event) => changeDatePart("day", event.target.value)}
            inputMode="numeric"
            aria-label="見面日期"
          />
          <span>日。</span>
          <button type="submit">完成</button>
        </form>
      )}
    </section>
  );
}

interface RouteNovelScreenProps {
  route: (typeof endingRoutes)[RouteEnding];
  routeEnding: RouteEnding;
  canSkipCredits: boolean;
  mainAudioRef: RefObject<HTMLAudioElement | null>;
  onOpenGallery: () => void;
  onReturnToDiary: () => void;
  onRestart: () => void;
}

function RouteNovelScreen({ route, routeEnding, canSkipCredits, mainAudioRef, onOpenGallery, onReturnToDiary, onRestart }: RouteNovelScreenProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [choiceLines, setChoiceLines] = useState<EndingRouteLine[] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isEndingTransitioning, setIsEndingTransitioning] = useState(false);
  const [displayCharacters, setDisplayCharacters] = useState<SceneCharacter[]>([]);
  const [isCharacterStageVisible, setIsCharacterStageVisible] = useState(false);
  const endingAudioRef = useRef<HTMLAudioElement | null>(null);
  const scene = route.scenes[sceneIndex] ?? route.scenes[0];
  const lines = choiceLines ?? scene.lines;
  const line = lines[lineIndex] ?? lines[lines.length - 1];
  const isChoicePoint = !choiceLines && !isComplete && lineIndex >= scene.lines.length - 1 && !!scene.choices?.length;

  useLayoutEffect(() => {
    if (line?.characters === undefined) return;

    if (line.characters.length === 0) {
      setIsCharacterStageVisible(false);
      const fadeTimer = window.setTimeout(() => setDisplayCharacters([]), 320);
      return () => window.clearTimeout(fadeTimer);
    }

    setDisplayCharacters(line.characters);
    setIsCharacterStageVisible(true);
  }, [line]);

  useEffect(() => {
    setSceneIndex(0);
    setLineIndex(0);
    setChoiceLines(null);
    setIsComplete(false);
    setIsEndingTransitioning(false);
    setDisplayCharacters([]);
    setIsCharacterStageVisible(false);
    endingAudioRef.current?.pause();
    endingAudioRef.current = null;
  }, [route]);

  useEffect(() => {
    return () => {
      endingAudioRef.current?.pause();
      endingAudioRef.current = null;
    };
  }, []);

  function advanceRoute() {
    if (isChoicePoint) return;

    if (lineIndex < lines.length - 1) {
      setLineIndex((current) => current + 1);
      return;
    }

    if (choiceLines) {
      setChoiceLines(null);
      setLineIndex(0);
      setSceneIndex((current) => current + 1);
      return;
    }

    if (sceneIndex < route.scenes.length - 1) {
      setSceneIndex((current) => current + 1);
      setLineIndex(0);
      return;
    }

    if (mainAudioRef.current) {
      mainAudioRef.current.pause();
      mainAudioRef.current.volume = 0;
    }
    endingAudioRef.current?.pause();
    const endingAudio = new Audio(routeEnding === "ending-3" ? creditsAudio.end3 : creditsAudio.end1);
    endingAudio.volume = 0.72;
    endingAudio.preload = "auto";
    endingAudioRef.current = endingAudio;

    const playEndingAudio = () => {
      endingAudio.play().catch(() => undefined);
      window.removeEventListener("pointerdown", playEndingAudio);
      window.removeEventListener("keydown", playEndingAudio);
    };
    endingAudio.play().catch(() => {
      window.addEventListener("pointerdown", playEndingAudio, { once: true });
      window.addEventListener("keydown", playEndingAudio, { once: true });
    });

    setIsEndingTransitioning(true);
    window.setTimeout(() => {
      setIsComplete(true);
      setIsEndingTransitioning(false);
    }, 1500);
  }

  function chooseRoute(linesForChoice: EndingRouteLine[]) {
    setChoiceLines(linesForChoice);
    setLineIndex(0);
  }

  if (isComplete) {
    return <EndingCreditsScreen route={route} routeEnding={routeEnding} canSkipCredits={canSkipCredits} mainAudioRef={mainAudioRef} endingAudioRef={endingAudioRef} onOpenGallery={onOpenGallery} onReturnToDiary={onReturnToDiary} onRestart={onRestart} />;
  }

  return (
    <section className={`novel-screen bg-${route.background}`}>
      <AppChrome variant="novel" />
      <div className={`character-stage ${isCharacterStageVisible ? "is-visible" : "is-hidden"}`} aria-hidden="true">
        {displayCharacters.map((character) => (
          <CharacterSprite key={`${character.id}-${character.position}`} character={character} />
        ))}
      </div>
      <section className="dialogue-box">
        <div className="speaker-row">
          {line?.speaker && line.speaker !== "旁白" && (
            <strong className={getSpeakerClassName(line.speaker)}>{line.speaker}</strong>
          )}
        </div>
        <p>{line?.text}</p>
        {isChoicePoint && scene.choices ? (
          <div className="route-choices" aria-label="劇情選項">
            {scene.choices.map((choice) => (
              <button key={choice.label} type="button" onClick={() => chooseRoute(choice.lines)}>
                {choice.label}
              </button>
            ))}
          </div>
        ) : (
          <button className="next-button" type="button" onClick={advanceRoute}>
            {lineIndex < lines.length - 1 || choiceLines || sceneIndex < route.scenes.length - 1 ? "繼續" : "完成"}
            <ChevronRight size={18} />
          </button>
        )}
      </section>
      {isEndingTransitioning && <div className="story-to-credits-transition" aria-hidden="true" />}
    </section>
  );
}

type CreditsPhase = "slide" | "creditRole" | "creditName" | "fade" | "finalPhoto" | "final";

interface EndingCreditsScreenProps {
  route: (typeof endingRoutes)[RouteEnding];
  routeEnding: RouteEnding;
  canSkipCredits: boolean;
  mainAudioRef: RefObject<HTMLAudioElement | null>;
  endingAudioRef: RefObject<HTMLAudioElement | null>;
  onOpenGallery: () => void;
  onReturnToDiary: () => void;
  onRestart: () => void;
}

function EndingCreditsScreen({ route, routeEnding, canSkipCredits, mainAudioRef, endingAudioRef, onOpenGallery, onReturnToDiary, onRestart }: EndingCreditsScreenProps) {
  const isFullEnding = routeEnding === "ending-3";
  const [slideIndex, setSlideIndex] = useState(0);
  const [phase, setPhase] = useState<CreditsPhase>("slide");
  const [isSkippingCredits, setIsSkippingCredits] = useState(false);
  const finalPhoto = photoPages.find((page) => page.ending === route.albumEnding) ?? photoPages[0];
  const currentCredit = creditLines[slideIndex] ?? creditLines[creditLines.length - 1];

  const currentSlide = isFullEnding ? creditsSlides.end3[slideIndex][0] : creditsSlides.end1[slideIndex];
  const creditSlide = isFullEnding ? creditsSlides.end3[slideIndex][1] : currentSlide;

  function leaveCredits(next: () => void) {
    endingAudioRef.current?.pause();
    endingAudioRef.current = null;
    if (mainAudioRef.current) {
      mainAudioRef.current.volume = BGM_VOLUME;
      mainAudioRef.current.play().catch(() => undefined);
    }
    next();
  }

  function skipCreditsToDiary() {
    if (isSkippingCredits) return;

    setIsSkippingCredits(true);
    const endingAudio = endingAudioRef.current;
    const startVolume = endingAudio?.volume ?? 0;
    const startedAt = performance.now();
    const duration = 1500;

    function fadeAudio(now: number) {
      const progress = Math.min(1, (now - startedAt) / duration);
      if (endingAudio) {
        endingAudio.volume = startVolume * (1 - progress);
      }
      if (progress < 1) {
        window.requestAnimationFrame(fadeAudio);
      }
    }

    window.requestAnimationFrame(fadeAudio);
    window.setTimeout(() => {
      endingAudioRef.current?.pause();
      endingAudioRef.current = null;
      if (mainAudioRef.current) {
        mainAudioRef.current.volume = BGM_VOLUME;
        mainAudioRef.current.play().catch(() => undefined);
      }
      onReturnToDiary();
    }, duration);
  }

  useEffect(() => {
    if (phase === "final") return;

    const nextTimer = window.setTimeout(() => {
      if (phase === "finalPhoto") {
        setPhase("final");
        return;
      }

      if (phase === "slide") {
        setPhase("creditRole");
        return;
      }

      if (phase === "creditRole") {
        setPhase("creditName");
        return;
      }

      if (phase === "creditName") {
        setPhase("fade");
        return;
      }

      if (slideIndex < creditsSlides.end1.length - 1) {
        setSlideIndex((current) => current + 1);
        setPhase("slide");
        return;
      }

      setPhase("finalPhoto");
    }, phase === "slide" ? 3000 : phase === "creditRole" ? 2500 : phase === "creditName" ? 4000 : phase === "fade" ? 2500 : 5000);

    return () => window.clearTimeout(nextTimer);
  }, [phase, slideIndex]);

  return (
    <section className="ending-credits-screen">
      <div className="credits-orange-reveal" aria-hidden="true" />
      <div className="ending-credits-glow" aria-hidden="true" />
      {canSkipCredits && (
        <button
          className="credits-skip-button"
          type="button"
          onClick={skipCreditsToDiary}
          disabled={isSkippingCredits}
          aria-label="跳過片尾"
        >
          <SkipForward size={20} />
          Skip
        </button>
      )}
      {isSkippingCredits && <div className="credits-skip-fade" aria-hidden="true" />}
      {phase === "final" && (
        <div className="ending-fireworks" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      {phase === "finalPhoto" || phase === "final" ? (
        <div className="ending-final-card">
          <figure className={`ending-final-photo ${phase === "finalPhoto" ? "is-photo-only" : ""}`}>
            <img src={finalPhoto.image} alt={finalPhoto.title} />
          </figure>
          <div className={`ending-final-copy ${phase === "final" ? "is-visible" : ""}`}>
            <p className="eyebrow">Thank You</p>
            <h1>感謝你的遊玩</h1>
            <p>結局：{route.title}</p>
            <p>{route.endingText}</p>
            <div className="thank-you-actions ending-final-actions">
              <button type="button" onClick={() => leaveCredits(onOpenGallery)}>
                <Images size={24} />
                Gallery
              </button>
              <button type="button" onClick={() => leaveCredits(onRestart)}>
                <RotateCcw size={24} />
                Play Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`ending-credit-step is-${phase}`} key={slideIndex}>
          <figure className="ending-credit-slide">
            <img className="ending-slide-base" src={currentSlide} alt="" />
            {isFullEnding && <img className="ending-slide-credit" src={creditSlide} alt="" />}
          </figure>
          <section className="ending-credit-names" aria-label="工作人員名單">
            {(phase === "creditRole" || phase === "creditName") ? (
              <div className="ending-meteor-shower" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ) : null}
            {(phase === "creditRole" || phase === "creditName" || phase === "fade") ? <h1 className="credit-role-text">{currentCredit.role}</h1> : null}
            {(phase === "creditName" || phase === "fade") ? <strong className="credit-name-text">{currentCredit.name}</strong> : null}
          </section>
        </div>
      )}
    </section>
  );
}

function ThankYouScreen({ onOpenGallery, onRestart }: { onOpenGallery: () => void; onRestart: () => void }) {
  return (
    <section className="thank-you-screen">
      <AppChrome variant="novel" />
      <div className="thank-you-glow" aria-hidden="true" />
      <div className="thank-you-content">
        <h1>
          <span>Thank You</span>
          <em>for Playing</em>
        </h1>
        <div className="thank-you-ornament" aria-hidden="true"><span>✦</span></div>
        <div className="thank-you-message">
          <p>感謝你陪我做了一場夢。</p>
          <p>那些還沒有被想起的事，都被鎖在這裡。</p>
          <p>願你也能在現實裡，找到屬於自己的光。</p>
        </div>
        <div className="thank-you-actions">
          <button type="button" onClick={onOpenGallery}>
            <Images size={24} />
            Gallery
          </button>
          <button type="button" onClick={onRestart}>
            <RotateCcw size={24} />
            Play Again
          </button>
        </div>
      </div>
      <img className="thank-you-book" src="/DreamAboutHim/assets/diary/cover.webp" alt="" />
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
      <AppChrome variant="novel" />
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
          {node.speaker && node.speaker !== "旁白" && (
            <strong className={getSpeakerClassName(node.speaker)}>{node.speaker}</strong>
          )}
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
  onOpenHints?: () => void;
  onOpenMoreGames?: () => void;
}

function getSpeakerClassName(speaker: string) {
  if (speaker === "主角") return "speaker-name speaker-protagonist";
  if (speaker === "黃欣雯") return "speaker-name speaker-hsinwen";
  if (speaker === "白恩棋") return "speaker-name speaker-enchi";
  if (speaker === "藍天和") return "speaker-name speaker-tianhe";
  return "speaker-name";
}

function getCurrentHint(
  stage: GameStage,
  isIntroSolved: boolean,
) {
  if (stage === "cover" && !isIntroSolved) {
    return "觀察「童話之夢」裡的隱藏物件，請輸入8個大寫英文字母。";
  }
  if (stage === "cover") {
    return "觀察「童話之夢」遊戲裡，哪裏有出現這本日記上的小卡的圖案輪廓？";
  }
  return "完成日記的故事，填入相對應的人數（輸入數字）和人名（輸入2-3個字的中文），部分結局需先玩過前作「童話之約」或破解其彩蛋，可多和小學同學聊聊LINE來取得線索。";
}

function AppChrome({ variant, onOpenHints, onOpenMoreGames }: AppChromeProps) {
  return (
    <>
      <div className="brand-lockup" aria-label="The Dream of Forgotten Memories">
        <img src="/DreamAboutHim/assets/ui/logo.webp" alt="" />
        <span>The Dream of<br />Forgotten Memories</span>
      </div>
      {variant === "menu" && (
        <aside className="side-actions" aria-label="側邊選單">
          <button type="button" onClick={onOpenHints}>
            <Lightbulb size={22} />
            Hints
          </button>
          <button type="button" onClick={onOpenMoreGames}>
            <Gamepad2 size={22} />
            More Games
          </button>
        </aside>
      )}
    </>
  );
}

function MoreGamesScreen({ onClose }: { onClose: () => void }) {
  type AuthorSection = "works" | "about" | "contact" | "eggs";
  const works = [
    {
      year: "2023",
      title: "童話之約",
      subtitle: "2023 GPA 實境解謎",
      image: `${ASSET_BASE}/works/fairy-tale-promise.jpg`,
      url: "https://popworld.cc/guide/14162/preview",
    },
    {
      year: "2025",
      title: "命懸一線",
      subtitle: "懸窩UZU 雙人劇本殺",
      image: `${ASSET_BASE}/works/close-call.webp`,
      url: "https://www.uzu-app.com/zh-TW/scenario/8404",
    },
  ];
  const [activeSection, setActiveSection] = useState<AuthorSection>("works");
  const [isContactEmailVisible, setIsContactEmailVisible] = useState(false);
  const sections: Array<{ id: AuthorSection; label: string }> = [
    { id: "works", label: "Author Works" },
    { id: "about", label: "About Author" },
    { id: "contact", label: "Contact" },
    { id: "eggs", label: "Easter Eggs" },
  ];

  return (
    <section className="more-games-screen" aria-label="Author pages">
      <AppChrome variant="novel" />
      <nav className="author-tabs" aria-label="Author page navigation">
        {sections.map((section) => (
          <button
            className={activeSection === section.id ? "is-active" : ""}
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            type="button"
          >
            {section.label}
          </button>
        ))}
      </nav>

      {activeSection === "works" && (
        <>
          <div className="more-games-heading">
            <h1>Classam&apos;s Works</h1>
            <p>Author Works</p>
            <span aria-hidden="true">✦</span>
          </div>
          <div className="works-list">
            {works.map((work) => (
              <a className="work-banner" href={work.url} key={work.title} rel="noreferrer" target="_blank">
                <span className="work-image-frame">
                  <img src={work.image} alt={`${work.title}作品首頁圖`} />
                </span>
                <span className="work-copy">
                  <strong>{work.title}</strong>
                  <small>{work.subtitle}</small>
                  <em>{work.year}</em>
                </span>
              </a>
            ))}
          </div>
        </>
      )}

      {activeSection === "about" && (
        <AuthorInfoPage eyebrow="About Author" title="About Classam" avatar={`${ASSET_BASE}/ui/author-avatar.webp`}>
          <p>克拉珊（Classam）是一位喜歡故事、謎題與互動體驗的創作者。</p>
          <p>作品注重謎題與劇情、情感及意象的融合，希望讓玩家在解開謎題的同時，也能帶走一段屬於自己的故事。</p>
        </AuthorInfoPage>
      )}

      {activeSection === "contact" && (
        <AuthorInfoPage eyebrow="Contact" title="Contact the Author" className="contact-author-page">
          <button
            className="contact-plane-button"
            type="button"
            onClick={() => {
              setIsContactEmailVisible(true);
              window.location.href = "mailto:bluebellfive@outlook.com";
            }}
          >
            <span className="paper-plane-animation" aria-hidden="true">
              <span className="paper-plane" />
              <i />
              <i />
              <i />
            </span>
            <span className="contact-plane-hint">
              {isContactEmailVisible ? "bluebellfive@outlook.com" : "點擊紙飛機寄出你的訊息"}
            </span>
          </button>
        </AuthorInfoPage>
      )}

      {activeSection === "eggs" && (
        <AuthorInfoPage eyebrow="Easter Eggs" title="Hidden Secrets" className="easter-eggs-page">
          <p>「童話之約」的彩蛋需要好好觀察AR裡的足跡，再看看實體地圖裡還沒被用上的地方。而且別忘了和小學同學們用LINE保持聯繫永遠都很重要喔！</p>
          <div className="secret-magnifier" aria-hidden="true" />
        </AuthorInfoPage>
      )}
      <button className="more-games-close" type="button" onClick={onClose}>back</button>
    </section>
  );
}

function AuthorInfoPage({
  avatar,
  children,
  className = "",
  eyebrow,
  title,
}: {
  avatar?: string;
  children: React.ReactNode;
  className?: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className={`author-info-page ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className={`author-info-body ${avatar ? "has-avatar" : ""}`}>
        {avatar && <img className="author-avatar" src={avatar} alt="克拉珊（Classam）" />}
        <div>{children}</div>
      </div>
    </section>
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
