import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Clock } from 'lucide-react';
import { OnboardingTraining } from '@/types/onboarding-flow';

export function TrainingNode({ data }: { data: OnboardingTraining }) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Right} />
      
      <div className="bg-white border-2 border-onbloom-accent-green/30 p-4 rounded-lg shadow-md min-w-[280px] max-w-[320px] hover:border-onbloom-accent-green transition-colors cursor-pointer">
        <div className="relative mb-3 bg-gray-100 rounded-lg overflow-hidden h-32">
          {data.thumbnailUrl ? (
            <img 
              src={data.thumbnailUrl} 
              alt={data.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-onbloom-accent-green/20 to-onbloom-accent-green/10">
              <Play className="w-12 h-12 text-onbloom-accent-green" />
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {data.duration}
          </div>
        </div>
        <h4 className="font-semibold text-onbloom-primary line-clamp-2">{data.title}</h4>
        <p className="text-xs text-onbloom-dark-purple/70 mt-1 line-clamp-2">{data.description}</p>
        <div className="mt-2">
          <span className="text-xs bg-onbloom-accent-green/10 text-onbloom-accent-green px-2 py-1 rounded-full">
            {data.source === 'youtube' ? 'YouTube' : 'Internal'}
          </span>
        </div>
      </div>
    </div>
  );
}