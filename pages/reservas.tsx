"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ReservaModal from "@/components/reserva-modal"

interface Reserva {
  id: string
  sala: string
  data: Date
  horaInicio: string
  horaFim: string
  responsavel: string
  status: "Confirmada" | "Pendente" | "Cancelada"
}

export default function Reservas() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null)

  const [reservas] = useState<Reserva[]>([
    {
      id: "1",
      sala: "Sala A101",
      data: new Date(),
      horaInicio: "14:00",
      horaFim: "16:00",
      responsavel: "Prof. Maria Silva",
      status: "Confirmada",
    },
    {
      id: "2",
      sala: "Laboratório de Informática",
      data: new Date(Date.now() + 86400000), // Amanhã
      horaInicio: "08:00",
      horaFim: "12:00",
      responsavel: "Prof. João Santos",
      status: "Confirmada",
    },
    {
      id: "3",
      sala: "Auditório Principal",
      data: new Date(Date.now() + 172800000), // Depois de amanhã
      horaInicio: "19:00",
      horaFim: "22:00",
      responsavel: "Coordenação",
      status: "Pendente",
    },
  ])

  const today = new Date()
  const currentMonth = today.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  const reservasHoje = reservas.filter((reserva) => reserva.data.toDateString() === today.toDateString())

  const proximasReservas = reservas.filter((reserva) => reserva.data >= today).slice(0, 5)

  const handleAddReserva = () => {
    setEditingReserva(null)
    setIsModalOpen(true)
  }

  const handleEditReserva = (reserva: Reserva) => {
    setEditingReserva(reserva)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Agenda de Reservas</h1>
        <Button onClick={handleAddReserva} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Reserva
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "month" ? "default" : "outline"} size="sm" onClick={() => setViewMode("month")}>
            Mês
          </Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
            Semana
          </Button>
          <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
            Dia
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize">{currentMonth}</span>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            Hoje
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reservas de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {reservasHoje.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma reserva para hoje</p>
              ) : (
                <div className="space-y-3">
                  {reservasHoje.map((reserva) => (
                    <div
                      key={reserva.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
                      onClick={() => handleEditReserva(reserva)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{reserva.sala}</p>
                          <p className="text-xs text-slate-500">
                            {reserva.horaInicio} - {reserva.horaFim}
                          </p>
                          <p className="text-xs text-slate-500">{reserva.responsavel}</p>
                        </div>
                        <Badge variant={reserva.status === "Confirmada" ? "default" : "secondary"} className="text-xs">
                          {reserva.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {proximasReservas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
                    onClick={() => handleEditReserva(reserva)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{reserva.sala}</p>
                        <p className="text-xs text-slate-500">
                          {reserva.data.toLocaleDateString("pt-BR")} • {reserva.horaInicio} - {reserva.horaFim}
                        </p>
                        <p className="text-xs text-slate-500">{reserva.responsavel}</p>
                      </div>
                      <Badge variant={reserva.status === "Confirmada" ? "default" : "secondary"} className="text-xs">
                        {reserva.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReservaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reserva={editingReserva} />
    </div>
  )
}
