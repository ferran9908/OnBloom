"use client"
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Wrench, Users, Gift, Package, UserPlus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/hr", label: "New Hires", icon: Users },
    { href: "/hr/initiate-onboarding", label: "Onboarding", icon: UserPlus },
    { href: "/hr/pick-gift", label: "Pick Gift", icon: Gift },
    { href: "/hr/gift-history", label: "Gift History", icon: Package },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-onbloom-neutral via-white to-onbloom-neutral/50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-onbloom-primary/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-onbloom-primary/10 rounded-lg flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="OnBloom Logo"
                  className="w-56 h-12 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-onbloom-primary font-title">
                OnBloom
              </span>
            </div>
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2",
                        isActive
                          ? "bg-onbloom-primary/10 text-onbloom-primary"
                          : "hover:bg-onbloom-primary/5"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/hr/settings")}
              variant="default"
              size="icon"
            >
              <Wrench />
            </Button>
            <UserButton />
          </div>
        </div>
      </nav>
      <div className="flex-1 bg-white/50 overflow-auto">{children}</div>
    </div>
  );
}
