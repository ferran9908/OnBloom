import React from "react";
import { Handle, Position } from "@xyflow/react";
import { User } from "lucide-react";

interface EmployeeNodeProps {
  data: {
    label: string;
    role?: string;
    department?: string;
  };
}

export function EmployeeNode({ data }: EmployeeNodeProps) {
  return (
    <div className="relative">
      <Handle type="source" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
      
      <div className="bg-white rounded-full p-8 shadow-lg border-4 border-onbloom-primary/20 hover:border-onbloom-primary/40 transition-all duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-onbloom-primary to-onbloom-accent-pink rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-onbloom-primary font-title">
            {data.label}
          </h3>
          {data.role && (
            <p className="text-sm text-onbloom-dark-purple mt-1">{data.role}</p>
          )}
          {data.department && (
            <p className="text-xs text-onbloom-dark-purple/70">{data.department}</p>
          )}
        </div>
      </div>
    </div>
  );
}