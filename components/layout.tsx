// components/layout.tsx
"use client"

import { useAuth } from "@/context/AuthContext"
import { LogOut, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar" // Importando o novo componente

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth()

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      {/* Sidebar para Desktop (visível em telas médias e maiores) */}
      <aside className="hidden border-r bg-muted/40 md:block">
        <Sidebar />
      </aside>

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-20 items-center gap-4 border-b bg-white px-4 md:px-8">
          {/* Botão do Menu para Mobile (visível apenas em telas pequenas) */}
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
          
          {/* Menu do Usuário (movido para a direita) */}
          <div className="ml-auto flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="font-medium text-slate-700">{user?.nome}</span>
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

        {/* Conteúdo da Página */}
        <main className="flex-1 overflow-auto bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}