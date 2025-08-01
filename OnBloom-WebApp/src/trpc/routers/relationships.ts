import z from "zod";
import { protectedProcedure, t } from "../init";
import { TRPCError } from "@trpc/server";
import { getEmployeeById, getAllEmployees } from "@/service/notion";
import { analyzeEmployeeRelationships } from "@/service/relationship-analysis";

export const relationshipsRouter = t.router({
  // Analyze relationships for a specific employee
  analyzeForEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ input }) => {
      try {
        // Get the employee
        const employee = await getEmployeeById(input.employeeId);
        if (!employee) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Employee not found',
          });
        }

        // Get all employees for comparison
        const allEmployees = await getAllEmployees();

        // Analyze relationships
        const analysis = await analyzeEmployeeRelationships(employee, allEmployees);

        return analysis;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error analyzing relationships:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to analyze relationships',
        });
      }
    }),

  // Get suggested connections for onboarding
  getOnboardingConnections: protectedProcedure
    .input(z.object({ 
      employeeId: z.string(),
      limit: z.number().optional().default(10),
    }))
    .query(async ({ input }) => {
      try {
        // Get the employee
        const employee = await getEmployeeById(input.employeeId);
        if (!employee) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Employee not found',
          });
        }

        // Get all employees
        const allEmployees = await getAllEmployees();

        // Analyze relationships
        const analysis = await analyzeEmployeeRelationships(employee, allEmployees);

        // Sort by relevance score and return top connections
        const topConnections = analysis.relationships
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, input.limit);

        return {
          employee,
          connections: topConnections,
          insights: analysis.keyInsights,
          recommendations: analysis.onboardingRecommendations,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error getting onboarding connections:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get onboarding connections',
        });
      }
    }),
});