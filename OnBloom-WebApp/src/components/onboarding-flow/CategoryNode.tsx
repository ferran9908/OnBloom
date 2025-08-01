import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users, FileText, Video, Key } from 'lucide-react';

interface CategoryNodeData {
  label: string;
  type: 'people' | 'processes' | 'training' | 'access';
  count: number;
}

const categoryConfig = {
  people: {
    icon: Users,
    color: 'from-onbloom-accent-pink to-pink-400',
    handlePosition: Position.Left,
  },
  processes: {
    icon: FileText,
    color: 'from-onbloom-accent-blue to-blue-400',
    handlePosition: Position.Top,
  },
  training: {
    icon: Video,
    color: 'from-onbloom-accent-green to-green-400',
    handlePosition: Position.Right,
  },
  access: {
    icon: Key,
    color: 'from-onbloom-warning to-yellow-500',
    handlePosition: Position.Bottom,
  },
};

export function CategoryNode({ data }: { data: CategoryNodeData }) {
  const config = categoryConfig[data.type];
  const Icon = config.icon;

  return (
    <div className="relative">
      <Handle type="target" position={config.handlePosition} />
      <Handle type="source" position={config.handlePosition} />
      
      <div className={`bg-gradient-to-br ${config.color} p-4 rounded-xl shadow-lg text-white min-w-[200px]`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg font-title">{data.label}</h3>
            <p className="text-sm opacity-80">{data.count} items</p>
          </div>
        </div>
      </div>
    </div>
  );
}