"use client";

import React from "react";
import { motion } from "framer-motion";
import { RelationshipCard } from "./RelationshipCard";
import { EmployeeRelationship } from "@/service/relationship-analysis";
import { Card } from "@/components/ui/card";
import { Users, Sparkles, TrendingUp } from "lucide-react";

interface RelationshipGridProps {
  relationships?: EmployeeRelationship[];
  insights?: string[];
  recommendations?: string[];
  isLoading?: boolean;
}

export function RelationshipGrid({
  relationships = [],
  insights = [],
  recommendations = [],
  isLoading = false,
}: RelationshipGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-onbloom-primary/20 border-t-onbloom-primary rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-onbloom-dark-purple font-medium">
            Analyzing relationships...
          </p>
        </motion.div>
      </div>
    );
  }

  const topConnections = relationships.slice(0, 6);
  const additionalConnections = relationships.slice(6);

  return (
    <div className="space-y-8">
      {/* Key Insights Section */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-br from-onbloom-primary/5 to-onbloom-accent-pink/5 border-onbloom-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-onbloom-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-onbloom-primary" />
              </div>
              <h3 className="text-lg font-semibold text-onbloom-primary">
                Key Insights
              </h3>
            </div>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-onbloom-dark-purple"
                >
                  <span className="text-onbloom-accent-pink mt-0.5">•</span>
                  <span>{insight}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Top Connections */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-onbloom-accent-blue/10 rounded-lg">
              <Users className="h-5 w-5 text-onbloom-accent-blue" />
            </div>
            <h2 className="text-2xl font-semibold text-onbloom-primary">
              Recommended Connections
            </h2>
          </div>
          <p className="text-onbloom-dark-purple">
            People who can help make the onboarding experience successful
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topConnections.map((relationship, index) => (
            <RelationshipCard
              key={relationship.employeeId}
              relationship={relationship}
              index={index}
              onConnect={() => {
                // Handle connection action
                console.log(`Connect with ${relationship.employeeName}`);
              }}
            />
          ))}
        </div>
      </div>

      {/* Additional Connections */}
      {additionalConnections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center gap-2 text-onbloom-primary hover:text-onbloom-primary/80 transition-colors">
                <span className="font-medium">
                  View {additionalConnections.length} more connections
                </span>
                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {additionalConnections.map((relationship, index) => (
                <RelationshipCard
                  key={relationship.employeeId}
                  relationship={relationship}
                  index={index + 6}
                  onConnect={() => {
                    console.log(`Connect with ${relationship.employeeName}`);
                  }}
                />
              ))}
            </div>
          </details>
        </motion.div>
      )}

      {/* Onboarding Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-onbloom-accent-green/5 to-onbloom-accent-blue/5 border-onbloom-accent-green/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-onbloom-accent-green/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-onbloom-accent-green" />
              </div>
              <h3 className="text-lg font-semibold text-onbloom-primary">
                Onboarding Recommendations
              </h3>
            </div>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-onbloom-dark-purple"
                >
                  <span className="text-onbloom-accent-green mt-0.5">✓</span>
                  <span>{recommendation}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// Add missing import
import { ArrowRight } from "lucide-react";