import { Node, Edge } from "@xyflow/react";

export type OnboardingEntityType = "people" | "processes" | "training" | "access";

export interface PersonEntity {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  connectionType: string;
  relevanceScore: number;
  reasoning: string;
  isDirect: boolean;
}

export interface ProcessEntity {
  id: string;
  title: string;
  type: "article" | "wiki" | "documentation" | "policy";
  source: string;
  url?: string;
  description: string;
  relevanceScore: number;
}

export interface TrainingEntity {
  id: string;
  title: string;
  type: "video" | "course" | "tutorial";
  source: "youtube" | "internal" | "external";
  url: string;
  duration?: string;
  thumbnail?: string;
  description: string;
  relevanceScore: number;
}

export interface AccessEntity {
  id: string;
  name: string;
  type: "software" | "system" | "platform" | "tool";
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  completed: boolean;
  instructions?: string;
}

export interface OnboardingData {
  employee: {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    startDate: string;
  };
  people: PersonEntity[];
  processes: ProcessEntity[];
  training: TrainingEntity[];
  access: AccessEntity[];
  insights: string[];
  recommendations: string[];
}

export interface OnboardingNode extends Node {
  data: {
    label: string;
    type: "employee" | "category" | "entity";
    entityType?: OnboardingEntityType;
    entity?: PersonEntity | ProcessEntity | TrainingEntity | AccessEntity;
    isExpanded?: boolean;
  };
}

export interface OnboardingEdge extends Edge {
  data?: {
    animated?: boolean;
    entityType?: OnboardingEntityType;
  };
}

export interface CategoryNodePosition {
  type: OnboardingEntityType;
  position: { x: number; y: number };
  icon: string;
  color: string;
  bgColor: string;
}

export const CATEGORY_CONFIG: Record<OnboardingEntityType, CategoryNodePosition> = {
  people: {
    type: "people",
    position: { x: 400, y: 0 },
    icon: "Users",
    color: "text-onbloom-accent-pink",
    bgColor: "bg-onbloom-accent-pink/10"
  },
  access: {
    type: "access",
    position: { x: 0, y: -300 },
    icon: "Key",
    color: "text-onbloom-accent-blue",
    bgColor: "bg-onbloom-accent-blue/10"
  },
  training: {
    type: "training",
    position: { x: -400, y: 0 },
    icon: "PlayCircle",
    color: "text-onbloom-accent-green",
    bgColor: "bg-onbloom-accent-green/10"
  },
  processes: {
    type: "processes",
    position: { x: 0, y: 300 },
    icon: "BookOpen",
    color: "text-onbloom-warning",
    bgColor: "bg-onbloom-warning/10"
  }
};