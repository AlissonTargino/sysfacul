// pages/salas.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import SalaModal from "@/components/sala-modal"
import { apiAgendamento } from "@/lib/api"
import toast from "react-hot-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  descricao: string | null;
  disponivel: boolean;
  tipoSalaId: string;
  tipoSala: { nome: string };
}

export default function Salas() {
  const [salas, setSalas] = useState<Sala[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSala, setEditingSala] = useState<Sala | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingSalaId, setDeletingSalaId] = useState<string | null>(null);

  const fetchSalas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiAgendamento.get('/salas');
      setSalas(response.data);
    } catch (error) {
      toast.error("Falha ao carregar salas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalas();
  }, [fetchSalas]);

  const handleAdd = () => {
    setEditingSala(null)
    setIsModalOpen(true)
  }

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (salaId: string) => {
    setDeletingSalaId(salaId);
    setIsAlertOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!deletingSalaId) return;

    const promise = apiAgendamento.delete(`/salas/${deletingSalaId}`);
    toast.promise(promise, {
      loading: 'Excluindo sala...',
      success: () => {
        fetchSalas();
        setIsAlertOpen(false);
        return 'Sala excluída com sucesso!';
      },
      error: 'Erro ao excluir a sala.'
    });
  }

  const filteredSalas = salas.filter(
    (sala) =>
      sala.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.tipoSala.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Gestão de Salas</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2"><Plus className="h-4 w-4" />Adicionar Sala</Button>
      </div>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input placeholder="Buscar por nome ou tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
      </div>
      <div className="border rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Sala</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Carregando...</TableCell></TableRow>}
            {!isLoading && filteredSalas.map((sala) => (
              <TableRow key={sala.id}>
                <TableCell className="font-medium">{sala.nome}</TableCell>
                <TableCell>{sala.tipoSala.nome}</TableCell>
                <TableCell>{sala.capacidade} pessoas</TableCell>
                <TableCell>
                  <Badge variant={sala.disponivel ? "default" : "destructive"}>{sala.disponivel ? "Disponível" : "Indisponível"}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(sala)}><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(sala.id)} className="text-red-600 focus:bg-red-500 focus:text-white"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SalaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} sala={editingSala} onSuccess={fetchSalas} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>Essa ação não pode ser desfeita e irá remover a sala permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className={cn(buttonVariants({ variant: "destructive" }))}>Confirmar Exclusão</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}