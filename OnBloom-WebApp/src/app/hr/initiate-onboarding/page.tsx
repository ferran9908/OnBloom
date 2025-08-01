"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { generateFlowerLayout } from "@/lib/onboarding-flow-layout";
import { OnboardingFlowData, OnboardingPerson } from "@/types/onboarding-flow";
import { ThinkingDisplay } from "@/components/relationships/ThinkingDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  EmployeeNode,
  CategoryNode,
  PersonNode,
  ProcessNode,
  TrainingNode,
  AccessNode,
} from "@/components/onboarding-flow";

const nodeTypes = {
  employee: EmployeeNode,
  category: CategoryNode,
  person: PersonNode,
  process: ProcessNode,
  training: TrainingNode,
  access: AccessNode,
};

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiThinking, setAiThinking] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");

  const trpc = useTRPC();

  // Fetch employee data
  const { data: employee, isLoading: isLoadingEmployee } = useQuery(
    trpc.employee.getById.queryOptions({
      id: employeeId || "",
    }),
  );

  // Generate onboarding flow when employee data is loaded
  useEffect(() => {
    if (employee && !isGenerating && nodes.length === 0) {
      generateOnboardingFlow();
    }
  }, [employee, isGenerating, nodes.length]);

  const [onboardingData, setOnboardingData] = useState<OnboardingFlowData | null>(null);

  const generateOnboardingFlow = async () => {
    if (!employee) return;

    setIsGenerating(true);
    setIsAnalyzing(true);

    // Start streaming AI reasoning
    fetch("/api/onboarding/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to analyze");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let fullText = "";

        while (true) {
          const { done, value } = await reader!.read();

          if (done) {
            setIsAnalyzing(false);
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setAiThinking(fullText);
        }
      })
      .catch((error) => {
        console.error("Error streaming AI analysis:", error);
        setIsAnalyzing(false);
      });

    // Generate the actual flow data
    try {
      const response = await fetch("/api/onboarding/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee }),
      });

      if (!response.ok) throw new Error("Failed to generate onboarding flow");

      const flowData: OnboardingFlowData = await response.json();
      setOnboardingData(flowData); // Store the flow data
      const { nodes: layoutNodes, edges: layoutEdges } =
        generateFlowerLayout(flowData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNodes(layoutNodes as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEdges(layoutEdges as any);
    } catch (error) {
      console.error("Error generating onboarding flow:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Handle node clicks here - could open modals, navigate to resources, etc.
    console.log("Node clicked:", node);
  }, []);

  if (isLoadingEmployee || isGenerating) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl w-full"
        >
          <div className="mb-8">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 bg-onbloom-primary/20 rounded-full blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-r from-onbloom-primary to-onbloom-accent-pink rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-onbloom-primary mb-2 font-title">
              {isLoadingEmployee
                ? "Loading Employee Data"
                : "Generating Onboarding Flow"}
            </h1>
            <p className="text-onbloom-dark-purple font-secondary">
              {employee
                ? `Preparing onboarding for ${employee.name}`
                : "Setting up the onboarding process..."}
            </p>
          </div>

          {aiThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <ThinkingDisplay
                thinking={aiThinking}
                isLoading={isAnalyzing}
                defaultExpanded={true}
                className="bg-white/80 backdrop-blur-sm border-onbloom-primary/20"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#63264B" gap={16} />
        <Controls />
      </ReactFlow>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 right-6"
      >
        <Button
          size="lg"
          variant="default"
          className="hover:text-white font-extrabold"
          onClick={async () => {
            if (!employee || !onboardingData) {
              console.error("No employee or onboarding data available");
              return;
            }

            try {
              // Fetch full data for each person in onboardingData.people from Notion
              const peopleWithFullData = await Promise.all(
                onboardingData.people.map(async (person) => {
                  try {
                    // Fetch the full employee data for this person
                    const fullPersonData = await trpc.employee.getById.query({ id: person.id });
                    
                    return {
                      // Include all fields from the full employee data
                      id: fullPersonData.id,
                      name: fullPersonData.name,
                      role: fullPersonData.role,
                      department: fullPersonData.department,
                      email: fullPersonData.email,
                      employeeId: fullPersonData.employeeId,
                      location: fullPersonData.location,
                      timeZone: fullPersonData.timeZone,
                      startDate: fullPersonData.startDate,
                      ageRange: fullPersonData.ageRange,
                      genderIdentity: fullPersonData.genderIdentity,
                      culturalHeritage: fullPersonData.culturalHeritage,
                      tags: fullPersonData.tags || [],
                      connectionType: person.connectionType,
                      // Include relevance reasoning from the generated data
                      relevanceToEmployee: person.reasoning || 
                        (person.connectionType === 'direct' 
                          ? `Direct team member: ${person.name} works directly with ${employee.name} as ${person.role} in ${person.department}` 
                          : `Indirect connection: ${person.name} (${person.role} in ${person.department}) ${person.reasoning || 'will provide cross-functional support'}`),
                    };
                  } catch (error) {
                    console.error(`Failed to fetch data for person ${person.id}:`, error);
                    // Return the original person data if fetch fails
                    return {
                      ...person,
                      relevanceToEmployee: person.reasoning || 
                        (person.connectionType === 'direct' 
                          ? `Direct team member: ${person.name} works directly with ${employee.name} as ${person.role} in ${person.department}` 
                          : `Indirect connection: ${person.name} (${person.role} in ${person.department}) ${person.reasoning || 'will provide cross-functional support'}`),
                    };
                  }
                })
              );

              // Standardized payload for external service
              const standardizedPayload = {
                employee: {
                  // Include all available employee fields from Notion
                  id: employee.id,
                  name: employee.name,
                  email: employee.email,
                  employeeId: employee.employeeId,
                  department: employee.department,
                  role: employee.role,
                  startDate: employee.startDate,
                  location: employee.location,
                  timeZone: employee.timeZone,
                  ageRange: employee.ageRange,
                  genderIdentity: employee.genderIdentity,
                  culturalHeritage: employee.culturalHeritage,
                  tags: employee.tags || [],
                },
                people: peopleWithFullData,
                // Use AI-generated data for processes, training, and access
                processes: onboardingData.processes.map(process => ({
                  id: process.id,
                  title: process.title,
                  description: process.description,
                  source: process.source,
                  url: process.url,
                  category: process.category,
                })),
                training: onboardingData.training.map(training => ({
                  id: training.id,
                  title: training.title,
                  description: training.description,
                  videoUrl: training.videoUrl,
                  thumbnailUrl: training.thumbnailUrl || null,
                  duration: training.duration,
                  source: training.source,
                })),
                access: onboardingData.access.map(access => ({
                  id: access.id,
                  name: access.name,
                  description: access.description,
                  status: access.status,
                  priority: access.priority,
                })),
                metadata: {
                  generatedAt: new Date().toISOString(),
                  version: "1.0",
                  dataSource: "notion",
                }
              };

              const onboardingServiceUrl = process.env.NEXT_PUBLIC_ONBOARDING_SERVICE_URL || "http://localhost:3001";
              const response = await fetch(`${onboardingServiceUrl}/introductions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(standardizedPayload),
              });

              if (!response.ok) {
                throw new Error(`Failed to send onboarding data: ${response.statusText}`);
              }

              console.log("Onboarding initiated successfully with Notion data");
              toast.success("Data sent to Slack");
            } catch (error) {
              console.error("Error initiating onboarding:", error);
              toast.error("Failed to send onboarding data");
            }
          }}
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Onboard Employee
        </Button>
      </motion.div>
    </div>
  );
}

export default function InitiateOnboardingPage() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
