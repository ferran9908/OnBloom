import { t } from "../init";
import { z } from "zod";
import { getEmployeeById, getAllEmployees } from "@/service/notion";
import { generateComprehensiveOnboarding } from "@/service/onboarding-analysis";
import { TRPCError } from "@trpc/server";

export const onboardingRouter = t.router({
  getComprehensiveData: t.procedure
    .input(z.object({
      employeeId: z.string(),
    }))
    .query(async ({ input }) => {
      const { employeeId } = input;

      // Get employee data
      const employee = await getEmployeeById(employeeId);
      if (!employee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found",
        });
      }

      // Get all employees for relationship analysis
      const allEmployees = await getAllEmployees();

      // Generate comprehensive onboarding data
      const onboardingData = await generateComprehensiveOnboarding(
        employee,
        allEmployees
      );

      return onboardingData;
    }),
});