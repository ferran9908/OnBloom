import z from "zod";
import { protectedProcedure, t } from "../init";
import { TRPCError } from "@trpc/server";
import {
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  getEmployeesByDepartment,
  createEmployee,
  updateEmployee,
  type CreateEmployeeData,
  type EmployeeCulturalProfile,
} from "@/service/notion";

// Zod schema for employee creation
const createEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  location: z.string().min(1, "Location is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  ageRange: z.string().optional(),
  genderIdentity: z.string().optional(),
  culturalHeritage: z.array(z.string()).optional().default([]),
});

// Zod schema for employee updates
const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeRouter = t.router({
  // Get all employees
  getAll: protectedProcedure.query(async () => {
    try {
      return await getAllEmployees();
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch employees',
      });
    }
  }),

  // Get employee by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const employee = await getEmployeeById(input.id);
        if (!employee) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Employee not found',
          });
        }
        return employee;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch employee',
        });
      }
    }),

  // Search employees
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      try {
        return await searchEmployees(input.query);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to search employees',
        });
      }
    }),

  // Get employees by department
  getByDepartment: protectedProcedure
    .input(z.object({ department: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getEmployeesByDepartment(input.department);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch employees by department',
        });
      }
    }),

  // Create new employee
  create: protectedProcedure
    .input(createEmployeeSchema)
    .mutation(async ({ input }) => {
      try {
        console.log('Creating employee with data:', JSON.stringify(input, null, 2));
        return await createEmployee(input as CreateEmployeeData);
      } catch (error) {
        console.error('Error in create employee tRPC:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create employee',
        });
      }
    }),

  // Update employee
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateEmployeeSchema,
    }))
    .mutation(async ({ input }) => {
      try {
        return await updateEmployee(input.id, input.data as Partial<CreateEmployeeData>);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update employee',
        });
      }
    }),
});