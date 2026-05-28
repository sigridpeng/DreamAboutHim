export type GameStage = "cover" | "diary" | "visualNovel" | "ending";

export type FlagMap = Record<string, boolean>;

export interface DiaryPage {
  id: string;
  title: string;
  body: string;
  entryImage?: string;
  entryLabel?: string;
  isEntryPage?: boolean;
  isFinal?: boolean;
}

export type CharacterPosition = "left" | "center" | "right";

export interface SceneCharacter {
  id: string;
  name: string;
  position: CharacterPosition;
  expression: "neutral" | "soft" | "sad" | "surprised";
  active?: boolean;
}

export interface Choice {
  label: string;
  next: string;
  setFlags?: FlagMap;
}

export interface KeywordRule {
  keyword: string;
  next: string;
  setFlags?: FlagMap;
}

export interface VNNode {
  id: string;
  background: string;
  characters?: SceneCharacter[];
  speaker?: string;
  text: string;
  next?: string;
  choices?: Choice[];
  keywordRules?: KeywordRule[];
  setFlags?: FlagMap;
  ending?: string;
}

export interface Ending {
  id: string;
  title: string;
  background: string;
  text: string;
  credits: string[];
  audio?: string;
  video?: string;
}

export interface StoryData {
  diaryPages: DiaryPage[];
  startNode: string;
  nodes: VNNode[];
  endings: Ending[];
}

export interface SaveData {
  stage: "visualNovel";
  nodeId: string;
  flags: FlagMap;
  unlockedEndings: string[];
  timestamp: number;
}
