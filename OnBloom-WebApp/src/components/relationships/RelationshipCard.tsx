"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Building2,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Users,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  EmployeeRelationship, 
  ConnectionType, 
  getConnectionTypeLabel,
  getConnectionTypeColor 
} from "@/service/relationship-analysis";

interface RelationshipCardProps {
  relationship: EmployeeRelationship;
  index: number;
  onConnect?: () => void;
}

export function RelationshipCard({ 
  relationship, 
  index,
  onConnect 
}: RelationshipCardProps) {
  const generateAvatarUrl = (name: string) => {
    const seed = name.toLowerCase().replace(/\s+/g, "");
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=6366f1&textColor=ffffff&radius=50`;
  };

  const getConnectionIcon = (type: ConnectionType) => {
    const icons: Record<ConnectionType, React.ReactNode> = {
      same_team: <Users className="h-3 w-3" />,
      same_department: <Building2 className="h-3 w-3" />,
      same_location: <MapPin className="h-3 w-3" />,
      same_role: <User className="h-3 w-3" />,
      cultural_heritage: <Globe className="h-3 w-3" />,
      shared_interests: <Sparkles className="h-3 w-3" />,
      language_match: <Globe className="h-3 w-3" />,
      potential_mentor: <Users className="h-3 w-3" />,
      recent_hire: <Calendar className="h-3 w-3" />,
      cross_functional: <Building2 className="h-3 w-3" />,
      timezone_overlap: <Globe className="h-3 w-3" />,
    };
    return icons[type] || <Sparkles className="h-3 w-3" />;
  };

  const relevanceColor = relationship.relevanceScore >= 80 
    ? "text-green-600 bg-green-50" 
    : relationship.relevanceScore >= 60 
    ? "text-blue-600 bg-blue-50"
    : "text-gray-600 bg-gray-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-onbloom-primary/20">
        <div className="space-y-4">
          {/* Header with Avatar and Score */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-onbloom-primary/10">
                <AvatarImage
                  src={generateAvatarUrl(relationship.employeeName)}
                  alt={relationship.employeeName}
                />
                <AvatarFallback className="bg-onbloom-primary text-white">
                  {relationship.employeeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-onbloom-primary">
                  {relationship.employeeName}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {relationship.connectionTypes.slice(0, 3).map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className={cn(
                        "text-xs flex items-center gap-1",
                        getConnectionTypeColor(type),
                        "text-white"
                      )}
                    >
                      {getConnectionIcon(type)}
                      {getConnectionTypeLabel(type)}
                    </Badge>
                  ))}
                  {relationship.connectionTypes.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{relationship.connectionTypes.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className={cn("text-sm font-medium px-3 py-1 rounded-full", relevanceColor)}>
              {relationship.relevanceScore}% match
            </div>
          </div>

          {/* Reasoning */}
          <p className="text-sm text-onbloom-dark-purple">
            {relationship.reasoning}
          </p>

          {/* Actionable Insights */}
          {relationship.actionableInsights.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-onbloom-dark-purple">
                Key connections:
              </p>
              <ul className="text-xs text-onbloom-dark-purple space-y-1">
                {relationship.actionableInsights.slice(0, 2).map((insight, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-onbloom-accent-pink mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <Button
            size="sm"
            variant="outline"
            className="w-full hover:bg-onbloom-primary hover:text-white transition-colors"
            onClick={onConnect}
          >
            Schedule Introduction
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}