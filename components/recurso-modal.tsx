"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { apiRecursos } from "@/lib/api"
import toast from "react-hot-toast"


interface Recurso {
  id: string;
  nome: string;
  descricao: string | null;
  tipoRecurso: "MATERIAL" | "INSUMO";
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  categoriaId: string;
  dataValidade: string | null;
}


interface Categoria {
  id: string;
  nome: string;
}


interface RecursoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void; 
  recurso?: Recurso | null
}

export default function RecursoModal({ isOpen, onClose, recurso, onSuccess }: RecursoModalProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [quantidadeTotal, setQuantidadeTotal] = useState("")
  const [tipo, setTipo] = useState<"MATERIAL" | "INSUMO">("MATERIAL")
  const [categoriaId, setCategoriaId] = useState("")
  const [dataValidade, setDataValidade] = useState<Date | undefined>()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      apiRecursos.get('/categorias')
        .then(response => setCategorias(response.data))
        .catch(() => toast.error("Falha ao carregar categorias."));
    }
  }, [isOpen]);

  useEffect(() => {
    if (recurso) {
      setNome(recurso.nome)
      setDescricao(recurso.descricao || "")
      setQuantidadeTotal(recurso.quantidadeTotal.toString())
      setTipo(recurso.tipoRecurso)
      setCategoriaId(recurso.categoriaId)
      setDataValidade(recurso.dataValidade ? new Date(recurso.dataValidade) : undefined);
    } else {
      setNome("")
      setDescricao("")
      setQuantidadeTotal("")
      setTipo("MATERIAL")
      setCategoriaId("")
      setDataValidade(undefined)
    }
  }, [recurso, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const resourceData = {
      nome,
      descricao,
      quantidadeTotal: Number(quantidadeTotal),
      tipoRecurso: tipo,
      categoriaId,
      ...(tipo === 'INSUMO' && dataValidade && { dataValidade: dataValidade.toISOString() }),
    };

    const promise = recurso 
      ? apiRecursos.put(`/recursos/${recurso.id}`, resourceData)
      : apiRecursos.post('/recursos', resourceData);

    toast.promise(promise, {
      loading: 'Salvando...',
      success: () => {
        onSuccess(); 
        onClose(); 
        return `Recurso ${recurso ? 'atualizado' : 'criado'} com sucesso!`;
      },
      error: (err) => err.response?.data?.error || `Erro ao salvar recurso.`
    });

    promise.finally(() => setIsLoading(false));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{recurso ? "Editar Recurso" : "Adicionar Novo Recurso"}</DialogTitle>
        </DialogHeader>
        {/* O JSX do formulário continua muito parecido */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Recurso</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qtdTotal">Quantidade Total</Label>
              <Input id="qtdTotal" type="number" value={quantidadeTotal} onChange={(e) => setQuantidadeTotal(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Recurso</Label>
              <RadioGroup value={tipo} onValueChange={(value: "MATERIAL" | "INSUMO") => setTipo(value)} className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="MATERIAL" id="material" /><Label htmlFor="material">Material</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="INSUMO" id="insumo" /><Label htmlFor="insumo">Insumo</Label></div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoriaId} onValueChange={setCategoriaId} required>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {tipo === "INSUMO" && (
            <div className="space-y-2">
              <Label>Data de Validade</Label>
              <Popover>
                <PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{dataValidade ? format(dataValidade, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}</Button></PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dataValidade} onSelect={setDataValidade} initialFocus /></PopoverContent>
              </Popover>
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}