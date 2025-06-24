"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Sala {
  id: string
  nome: string
  tipo: string
  capacidade: number
  disponibilidade: "Disponível" | "Ocupada"
}

interface SalaModalProps {
  isOpen: boolean
  onClose: () => void
  sala?: Sala | null
}

export default function SalaModal({ isOpen, onClose, sala }: SalaModalProps) {
  const [nome, setNome] = useState("")
  const [capacidade, setCapacidade] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("")

  useEffect(() => {
    if (sala) {
      setNome(sala.nome)
      setCapacidade(sala.capacidade.toString())
      setTipo(sala.tipo)
    } else {
      setNome("")
      setCapacidade("")
      setDescricao("")
      setTipo("")
    }
  }, [sala])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar a sala
    console.log("Salvando sala:", {
      nome,
      capacidade: Number.parseInt(capacidade),
      descricao,
      tipo,
    })
    onClose()
  }

  const tiposSala = ["Sala de Aula", "Laboratório", "Auditório", "Sala de Reunião", "Biblioteca", "Sala de Estudos"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sala ? "Editar Sala" : "Adicionar Sala"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Sala</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade</Label>
            <Input
              id="capacidade"
              type="number"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Sala</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de sala" />
              </SelectTrigger>
              <SelectContent>
                {tiposSala.map((tipoSala) => (
                  <SelectItem key={tipoSala} value={tipoSala}>
                    {tipoSala}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
          </div>

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
