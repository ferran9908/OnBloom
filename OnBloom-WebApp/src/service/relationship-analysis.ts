/* eslint-disable */
import { generateObject, streamObject } from "ai";
import { z } from "zod";
import { models } from "@/lib/ai";
import { EmployeeCulturalProfile } from "./notion";

export type ConnectionType =
  | "same_team"
  | "same_department"
  | "same_location"
  | "same_role"
  | "cultural_heritage"
  | "shared_interests"
  | "language_match"
  | "potential_mentor"
  | "recent_hire"
  | "cross_functional"
  | "timezone_overlap"
  | "executive_peer"
  | "leadership_mentor"
  | "peer_level";

export interface EmployeeRelationship {
  employeeId: string;
  employeeName: string;
  connectionTypes: ConnectionType[];
  relevanceScore: number;
  reasoning: string;
  actionableInsights: string[];
}

export interface RelationshipAnalysis {
  newEmployeeId: string;
  relationships: EmployeeRelationship[];
  keyInsights: string[];
  onboardingRecommendations: string[];
}

const relationshipSchema = z.object({
  relationships: z.array(
    z.object({
      employeeId: z.string(),
      employeeName: z.string(),
      connectionTypes: z.array(
        z.enum([
          "same_team",
          "same_department",
          "same_location",
          "same_role",
          "cultural_heritage",
          "shared_interests",
          "language_match",
          "potential_mentor",
          "recent_hire",
          "cross_functional",
          "timezone_overlap",
          "executive_peer",
          "leadership_mentor",
          "peer_level",
        ]),
      ),
      relevanceScore: z.number().min(0).max(100),
      reasoning: z.string(),
      actionableInsights: z.array(z.string()),
    }),
  ),
  keyInsights: z.array(z.string()),
  onboardingRecommendations: z.array(z.string()),
});

export function findDirectConnections(
  newEmployee: EmployeeCulturalProfile,
  allEmployees: EmployeeCulturalProfile[],
): Partial<EmployeeRelationship>[] {
  const connections: Partial<EmployeeRelationship>[] = [];

  for (const employee of allEmployees) {
    if (employee.id === newEmployee.id) continue;

    const connectionTypes: ConnectionType[] = [];
    const insights: string[] = [];

    // Same team
    if (
      employee.tags?.includes("New Hire") &&
      employee.department === newEmployee.department
    ) {
      connectionTypes.push("same_team");
      insights.push(`Both in ${employee.department} team`);
    }

    // Same department
    if (employee.department === newEmployee.department) {
      connectionTypes.push("same_department");
    }

    // Same location
    if (employee.location === newEmployee.location) {
      connectionTypes.push("same_location");
      insights.push(`Both based in ${employee.location}`);
    }

    // Same role type
    if (employee.role === newEmployee.role) {
      connectionTypes.push("same_role");
      insights.push(`Both are ${employee.role}s`);
    }

    // Cultural heritage overlap
    const sharedHeritage =
      employee.culturalHeritage?.filter((h) =>
        newEmployee.culturalHeritage?.includes(h),
      ) || [];
    if (sharedHeritage.length > 0) {
      connectionTypes.push("cultural_heritage");
      insights.push(`Shared cultural heritage: ${sharedHeritage.join(", ")}`);
    }

    // Timezone overlap
    if (employee.timeZone === newEmployee.timeZone) {
      connectionTypes.push("timezone_overlap");
    }

    // Recent hire (within last 3 months)
    if (employee.startDate) {
      const employeeStart = new Date(employee.startDate);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      if (employeeStart > threeMonthsAgo) {
        connectionTypes.push("recent_hire");
        insights.push("Recently joined the company");
      }
    }

    if (connectionTypes.length > 0) {
      connections.push({
        employeeId: employee.id,
        employeeName: employee.name,
        connectionTypes,
        actionableInsights: insights,
      });
    }
  }

  return connections;
}

