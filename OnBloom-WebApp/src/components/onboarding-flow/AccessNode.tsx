import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { OnboardingAccess } from '@/types/onboarding-flow';

const priorityColors = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-onbloom-warning bg-yellow-50 border-yellow-200',
  low: 'text-onbloom-accent-blue bg-blue-50 border-blue-200',
};

export function AccessNode({ data }: { data: OnboardingAccess }) {
  const isCompleted = data.status === 'completed';
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Bottom} />
      
      <div className={`bg-white border-2 ${isCompleted ? 'border-onbloom-success' : 'border-onbloom-warning/30'} p-4 rounded-lg shadow-md min-w-[240px] max-w-[280px]`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 ${isCompleted ? 'bg-onbloom-success/10' : 'bg-onbloom-warning/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {isCompleted ? (
              <Check className="w-5 h-5 text-onbloom-success" />
            ) : (
              <Clock className="w-5 h-5 text-onbloom-warning" />
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${isCompleted ? 'text-onbloom-dark-purple/50 line-through' : 'text-onbloom-primary'}`}>
              {data.name}
            </h4>
            <p className="text-xs text-onbloom-dark-purple/70 mt-1">{data.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[data.priority]}`}>
                {data.priority} priority
              </span>
            </div>
          </div>
        </div>
        {isCompleted && (
          <div className="absolute -top-2 -right-2 bg-onbloom-success text-white w-6 h-6 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}