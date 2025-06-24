"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Reserva {
  id: string
  sala: string
  data: Date
  horaInicio: string
  horaFim: string
  responsavel: string
  status: "Confirmada" | "Pendente" | "Cancelada"
}

interface ReservaModalProps {
  isOpen: boolean
  onClose: () => void
  reserva?: Reserva | null
}

export default function ReservaModal({ isOpen, onClose, reserva }: ReservaModalProps) {
  const [sala, setSala] = useState("")
  const [data, setData] = useState<Date>()
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [responsavel, setResponsavel] = useState("")

  useEffect(() => {
    if (reserva) {
      setSala(reserva.sala)
      setData(reserva.data)
      setHoraInicio(reserva.horaInicio)
      setHoraFim(reserva.horaFim)
      setResponsavel(reserva.responsavel)
    } else {
      setSala("")
      setData(undefined)
      setHoraInicio("")
      setHoraFim("")
      setResponsavel("")
    }
  }, [reserva])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar a reserva
    console.log("Salvando reserva:", {
      sala,
      data,
      horaInicio,
      horaFim,
      responsavel,
    })
    onClose()
  }

  const handleCancelar = () => {
    // Lógica para cancelar reserva
    console.log("Cancelando reserva:", reserva?.id)
    onClose()
  }

  const salas = [
    "Sala A101",
    "Sala A102",
    "Laboratório de Informática",
    "Laboratório de Química",
    "Auditório Principal",
    "Sala de Reuniões",
    "Biblioteca",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{reserva ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Sala</Label>
            <Select value={sala} onValueChange={setSala}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma sala" />
              </SelectTrigger>
              <SelectContent>
                {salas.map((salaOption) => (
                  <SelectItem key={salaOption} value={salaOption}>
                    {salaOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={data} onSelect={setData} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora de Início</Label>
              <Input
                id="horaInicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFim">Hora de Fim</Label>
              <Input id="horaFim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input id="responsavel" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} required />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {reserva && (
              <Button type="button" variant="destructive" onClick={handleCancelar}>
                Cancelar Reserva
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
