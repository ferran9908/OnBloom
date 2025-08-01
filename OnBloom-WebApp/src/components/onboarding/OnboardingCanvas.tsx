import React, { useMemo, useCallback, useState } from "react";
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState } from "@xyflow/react";
import { EmployeeNode, CategoryNode, EntityNode } from "./nodes";
import { OnboardingData, OnboardingNode, OnboardingEdge, CATEGORY_CONFIG, OnboardingEntityType } from "@/types/onboarding";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  employee: EmployeeNode,
  category: CategoryNode,
  entity: EntityNode,
};

interface OnboardingCanvasProps {
  data: OnboardingData;
}

export function OnboardingCanvas({ data }: OnboardingCanvasProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<OnboardingEntityType>>(new Set());

  const toggleCategory = useCallback((categoryType: OnboardingEntityType) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryType)) {
        newSet.delete(categoryType);
      } else {
        newSet.add(categoryType);
      }
      return newSet;
    });
  }, []);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: OnboardingNode[] = [];
    const edges: OnboardingEdge[] = [];

    // Employee node at center
    nodes.push({
      id: "employee",
      type: "employee",
      position: { x: 0, y: 0 },
      data: {
        label: data.employee.name,
        type: "employee",
        role: data.employee.role,
        department: data.employee.department,
      },
    });

    // Category nodes
    Object.entries(CATEGORY_CONFIG).forEach(([type, config]) => {
      const entityType = type as OnboardingEntityType;
      const count = data[entityType].length;
      
      nodes.push({
        id: `category-${type}`,
        type: "category",
        position: config.position,
        data: {
          label: type,
          type: "category",
          entityType,
          count,
          isExpanded: expandedCategories.has(entityType),
        },
      });

      // Edge from employee to category
      edges.push({
        id: `employee-to-${type}`,
        source: "employee",
        target: `category-${type}`,
        sourceHandle: type === "people" ? "right" : 
                     type === "access" ? "top" : 
                     type === "training" ? "left" : "bottom",
        animated: true,
        style: { stroke: config.color.replace('text-', '#'), strokeWidth: 2 },
      });

      // Add entity nodes if category is expanded
      if (expandedCategories.has(entityType)) {
        const entities = data[entityType];
        const angleStep = Math.PI / (entities.length + 1);
        const radius = 200;
        
        entities.forEach((entity, index) => {
          let angle, x, y;
          
          // Calculate position based on category type
          switch (type) {
            case "people":
              angle = -Math.PI/2 + angleStep * (index + 1);
              x = config.position.x + radius * Math.cos(angle);
              y = config.position.y + radius * Math.sin(angle);
              break;
            case "access":
              angle = Math.PI + angleStep * (index + 1);
              x = config.position.x + radius * Math.cos(angle);
              y = config.position.y + radius * Math.sin(angle);
              break;
            case "training":
              angle = Math.PI/2 + angleStep * (index + 1);
              x = config.position.x + radius * Math.cos(angle);
              y = config.position.y + radius * Math.sin(angle);
              break;
            case "processes":
              angle = angleStep * (index + 1);
              x = config.position.x + radius * Math.cos(angle);
              y = config.position.y + radius * Math.sin(angle);
              break;
          }

          const nodeId = `${type}-${entity.id}`;
          
          nodes.push({
            id: nodeId,
            type: "entity",
            position: { x: x || 0, y: y || 0 },
            data: {
              label: entity.name || entity.title,
              type: "entity",
              entityType,
              entity,
            },
          });

          // Edge from category to entity
          edges.push({
            id: `${type}-to-${nodeId}`,
            source: `category-${type}`,
            target: nodeId,
            animated: false,
            style: { 
              stroke: config.color.replace('text-', '#'), 
              strokeWidth: 1,
              opacity: 0.5 
            },
          });
        });
      }
    });

    return { nodes, edges };
  }, [data, expandedCategories]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === "category" && node.data.entityType) {
      toggleCategory(node.data.entityType);
    }
  }, [toggleCategory]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#63264B" gap={16} />
      <Controls />
    </ReactFlow>
  );
}