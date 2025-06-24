"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Edit, UserX } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import SalaModal from "@/components/sala-modal"

interface Sala {
  id: string
  nome: string
  tipo: string
  capacidade: number
  disponibilidade: "Disponível" | "Ocupada"
}

export default function Salas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSala, setEditingSala] = useState<Sala | null>(null)

  const [salas] = useState<Sala[]>([
    {
      id: "1",
      nome: "Sala A101",
      tipo: "Sala de Aula",
      capacidade: 40,
      disponibilidade: "Disponível",
    },
    {
      id: "2",
      nome: "Laboratório de Informática",
      tipo: "Laboratório",
      capacidade: 30,
      disponibilidade: "Ocupada",
    },
    {
      id: "3",
      nome: "Auditório Principal",
      tipo: "Auditório",
      capacidade: 200,
      disponibilidade: "Disponível",
    },
    {
      id: "4",
      nome: "Sala de Reuniões",
      tipo: "Sala de Reunião",
      capacidade: 12,
      disponibilidade: "Disponível",
    },
  ])

  const filteredSalas = salas.filter(
    (sala) =>
      sala.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingSala(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Gestão de Salas</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Sala
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar salas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Sala</TableHead>
              <TableHead>Tipo de Sala</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalas.map((sala) => (
              <TableRow key={sala.id}>
                <TableCell className="font-medium">{sala.nome}</TableCell>
                <TableCell>{sala.tipo}</TableCell>
                <TableCell>{sala.capacidade} pessoas</TableCell>
                <TableCell>
                  <Badge variant={sala.disponibilidade === "Disponível" ? "default" : "destructive"}>
                    {sala.disponibilidade}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(sala)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <UserX className="mr-2 h-4 w-4" />
                        Desativar Sala
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SalaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sala={editingSala} />
    </div>
  )
}
