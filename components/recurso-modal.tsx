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

interface Recurso {
  id: string
  nome: string
  tipo: "MATERIAL" | "INSUMO"
  qtdTotal: number
  qtdDisponivel: number
  categoria: string
}

interface RecursoModalProps {
  isOpen: boolean
  onClose: () => void
  recurso?: Recurso | null
}

export default function RecursoModal({ isOpen, onClose, recurso }: RecursoModalProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [qtdTotal, setQtdTotal] = useState("")
  const [tipo, setTipo] = useState<"MATERIAL" | "INSUMO">("MATERIAL")
  const [categoria, setCategoria] = useState("")
  const [dataValidade, setDataValidade] = useState<Date>()

  useEffect(() => {
    if (recurso) {
      setNome(recurso.nome)
      setQtdTotal(recurso.qtdTotal.toString())
      setTipo(recurso.tipo)
      setCategoria(recurso.categoria)
    } else {
      setNome("")
      setDescricao("")
      setQtdTotal("")
      setTipo("MATERIAL")
      setCategoria("")
      setDataValidade(undefined)
    }
  }, [recurso])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar o recurso
    console.log("Salvando recurso:", {
      nome,
      descricao,
      qtdTotal: Number.parseInt(qtdTotal),
      tipo,
      categoria,
      dataValidade,
    })
    onClose()
  }

  const categorias = ["Equipamentos", "Papelaria", "Impressão", "Limpeza", "Mobiliário", "Tecnologia"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{recurso ? "Editar Recurso" : "Adicionar Recurso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Recurso</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qtdTotal">Quantidade Total</Label>
            <Input
              id="qtdTotal"
              type="number"
              value={qtdTotal}
              onChange={(e) => setQtdTotal(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Tipo de Recurso</Label>
            <RadioGroup value={tipo} onValueChange={(value: "MATERIAL" | "INSUMO") => setTipo(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MATERIAL" id="material" />
                <Label htmlFor="material">Material</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INSUMO" id="insumo" />
                <Label htmlFor="insumo">Insumo</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tipo === "INSUMO" && (
            <div className="space-y-2">
              <Label>Data de Validade</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataValidade ? format(dataValidade, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dataValidade} onSelect={setDataValidade} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
