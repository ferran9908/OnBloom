import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const OnboardingPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  department: z.string(),
  email: z.string(),
  connectionType: z.enum(['direct', 'indirect']),
  reasoning: z.string().optional().nullable(),
});

const OnboardingProcessSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  source: z.enum(['notion', 'web', 'internal']),
  url: z.string(),
  category: z.string(),
});

const OnboardingTrainingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
  duration: z.string(),
  source: z.enum(['youtube', 'internal']),
});

const OnboardingAccessSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'completed']),
  priority: z.enum(['high', 'medium', 'low']),
});

const OnboardingFlowSchema = z.object({
  people: z.array(OnboardingPersonSchema),
  processes: z.array(OnboardingProcessSchema),
  training: z.array(OnboardingTrainingSchema),
  access: z.array(OnboardingAccessSchema),
});

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let employee: any;
  
  try {
    const body = await req.json();
    employee = body.employee;

    const system = `You are an onboarding specialist. Generate a JSON object with these exact keys: people, processes, training, access.
    
CRITICAL: 
- people must be an ARRAY of person objects
- processes must be an ARRAY of process objects  
- training must be an ARRAY of training objects
- access must be an ARRAY of access objects

Each object must have ALL required fields filled with realistic data.`;

    const prompt = `Create an onboarding plan for ${employee.name}, ${employee.role} in ${employee.department}.

Return JSON with this EXACT structure:
{
  "people": [
    {
      "id": "unique-id",
      "name": "Full Name",
      "role": "Their Role",
      "department": "Their Department",
      "email": "email@company.com",
      "connectionType": "direct" or "indirect",
      "reasoning": "Why they need to connect (REQUIRED for indirect, omit or null for direct)"
    }
  ],
  "processes": [
    {
      "id": "unique-id",
      "title": "Process Title",
      "description": "Brief description",
      "source": "notion" or "web" or "internal",
      "url": "https://example.com/resource",
      "category": "HR Process" or "Team Guidelines" etc
    }
  ],
  "training": [
    {
      "id": "unique-id",
      "title": "Training Title",
      "description": "Brief description",
      "videoUrl": "https://youtube.com/watch?v=...",
      "duration": "15 min",
      "source": "youtube" or "internal"
    }
  ],
  "access": [
    {
      "id": "unique-id",
      "name": "System Name",
      "description": "What it's for",
      "status": "pending" or "completed",
      "priority": "high" or "medium" or "low"
    }
  ]
}

Generate:
- 5-8 people (mix of direct and indirect)
- 4-6 processes
- 3-5 training videos
- 5-7 access items (1-2 completed)`;

    const result = await generateObject({
      model: openrouter("anthropic/claude-3.5-sonnet"),
      schema: OnboardingFlowSchema,
      system,
      prompt,
    });

    return NextResponse.json({
      employee,
      ...result.object,
    });
  } catch (error) {
    console.error("Error generating onboarding flow:", error);
    
    // Fallback with dummy data if generation fails
    const fallbackData = {
      employee,
      people: [
        {
          id: "1",
          name: "Sarah Chen",
          role: "Manager",
          department: employee.department,
          email: "sarah.chen@company.com",
          connectionType: "direct" as const,
        },
        {
          id: "2",
          name: "Alex Johnson",
          role: "Team Lead",
          department: employee.department,
          email: "alex.johnson@company.com",
          connectionType: "direct" as const,
        },
        {
          id: "3",
          name: "Maria Garcia",
          role: "HR Partner",
          department: "Human Resources",
          email: "maria.garcia@company.com",
          connectionType: "indirect" as const,
          reasoning: "Will help with benefits enrollment and onboarding paperwork",
        },
      ],
      processes: [
        {
          id: "1",
          title: "Employee Handbook",
          description: "Company policies and procedures",
          source: "internal" as const,
          url: "/handbook",
          category: "HR Process",
        },
        {
          id: "2",
          title: "Team Wiki",
          description: "Department-specific documentation and processes",
          source: "notion" as const,
          url: "https://notion.so/team-wiki",
          category: "Team Guidelines",
        },
      ],
      training: [
        {
          id: "1",
          title: "Company Culture & Values",
          description: "Introduction to our mission and values",
          videoUrl: "https://youtube.com/watch?v=example1",
          duration: "20 min",
          source: "internal" as const,
        },
        {
          id: "2",
          title: "Security Awareness Training",
          description: "Essential security practices",
          videoUrl: "https://youtube.com/watch?v=example2",
          duration: "30 min",
          source: "youtube" as const,
        },
      ],
      access: [
        {
          id: "1",
          name: "Email Account",
          description: "Corporate email access",
          status: "completed" as const,
          priority: "high" as const,
        },
        {
          id: "2",
          name: "Slack Workspace",
          description: "Team communication platform",
          status: "pending" as const,
          priority: "high" as const,
        },
        {
          id: "3",
          name: "GitHub Access",
          description: "Code repository access",
          status: "pending" as const,
          priority: "medium" as const,
        },
      ],
    };

    return NextResponse.json(fallbackData);
  }
}