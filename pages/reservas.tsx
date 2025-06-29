"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ReservaModal from "@/components/reserva-modal"
import { apiAgendamento } from "@/lib/api"
import toast from "react-hot-toast"
import { format, addMonths, subMonths, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

// Interfaces
interface Reserva {
  id: string
  sala: { nome: string }
  salaId: string
  dataHoraInicio: string
  dataHoraFim: string
  status: "CONFIRMADA" | "PENDENTE" | "CANCELADA"
}

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null)

  const fetchReservas = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiAgendamento.get("/reservas")
      setReservas(response.data)
    } catch (error) {
      toast.error("Falha ao carregar reservas.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReservas()
  }, [fetchReservas])

  const bookedDays = useMemo(() => {
    return reservas
      .filter((r) => r.status === "CONFIRMADA" || r.status === "PENDENTE")
      .map((r) => new Date(r.dataHoraInicio))
  }, [reservas])

  const reservasParaDataSelecionada = useMemo(() => {
    if (!selectedDate) return []
    return reservas
      .filter((reserva) => isSameDay(new Date(reserva.dataHoraInicio), selectedDate))
      .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime())
  }, [reservas, selectedDate])

  const diaSeguinte = useMemo(() => {
    if (!selectedDate) return null
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay
  }, [selectedDate])

  const reservasParaDiaSeguinte = useMemo(() => {
    if (!diaSeguinte) return []
    return reservas
      .filter((reserva) => isSameDay(new Date(reserva.dataHoraInicio), diaSeguinte))
      .sort((a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime())
  }, [reservas, diaSeguinte])

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
        <span className="text-lg font-medium capitalize">{format(currentDate, "MMMM yy", { locale: ptBR })}</span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
        <div className="xl:col-span-2">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium capitalize">
                  {format(currentDate, "MMMM yy", { locale: ptBR })}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date)
                  }}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  locale={ptBR}
                  modifiers={{ booked: bookedDays }}
                  modifiersClassNames={{
                    booked: 'day-booked',
                  }}
                  footer={
                    <div className="flex items-center justify-center pt-4 text-sm text-slate-600 border-t">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>Dias com reservas</span>
                    </div>
                  }
                  className="mx-auto"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "hidden",
                    nav: "hidden",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-14 font-normal text-sm",
                    row: "flex w-full mt-2",
                    cell: "h-14 w-14 text-center text-base p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                    day_range_end: "day-range-end",
                    // Alteração aqui para garantir que a seleção seja visível
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                    day_today: "bg-accent text-accent-foreground rounded-md",
                    day_outside:
                      "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reservas para {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-slate-500 text-center py-4">Carregando...</p>
              ) : reservasParaDataSelecionada.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma reserva para esta data.</p>
              ) : (
                <div className="space-y-3">
                  {reservasParaDataSelecionada.map((reserva) => (
                    <div
                      key={reserva.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => handleEditReserva(reserva)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{reserva.sala.nome}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(reserva.dataHoraInicio), "HH:mm")} -{" "}
                            {format(new Date(reserva.dataHoraFim), "HH:mm")}
                          </p>
                        </div>
                        <Badge
                          variant={reserva.status === "CANCELADA" ? "destructive" : "default"}
                          className="text-xs capitalize"
                        >
                          {reserva.status.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reservas para {diaSeguinte ? format(diaSeguinte, "dd/MM/yyyy") : ""}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-slate-500 text-center py-4">Carregando...</p>
              ) : reservasParaDiaSeguinte.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma reserva para esta data.</p>
              ) : (
                <div className="space-y-3">
                  {reservasParaDiaSeguinte.map((reserva) => (
                    <div
                      key={reserva.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => handleEditReserva(reserva)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{reserva.sala.nome}</p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(reserva.dataHoraInicio), "HH:mm")} -{" "}
                            {format(new Date(reserva.dataHoraFim), "HH:mm")}
                          </p>
                        </div>
                        <Badge
                          variant={reserva.status === "CANCELADA" ? "destructive" : "default"}
                          className="text-xs capitalize"
                        >
                          {reserva.status.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ReservaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reserva={editingReserva}
        onSuccess={fetchReservas}
      />
    </div>
  )
}