// components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Archive, DoorOpen, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recursos", href: "/recursos", icon: Archive },
  { name: "Salas", href: "/salas", icon: DoorOpen },
  { name: "Reservas", href: "/reservas", icon: Calendar },
]

export function Sidebar() { 
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="flex h-20 items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold">Sysfacul</h1>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}