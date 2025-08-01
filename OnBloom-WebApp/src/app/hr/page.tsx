import { caller } from '@/trpc/server';
import { EmployeeDirectoryClientWrapper } from "./client-wrapper"

export default async function Page() {
  const employees = await caller.employee.getAll();
  
  return <EmployeeDirectoryClientWrapper initialEmployees={employees} />
}
  