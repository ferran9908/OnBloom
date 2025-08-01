import React from "react";
import { Handle, Position } from "@xyflow/react";
import { 
  User, 
  FileText, 
  Video, 
  CheckSquare, 
  ExternalLink,
  Clock,
  Star
} from "lucide-react";
import { OnboardingEntityType, CATEGORY_CONFIG } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface EntityNodeProps {
  data: {
    label: string;
    entityType: OnboardingEntityType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entity: any;
  };
}

export function EntityNode({ data }: EntityNodeProps) {
  const config = CATEGORY_CONFIG[data.entityType];
  
  const handlePosition = {
    people: Position.Left,
    access: Position.Bottom,
    training: Position.Right,
    processes: Position.Top,
  };

  const renderEntityContent = () => {
    switch (data.entityType) {
      case "people":
        return (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-onbloom-accent-pink/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-onbloom-accent-pink" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-onbloom-primary truncate">
                {data.entity.name}
              </h4>
              <p className="text-xs text-onbloom-dark-purple truncate">
                {data.entity.role}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-onbloom-accent-pink/10 text-onbloom-accent-pink px-2 py-0.5 rounded-full">
                  {data.entity.connectionType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-onbloom-warning" />
                  <span className="text-xs text-onbloom-dark-purple">
                    {data.entity.relevanceScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "processes":
        return (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-onbloom-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-onbloom-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-onbloom-primary truncate">
                {data.entity.title}
              </h4>
              <p className="text-xs text-onbloom-dark-purple line-clamp-2">
                {data.entity.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-onbloom-warning/10 text-onbloom-warning px-2 py-0.5 rounded">
                  {data.entity.type}
                </span>
                {data.entity.url && (
                  <ExternalLink className="w-3 h-3 text-onbloom-accent-blue" />
                )}
              </div>
            </div>
          </div>
        );

      case "training":
        return (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-onbloom-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Video className="w-5 h-5 text-onbloom-accent-green" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-onbloom-primary truncate">
                {data.entity.title}
              </h4>
              <p className="text-xs text-onbloom-dark-purple line-clamp-2">
                {data.entity.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {data.entity.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-onbloom-dark-purple" />
                    <span className="text-xs text-onbloom-dark-purple">
                      {data.entity.duration}
                    </span>
                  </div>
                )}
                <span className="text-xs bg-onbloom-accent-green/10 text-onbloom-accent-green px-2 py-0.5 rounded">
                  {data.entity.source}
                </span>
              </div>
            </div>
          </div>
        );

      case "access":
        return (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-onbloom-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckSquare className={cn(
                "w-5 h-5",
                data.entity.completed ? "text-onbloom-success" : "text-onbloom-accent-blue"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-semibold text-sm truncate",
                data.entity.completed ? "text-onbloom-dark-purple line-through" : "text-onbloom-primary"
              )}>
                {data.entity.name}
              </h4>
              <p className="text-xs text-onbloom-dark-purple truncate">
                {data.entity.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded",
                  data.entity.priority === "critical" ? "bg-red-100 text-red-700" :
                  data.entity.priority === "high" ? "bg-orange-100 text-orange-700" :
                  data.entity.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                )}>
                  {data.entity.priority}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={handlePosition[data.entityType]} 
        className="opacity-0"
      />
      
      <div className={cn(
        "bg-white rounded-xl p-4 shadow-sm border transition-all duration-300",
        "hover:shadow-md hover:border-onbloom-primary/30",
        "min-w-[280px] max-w-[320px]"
      )}>
        {renderEntityContent()}
      </div>
    </div>
  );
}