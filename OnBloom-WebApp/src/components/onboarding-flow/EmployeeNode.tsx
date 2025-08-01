import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';

interface EmployeeNodeData {
  name: string;
  role: string;
  department: string;
  startDate: string;
}

export function EmployeeNode({ data }: { data: EmployeeNodeData }) {
  return (
    <div className="relative">
      <Handle type="source" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Left} className="w-3 h-3" />
      
      <div style={{ background: 'linear-gradient(to bottom right, #63264B, #EF8096)' }} className="p-8 rounded-2xl shadow-2xl text-white min-w-[320px] border-4 border-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-bold text-2xl font-title mb-1">{data.name || 'New Employee'}</h3>
          <p className="text-lg">{data.role || 'Role'}</p>
          <p className="text-sm">{data.department || 'Department'}</p>
          <div className="mt-3 pt-3 border-t border-white/30">
            <p className="text-sm">Start Date</p>
            <p className="text-base font-semibold">{data.startDate || 'TBD'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}