export async function analyzeEmployeeRelationships(
  newEmployee: EmployeeCulturalProfile,
  allEmployees: EmployeeCulturalProfile[],
  options?: {
    onThinkingUpdate?: (thinking: string) => void;
    useStreaming?: boolean;
  },
): Promise<RelationshipAnalysis> {
  // Get direct connections first
  const directConnections = findDirectConnections(newEmployee, allEmployees);

  // Prepare data for AI analysis
  const employeeData = {
    newEmployee: {
      name: newEmployee.name,
      role: newEmployee.role,
      department: newEmployee.department,
      location: newEmployee.location,
      culturalHeritage: newEmployee.culturalHeritage,
      ageRange: newEmployee.ageRange,
      startDate: newEmployee.startDate,
    },
    existingEmployees: allEmployees
      .filter((e) => e.id !== newEmployee.id)
      .map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        department: e.department,
        location: e.location,
        culturalHeritage: e.culturalHeritage,
        ageRange: e.ageRange,
        startDate: e.startDate,
        timeZone: e.timeZone,
      })),
    directConnections,
  };

  const prompt = `
You are an HR specialist analyzing employee relationships for onboarding purposes.

New Employee:
${JSON.stringify(employeeData.newEmployee, null, 2)}

Existing Employees:
${JSON.stringify(employeeData.existingEmployees, null, 2)}

Direct Connections Found:
${JSON.stringify(employeeData.directConnections, null, 2)}

Analyze the relationships between the new employee and existing employees. Consider:
1. Professional connections (mentorship opportunities, cross-functional collaboration)
2. Cultural and social connections (shared backgrounds, interests)
3. Practical connections (timezone, location, recent hires who can share experience)

For each relationship, provide:
- Clear reasoning why this connection is valuable
- Actionable insights for facilitating the connection
- A relevance score (0-100) based on potential impact on successful onboarding

Also provide:
- Key insights about the new employee's potential network
- Specific onboarding recommendations based on the analysis

Focus on meaningful connections that will help the new employee integrate successfully into the organization.
`;

  try {
    if (options?.useStreaming) {
      // Use streaming with thinking model
      const { partialObjectStream, object } = await streamObject({
        model: models.claude37SonnetThinking,
        schema: relationshipSchema,
        prompt,
        onFinish: ({ usage }) => {
          console.log("Token usage:", usage);
        },
      });

      // Handle streaming updates
      for await (const partialObject of partialObjectStream) {
        // Extract thinking from the partial response if available
        const thinking = (partialObject as any)?._thinking || "";
        if (thinking && options.onThinkingUpdate) {
          options.onThinkingUpdate(thinking);
        }
      }

      const finalResult = await object;
      return {
        newEmployeeId: newEmployee.id,
        ...finalResult,
      };
    } else {
      // Use non-streaming approach with structured output
      const structuredPrompt = `${prompt}

IMPORTANT: You must respond with a valid JSON object that matches this exact structure:
{
  "relationships": [
    {
      "employeeId": "string",
      "employeeName": "string", 
      "connectionTypes": array of ONLY these valid values:
        - "same_team" (same immediate team)
        - "same_department" (same department)
        - "same_location" (same office/city)
        - "same_role" (exact same job title)
        - "cultural_heritage" (shared cultural background)
        - "shared_interests" (common hobbies/interests)
        - "language_match" (speak same languages)
        - "potential_mentor" (could mentor the new employee)
        - "recent_hire" (joined recently, within 3 months)
        - "cross_functional" (different department but valuable connection)
        - "timezone_overlap" (similar working hours)
        - "executive_peer" (same executive/VP level)
        - "leadership_mentor" (senior leader who can guide)
        - "peer_level" (similar seniority level)
      "relevanceScore": number (0-100),
      "reasoning": "string",
      "actionableInsights": ["string"]
    }
  ],
  "keyInsights": ["string"],
  "onboardingRecommendations": ["string"]
}

CRITICAL: Only use the exact connectionTypes listed above. Do not create new types.`;

      const result = await generateObject({
        model: models.claude35Sonnet,
        schema: relationshipSchema,
        prompt: structuredPrompt,
        mode: "json",
        temperature: 0.7,
      });

      return {
        newEmployeeId: newEmployee.id,
        ...result.object,
      };
    }
  } catch (error) {
    console.error("Error analyzing relationships with AI:", error);

    // If it's a validation error, try to extract and use the data anyway
    if (
      error instanceof Error &&
      error.message.includes("Type validation failed")
    ) {
      try {
        // Extract the text response from the error
        const errorObj = error as any;
        if (errorObj.text) {
          const parsedData = JSON.parse(errorObj.text);

          // Filter out invalid connection types
          const validConnectionTypes = new Set([
            "same_team",
            "same_department",
            "same_location",
            "same_role",
            "cultural_heritage",
            "shared_interests",
            "language_match",
            "potential_mentor",
            "recent_hire",
            "cross_functional",
            "timezone_overlap",
            "executive_peer",
            "leadership_mentor",
            "peer_level",
          ]);

          const cleanedRelationships = parsedData.relationships.map(
            (rel: any) => ({
              ...rel,
              connectionTypes: rel.connectionTypes.filter((type: string) =>
                validConnectionTypes.has(type),
              ),
            }),
          );

          return {
            newEmployeeId: newEmployee.id,
            relationships: cleanedRelationships,
            keyInsights: parsedData.keyInsights || [],
            onboardingRecommendations:
              parsedData.onboardingRecommendations || [],
          };
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      }
    }

    // Fallback to direct connections only
    return {
      newEmployeeId: newEmployee.id,
      relationships: directConnections.map((conn) => ({
        employeeId: conn.employeeId!,
        employeeName: conn.employeeName!,
        connectionTypes: conn.connectionTypes!,
        relevanceScore: conn.connectionTypes!.length * 20,
        reasoning: `Direct connection based on: ${conn.connectionTypes!.join(", ")}`,
        actionableInsights: conn.actionableInsights || [],
      })),
      keyInsights: [
        `${newEmployee.name} is joining the ${newEmployee.department} department as a ${newEmployee.role}`,
        `Located in ${newEmployee.location} with ${directConnections.length} direct connections identified`,
      ],
      onboardingRecommendations: [
        "Schedule meet-and-greets with team members in the same department",
        "Connect with other recent hires for shared onboarding experiences",
        "Facilitate introductions with employees sharing cultural background",
      ],
    };
  }
}

