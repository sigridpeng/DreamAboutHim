export type GameStage = "password" | "diary" | "visualNovel" | "ending";

export type FlagMap = Record<string, boolean>;

export interface DiaryPage {
  id: string;
  title: string;
  body: string;
  isFinal?: boolean;
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
  sprite?: string;
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
  password: string;
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
