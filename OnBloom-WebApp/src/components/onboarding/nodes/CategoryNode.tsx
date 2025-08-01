import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Users, Key, PlayCircle, BookOpen, LucideIcon } from "lucide-react";
import { OnboardingEntityType, CATEGORY_CONFIG } from "@/types/onboarding";
import { cn } from "@/lib/utils";

const iconMap: Record<OnboardingEntityType, LucideIcon> = {
  people: Users,
  access: Key,
  training: PlayCircle,
  processes: BookOpen,
};

interface CategoryNodeProps {
  data: {
    label: string;
    entityType: OnboardingEntityType;
    count?: number;
    isExpanded?: boolean;
  };
}

export function CategoryNode({ data }: CategoryNodeProps) {
  const config = CATEGORY_CONFIG[data.entityType];
  const Icon = iconMap[data.entityType];
  
  const handlePosition = {
    people: Position.Left,
    access: Position.Bottom,
    training: Position.Right,
    processes: Position.Top,
  };

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={handlePosition[data.entityType]} 
        className="opacity-0"
      />
      <Handle 
        type="source" 
        position={handlePosition[data.entityType] === Position.Left ? Position.Right : 
                 handlePosition[data.entityType] === Position.Right ? Position.Left :
                 handlePosition[data.entityType] === Position.Top ? Position.Bottom :
                 Position.Top} 
        className="opacity-0"
      />
      
      <div className={cn(
        "bg-white rounded-2xl p-6 shadow-md border-2 transition-all duration-300 cursor-pointer",
        "hover:shadow-lg hover:scale-105",
        data.isExpanded ? "border-onbloom-primary" : "border-gray-200"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            config.bgColor
          )}>
            <Icon className={cn("w-7 h-7", config.color)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-onbloom-primary capitalize">
              {data.label}
            </h3>
            {data.count !== undefined && (
              <p className="text-sm text-onbloom-dark-purple">
                {data.count} {data.count === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}