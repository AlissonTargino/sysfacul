"use client"

import type React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { LayoutDashboard, Archive, DoorOpen, Calendar, LogOut, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"; // <-- Importa nosso hook!

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Recursos", href: "/recursos", icon: Archive },
    { name: "Salas", href: "/salas", icon: DoorOpen },
    { name: "Reservas", href: "/reservas", icon: Calendar },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold">SysFacul</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const isActive = router.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex justify-end items-center px-8 h-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-600" />
                  {/* Usa o nome do usuário do contexto */}
                  <span className="font-medium text-slate-700">{user?.nome}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Usa a função de logout do contexto */}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  )
}