import { Node, Edge } from '@xyflow/react';
import { OnboardingFlowData } from '@/types/onboarding-flow';

interface LayoutConfig {
  centerRadius: number;
  categoryRadius: number;
  entityRadius: number;
  entitySpacing: number;
}

const defaultConfig: LayoutConfig = {
  centerRadius: 0,
  categoryRadius: 250,
  entityRadius: 450,
  entitySpacing: 120,
};

export function generateFlowerLayout(data: OnboardingFlowData, config: LayoutConfig = defaultConfig): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Employee node at center
  nodes.push({
    id: 'employee',
    type: 'employee',
    position: { x: 0, y: 0 },
    data: {
      name: data.employee.name,
      role: data.employee.role,
      department: data.employee.department,
      startDate: data.employee.startDate,
    },
  });

  // Category positions (cardinal directions)
  const categoryPositions = {
    people: { x: config.categoryRadius, y: 0 }, // right
    access: { x: 0, y: -config.categoryRadius }, // top
    training: { x: -config.categoryRadius, y: 0 }, // left
    processes: { x: 0, y: config.categoryRadius }, // bottom
  };

  // Add category nodes
  const categories = [
    { id: 'people-category', type: 'people', label: 'People', count: data.people.length },
    { id: 'access-category', type: 'access', label: 'Access', count: data.access.length },
    { id: 'training-category', type: 'training', label: 'Training', count: data.training.length },
    { id: 'processes-category', type: 'processes', label: 'Processes', count: data.processes.length },
  ];

  categories.forEach((category) => {
    const position = categoryPositions[category.type];
    nodes.push({
      id: category.id,
      type: 'category',
      position,
      data: category,
    });

    // Connect employee to category
    edges.push({
      id: `employee-to-${category.id}`,
      source: 'employee',
      target: category.id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#63264B20', strokeWidth: 2 },
    });
  });

  // Add people nodes
  data.people.forEach((person, index) => {
    const angle = (index * 30 - 45) * (Math.PI / 180); // Spread from -45 to +45 degrees
    const x = config.entityRadius + Math.cos(angle) * config.entitySpacing;
    const y = Math.sin(angle) * config.entitySpacing;

    nodes.push({
      id: `person-${person.id}`,
      type: 'person',
      position: { x, y },
      data: person,
    });

    edges.push({
      id: `people-category-to-person-${person.id}`,
      source: 'people-category',
      target: `person-${person.id}`,
      type: 'smoothstep',
      style: { 
        stroke: person.connectionType === 'direct' ? '#EF8096' : '#63264B40',
        strokeWidth: person.connectionType === 'direct' ? 2 : 1,
      },
    });
  });

  // Add access nodes
  data.access.forEach((access, index) => {
    const angle = (90 - index * 30 - 15) * (Math.PI / 180); // Spread around top
    const x = Math.cos(angle) * config.entityRadius;
    const y = -config.categoryRadius + Math.sin(angle) * config.entitySpacing - 150;

    nodes.push({
      id: `access-${access.id}`,
      type: 'access',
      position: { x, y },
      data: access,
    });

    edges.push({
      id: `access-category-to-access-${access.id}`,
      source: 'access-category',
      target: `access-${access.id}`,
      type: 'smoothstep',
      style: { 
        stroke: access.status === 'completed' ? '#00A672' : '#BC9462',
        strokeWidth: 1.5,
      },
    });
  });

  // Add training nodes
  data.training.forEach((training, index) => {
    const angle = (180 - index * 30 - 15) * (Math.PI / 180); // Spread around left
    const x = -config.entityRadius + Math.cos(angle) * config.entitySpacing;
    const y = Math.sin(angle) * config.entitySpacing;

    nodes.push({
      id: `training-${training.id}`,
      type: 'training',
      position: { x, y },
      data: training,
    });

    edges.push({
      id: `training-category-to-training-${training.id}`,
      source: 'training-category',
      target: `training-${training.id}`,
      type: 'smoothstep',
      style: { stroke: '#65CEA2', strokeWidth: 1.5 },
    });
  });

  // Add process nodes
  data.processes.forEach((process, index) => {
    const angle = (270 - index * 30 - 15) * (Math.PI / 180); // Spread around bottom
    const x = Math.cos(angle) * config.entitySpacing;
    const y = config.categoryRadius + Math.sin(angle) * config.entitySpacing + 150;

    nodes.push({
      id: `process-${process.id}`,
      type: 'process',
      position: { x, y },
      data: process,
    });

    edges.push({
      id: `processes-category-to-process-${process.id}`,
      source: 'processes-category',
      target: `process-${process.id}`,
      type: 'smoothstep',
      style: { stroke: '#7FAAC8', strokeWidth: 1.5 },
    });
  });

  return { nodes, edges };
}