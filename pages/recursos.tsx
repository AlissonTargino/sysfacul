"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import RecursoModal from "@/components/recurso-modal"

interface Recurso {
  id: string
  nome: string
  tipo: "MATERIAL" | "INSUMO"
  qtdTotal: number
  qtdDisponivel: number
  categoria: string
}

export default function Recursos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null)

  const [recursos] = useState<Recurso[]>([
    {
      id: "1",
      nome: "Projetor Epson X450",
      tipo: "MATERIAL",
      qtdTotal: 5,
      qtdDisponivel: 3,
      categoria: "Equipamentos",
    },
    {
      id: "2",
      nome: "Papel A4",
      tipo: "INSUMO",
      qtdTotal: 1000,
      qtdDisponivel: 750,
      categoria: "Papelaria",
    },
    {
      id: "3",
      nome: "Notebook Dell",
      tipo: "MATERIAL",
      qtdTotal: 10,
      qtdDisponivel: 8,
      categoria: "Equipamentos",
    },
    {
      id: "4",
      nome: "Tinta para Impressora",
      tipo: "INSUMO",
      qtdTotal: 50,
      qtdDisponivel: 25,
      categoria: "Impressão",
    },
  ])

  const filteredRecursos = recursos.filter(
    (recurso) =>
      recurso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (recurso: Recurso) => {
    setEditingRecurso(recurso)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingRecurso(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Gestão de Recursos</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Recurso
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar recursos..."
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
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Qtd. Total</TableHead>
              <TableHead>Qtd. Disponível</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecursos.map((recurso) => (
              <TableRow key={recurso.id}>
                <TableCell className="font-medium">{recurso.nome}</TableCell>
                <TableCell>
                  <Badge variant={recurso.tipo === "MATERIAL" ? "default" : "secondary"}>{recurso.tipo}</Badge>
                </TableCell>
                <TableCell>{recurso.qtdTotal}</TableCell>
                <TableCell>{recurso.qtdDisponivel}</TableCell>
                <TableCell>{recurso.categoria}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(recurso)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RecursoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recurso={editingRecurso} />
    </div>
  )
}
