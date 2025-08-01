import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Link } from 'lucide-react';
import { OnboardingPerson } from '@/types/onboarding-flow';
import { FloatingContactCard } from './FloatingContactCard';

export function PersonNode({ data }: { data: OnboardingPerson }) {
  const isDirect = data.connectionType === 'direct';
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    setIsHovered(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  return (
    <>
      <div className="relative">
        <Handle type="target" position={Position.Left} />
        
        <div 
          className={`bg-white border-2 ${isDirect ? 'border-onbloom-accent-pink' : 'border-onbloom-primary/30'} p-4 rounded-lg shadow-md min-w-[240px] max-w-[280px] cursor-pointer transition-transform hover:scale-105`}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 ${isDirect ? 'bg-onbloom-accent-pink/10' : 'bg-onbloom-primary/10'} rounded-full flex items-center justify-center flex-shrink-0`}>
            <User className={`w-6 h-6 ${isDirect ? 'text-onbloom-accent-pink' : 'text-onbloom-primary'}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-onbloom-primary">{data.name}</h4>
            <p className="text-sm text-onbloom-dark-purple">{data.role}</p>
            <p className="text-xs text-onbloom-dark-purple/70">{data.department}</p>
            {data.connectionType === 'indirect' && data.reasoning && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-onbloom-primary/70">
                  <Link className="w-3 h-3" />
                  <span className="font-medium">Connection:</span>
                </div>
                <p className="text-xs text-onbloom-dark-purple/60 mt-1">{data.reasoning}</p>
              </div>
            )}
          </div>
        </div>
        {isDirect && (
          <div className="absolute -top-2 -right-2 bg-onbloom-accent-pink text-white text-xs px-2 py-1 rounded-full font-medium">
            Direct Report
          </div>
        )}
      </div>
    </div>
    
    <FloatingContactCard
      person={{
        name: data.name,
        role: data.role,
        department: data.department,
        email: data.email,
        phone: data.phone,
        location: data.location,
        startDate: data.startDate,
        profileImage: data.profileImage
      }}
      x={mousePosition.x}
      y={mousePosition.y}
      isVisible={isHovered}
    />
    </>
  );
}