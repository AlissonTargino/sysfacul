// pages/reservas.tsx
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ReservaModal from "@/components/reserva-modal"
import { apiAgendamento } from "@/lib/api"
import toast from "react-hot-toast"
import { format, startOfMonth, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Reserva {
  id: string
  sala: { nome: string }; // Incluído pela API
  salaId: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  usuarioSolicitanteId: string;
  observacao: string | null;
  status: "CONFIRMADA" | "PENDENTE" | "CANCELADA";
}

export default function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [currentDate, setCurrentDate] = useState(new Date()) // Para navegação do mês
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null)

  const fetchReservas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiAgendamento.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      toast.error("Falha ao carregar reservas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const handleAddReserva = () => {
    setEditingReserva(null);
    setIsModalOpen(true);
  }

  const handleEditReserva = (reserva: Reserva) => {
    setEditingReserva(reserva);
    setIsModalOpen(true);
  }

  // Filtra as reservas para a data selecionada no calendário
  const reservasParaDataSelecionada = useMemo(() => {
    return reservas.filter(reserva => 
      new Date(reserva.dataHoraInicio).toDateString() === selectedDate.toDateString()
    ).sort((a,b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime());
  }, [reservas, selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Agenda de Reservas</h1>
        <Button onClick={handleAddReserva} className="flex items-center gap-2"><Plus className="h-4 w-4" />Nova Reserva</Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium capitalize">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="rounded-md"
                locale={ptBR}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Reservas para {format(selectedDate, "dd/MM/yyyy")}</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <p>Carregando...</p> : 
                reservasParaDataSelecionada.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhuma reserva para esta data.</p>
                ) : (
                  <div className="space-y-3">
                    {reservasParaDataSelecionada.map((reserva) => (
                      <div key={reserva.id} className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50" onClick={() => handleEditReserva(reserva)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{reserva.sala.nome}</p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(reserva.dataHoraInicio), 'HH:mm')} - {format(new Date(reserva.dataHoraFim), 'HH:mm')}
                            </p>
                          </div>
                          <Badge variant={reserva.status === "CANCELADA" ? "destructive" : "secondary"} className="text-xs">{reserva.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </CardContent>
          </Card>
        </div>
      </div>
      <ReservaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reserva={editingReserva} onSuccess={fetchReservas} />
    </div>
  )
}