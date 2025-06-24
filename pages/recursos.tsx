// pages/recursos.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import RecursoModal from "@/components/recurso-modal"
import { apiRecursos } from "@/lib/api"
import toast from "react-hot-toast"

// Interface para os dados do recurso
interface Recurso {
  id: string;
  nome: string;
  descricao: string | null;
  tipoRecurso: "MATERIAL" | "INSUMO";
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  categoriaId: string;
  categoria: { nome: string };
  dataValidade: string | null;
}

export default function Recursos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null)
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Função para buscar os dados, agora reutilizável
  const fetchRecursos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiRecursos.get('/recursos');
      setRecursos(response.data);
    } catch (error) {
      toast.error("Falha ao carregar recursos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecursos();
  }, [fetchRecursos]);
  
  const handleAdd = () => {
    setEditingRecurso(null) 
    setIsModalOpen(true)
  }

  const handleEdit = (recurso: Recurso) => {
    setEditingRecurso(recurso)
    setIsModalOpen(true)
  }

  const handleDelete = async (recursoId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este recurso?")) {
      const promise = apiRecursos.delete(`/recursos/${recursoId}`);
      toast.promise(promise, {
        loading: 'Excluindo...',
        success: () => {
          fetchRecursos(); 
          return 'Recurso excluído com sucesso!';
        },
        error: 'Erro ao excluir o recurso.'
      });
    }
  }

 
  const filteredRecursos = recursos.filter(
    (recurso) =>
      recurso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recurso.categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Gestão de Recursos</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Recurso
        </Button>
      </div>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input placeholder="Buscar por nome ou categoria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>
      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Qtd. Disponível</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Carregando...</TableCell></TableRow>}
            {!isLoading && filteredRecursos.map((recurso) => (
              <TableRow key={recurso.id}>
                <TableCell className="font-medium">{recurso.nome}</TableCell>
                <TableCell><Badge variant={recurso.tipoRecurso === "MATERIAL" ? "secondary" : "outline"}>{recurso.tipoRecurso}</Badge></TableCell>
                <TableCell>{recurso.quantidadeDisponivel} / {recurso.quantidadeTotal}</TableCell>
                <TableCell>{recurso.categoria.nome}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(recurso)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(recurso.id)} className="text-red-600 focus:text-white focus:bg-red-500"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <RecursoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recurso={editingRecurso}
        onSuccess={fetchRecursos} 
      />
    </div>
  )
}