// components/layout.tsx
"use client"

import type React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Archive,
  DoorOpen,
  Calendar,
  LogOut,
  User,
  Menu,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Componente Sidebar definido localmente para evitar erros de importação
function Sidebar() {
  const router = useRouter()
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Recursos", href: "/recursos", icon: Archive },
    { name: "Salas", href: "/salas", icon: DoorOpen },
    { name: "Reservas", href: "/reservas", icon: Calendar },
  ]

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold">Sysfacul</h1>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {navigation.map((item) => {
          const isActive = router.pathname.startsWith(item.href)
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

// Componente Layout Principal que será usado em toda a aplicação
interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      <aside className="hidden md:block">
        <Sidebar />
      </aside>
      <div className="flex flex-col">
        <header className="flex h-20 items-center gap-4 border-b bg-white px-4 md:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir/Fechar menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="font-medium text-slate-700">{user?.nome || ""}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}