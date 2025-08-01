import { generateObject, streamText } from "ai";
import { openrouter } from "@/lib/ai";
import { z } from "zod";
import { EmployeeCulturalProfile } from "./notion";
import { findDirectConnections, analyzeEmployeeRelationships } from "./relationship-analysis";
import { 
  OnboardingData, 
  PersonEntity, 
  ProcessEntity, 
  TrainingEntity, 
  AccessEntity 
} from "@/types/onboarding";

const OnboardingAnalysisSchema = z.object({
  processes: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["article", "wiki", "documentation", "policy"]),
    source: z.string(),
    url: z.string().optional(),
    description: z.string(),
    relevanceScore: z.number().min(0).max(100)
  })),
  training: z.array(z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(["video", "course", "tutorial"]),
    source: z.enum(["youtube", "internal", "external"]),
    url: z.string(),
    duration: z.string().optional(),
    thumbnail: z.string().optional(),
    description: z.string(),
    relevanceScore: z.number().min(0).max(100)
  })),
  access: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["software", "system", "platform", "tool"]),
    description: z.string(),
    priority: z.enum(["critical", "high", "medium", "low"]),
    completed: z.boolean().default(false),
    instructions: z.string().optional()
  })),
  insights: z.array(z.string()),
  recommendations: z.array(z.string())
});

export async function generateComprehensiveOnboarding(
  employee: EmployeeCulturalProfile,
  allEmployees: EmployeeCulturalProfile[]
): Promise<OnboardingData> {
  // Get people connections using existing relationship analysis
  const relationshipData = await analyzeEmployeeRelationships(employee, allEmployees);
  
  // Convert relationship connections to PersonEntity format
  const people: PersonEntity[] = relationshipData.connections.map(conn => ({
    id: conn.employee.id,
    name: conn.employee.name,
    role: conn.employee.role,
    department: conn.employee.department,
    email: conn.employee.email,
    connectionType: conn.connectionType,
    relevanceScore: conn.relevanceScore,
    reasoning: conn.reasoning,
    isDirect: conn.isDirect
  }));

  // Generate other onboarding entities using AI
  const model = openrouter.chat("google/gemini-2.5-pro");
  
  const prompt = `You are an expert onboarding specialist. Analyze this new employee and generate comprehensive onboarding resources.

Employee Information:
Name: ${employee.name}
Role: ${employee.role}
Department: ${employee.department}
Start Date: ${employee.startDate}
Location: ${employee.location}
Cultural Heritage: ${employee.culturalHeritage.join(", ")}

Based on this employee's profile, generate:

1. PROCESSES (5-8 items): Essential documentation, wikis, policies, and articles they should read
   - Focus on role-specific and department-specific content
   - Include company policies and procedures
   - Suggest relevant industry articles or best practices

2. TRAINING (5-8 items): Video resources and courses for skill development
   - Prioritize role-specific technical skills
   - Include soft skills relevant to their position
   - Suggest YouTube videos, online courses, or tutorials
   - Make URLs realistic but placeholder (e.g., https://youtube.com/watch?v=example)

3. ACCESS (8-12 items): Systems, tools, and platforms they need access to
   - List in priority order (critical → high → medium → low)
   - Include both technical tools and administrative systems
   - Consider department-specific and role-specific tools
   - Add brief setup instructions where helpful

4. INSIGHTS: 3-5 key observations about this employee's onboarding needs

5. RECOMMENDATIONS: 3-5 actionable suggestions for a successful onboarding

Make all suggestions specific to their role and department. Score relevance from 0-100.`;

  const { object: analysisResult } = await generateObject({
    model,
    schema: OnboardingAnalysisSchema,
    prompt,
    temperature: 0.7,
  });

  return {
    employee: {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      department: employee.department,
      email: employee.email,
      startDate: employee.startDate
    },
    people,
    processes: analysisResult.processes,
    training: analysisResult.training,
    access: analysisResult.access,
    insights: [...relationshipData.insights, ...analysisResult.insights],
    recommendations: [...relationshipData.recommendations, ...analysisResult.recommendations]
  };
}

export async function* streamOnboardingAnalysis(
  employee: EmployeeCulturalProfile,
  allEmployees: EmployeeCulturalProfile[]
) {
  const model = openrouter.chat("google/gemini-2.5-pro");
  
  const prompt = `You are analyzing onboarding needs for a new employee. Think through their requirements step by step.

Employee: ${employee.name} (${employee.role} in ${employee.department})
Location: ${employee.location}
Start Date: ${employee.startDate}

Consider:
1. What people they should connect with and why
2. What processes and documentation they need to understand
3. What training materials would be most valuable
4. What systems and tools they need access to

Think through each category carefully and explain your reasoning.`;

  const stream = streamText({
    model,
    prompt,
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    yield chunk;
  }
}