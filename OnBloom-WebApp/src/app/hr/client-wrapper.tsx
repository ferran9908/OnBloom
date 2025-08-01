'use client'

import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { EmployeeDirectoryClient } from './ui'
import { EmployeeCulturalProfile } from '@/service/notion'

interface ClientWrapperProps {
  initialEmployees: EmployeeCulturalProfile[]
}

export function EmployeeDirectoryClientWrapper({ initialEmployees }: ClientWrapperProps) {
  const trpc = useTRPC()
  
  const { data: employees, refetch } = useQuery({
    ...trpc.employee.getAll.queryOptions(),
    initialData: initialEmployees,
  })

  const handleRefresh = async () => {
    await refetch()
  }

  return <EmployeeDirectoryClient employees={employees} onRefresh={handleRefresh} />
}