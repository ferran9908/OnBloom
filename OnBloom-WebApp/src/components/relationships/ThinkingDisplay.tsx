"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Loader2,
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingDisplayProps {
  thinking: string;
  isLoading?: boolean;
  className?: string;
  defaultExpanded?: boolean;
}

export function ThinkingDisplay({ 
  thinking, 
  isLoading = false,
  className,
  defaultExpanded = false 
}: ThinkingDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Split thinking into paragraphs for better display
  const thinkingParagraphs = thinking.split('\n').filter(p => p.trim());
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      className
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-onbloom-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-onbloom-primary" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-onbloom-primary">
              AI Thinking Process
            </h3>
            <p className="text-xs text-onbloom-dark-purple">
              {isLoading ? "Analyzing relationships..." : "View AI reasoning"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-onbloom-primary" />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-onbloom-dark-purple" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-zinc-800"
          >
            <div className="p-4 max-h-96 overflow-y-auto">
              {thinking ? (
                <div className="space-y-2">
                  {thinkingParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-sm text-onbloom-dark-purple leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-onbloom-dark-purple">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-8 w-8 text-onbloom-primary" />
                      </motion.div>
                      <p className="text-sm">Processing employee data...</p>
                    </div>
                  ) : (
                    <p className="text-sm italic">No thinking process available</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}