export function getConnectionTypeLabel(type: ConnectionType): string {
  const labels: Record<ConnectionType, string> = {
    same_team: "Same Team",
    same_department: "Same Department",
    same_location: "Same Location",
    same_role: "Same Role",
    cultural_heritage: "Cultural Connection",
    shared_interests: "Shared Interests",
    language_match: "Language Match",
    potential_mentor: "Potential Mentor",
    recent_hire: "Recent Hire",
    cross_functional: "Cross-Functional",
    timezone_overlap: "Timezone Overlap",
    executive_peer: "Executive Peer",
    leadership_mentor: "Leadership Mentor",
    peer_level: "Peer Level",
  };
  return labels[type];
}

export function getConnectionTypeColor(type: ConnectionType): string {
  const colors: Record<ConnectionType, string> = {
    same_team: "bg-onbloom-primary",
    same_department: "bg-onbloom-accent-blue",
    same_location: "bg-onbloom-accent-green",
    same_role: "bg-onbloom-dark-purple",
    cultural_heritage: "bg-onbloom-accent-pink",
    shared_interests: "bg-onbloom-warning",
    language_match: "bg-onbloom-info",
    potential_mentor: "bg-onbloom-success",
    recent_hire: "bg-onbloom-secondary",
    cross_functional: "bg-onbloom-dark-brown",
    timezone_overlap: "bg-gray-600",
    executive_peer: "bg-purple-600",
    leadership_mentor: "bg-indigo-600",
    peer_level: "bg-blue-600",
  };
  return colors[type];
}
