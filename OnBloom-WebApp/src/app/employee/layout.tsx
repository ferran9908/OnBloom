import { checkRole } from "@/utils/roles"
import { redirect } from "next/navigation"

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isHr = await checkRole('hr')

  if (isHr) {
    redirect("/")
  }

  return <div>{children}</div>
}

