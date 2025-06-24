// components/sala-modal.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiAgendamento } from "@/lib/api" 
import toast from "react-hot-toast"

interface Sala {
  id: string
  nome: string
  capacidade: number
  descricao: string | null
  disponivel: boolean
  tipoSalaId: string
}

interface TipoSala {
  id: string;
  nome: string;
}

interface SalaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void; 
  sala?: Sala | null
}

export default function SalaModal({ isOpen, onClose, sala, onSuccess }: SalaModalProps) {
  // Estados do formulário
  const [nome, setNome] = useState("")
  const [capacidade, setCapacidade] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipoSalaId, setTipoSalaId] = useState("")

  const [tiposSala, setTiposSala] = useState<TipoSala[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      apiAgendamento.get('/tipos-sala')
        .then(response => setTiposSala(response.data))
        .catch(() => toast.error("Falha ao carregar os tipos de sala."));
    }
  }, [isOpen]);

  useEffect(() => {
    if (sala) {
      setNome(sala.nome)
      setCapacidade(sala.capacidade.toString())
      setDescricao(sala.descricao || "")
      setTipoSalaId(sala.tipoSalaId)
    } else {
      
      setNome("")
      setCapacidade("")
      setDescricao("")
      setTipoSalaId("")
    }
  }, [sala, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const salaData = {
      nome,
      capacidade: Number(capacidade),
      descricao,
      tipoSalaId,
    };

    const promise = sala 
      ? apiAgendamento.put(`/salas/${sala.id}`, salaData)
      : apiAgendamento.post('/salas', salaData);

    toast.promise(promise, {
      loading: 'Salvando...',
      success: () => {
        onSuccess();
        onClose();
        return `Sala ${sala ? 'atualizada' : 'criada'} com sucesso!`;
      },
      error: (err) => err.response?.data?.error || 'Erro ao salvar a sala.'
    });

    promise.finally(() => setIsLoading(false));
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{sala ? "Editar Sala" : "Adicionar Nova Sala"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Sala</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacidade">Capacidade</Label>
              <Input id="capacidade" type="number" value={capacidade} onChange={(e) => setCapacidade(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Sala</Label>
              <Select value={tipoSalaId} onValueChange={setTipoSalaId} required>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {tiposSala.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}