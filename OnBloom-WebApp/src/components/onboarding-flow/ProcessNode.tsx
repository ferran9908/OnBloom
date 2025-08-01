import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Globe, BookOpen } from 'lucide-react';
import { OnboardingProcess } from '@/types/onboarding-flow';

const sourceIcons = {
  notion: BookOpen,
  web: Globe,
  internal: FileText,
};

export function ProcessNode({ data }: { data: OnboardingProcess }) {
  const Icon = sourceIcons[data.source];
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      
      <div className="bg-white border-2 border-onbloom-accent-blue/30 p-4 rounded-lg shadow-md min-w-[260px] max-w-[300px] hover:border-onbloom-accent-blue transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-onbloom-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-onbloom-accent-blue" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-onbloom-primary line-clamp-2">{data.title}</h4>
            <p className="text-xs text-onbloom-dark-purple/70 mt-1 line-clamp-2">{data.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-onbloom-accent-blue/10 text-onbloom-accent-blue px-2 py-1 rounded-full">
                {data.category}
              </span>
              <span className="text-xs text-onbloom-dark-purple/50">
                {data.source}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}