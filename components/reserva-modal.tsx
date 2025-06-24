"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useAuth } from "@/context/AuthContext"
import { apiAgendamento } from "@/lib/api"
import toast from "react-hot-toast"

// Interface para os dados da nossa API
interface Reserva {
  id: string
  salaId: string
  dataHoraInicio: string
  dataHoraFim: string
  observacao: string | null
  status: "CONFIRMADA" | "PENDENTE" | "CANCELADA"
}
interface Sala {
  id: string;
  nome: string;
}
interface ReservaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  reserva?: Reserva | null
}

export default function ReservaModal({ isOpen, onClose, reserva, onSuccess }: ReservaModalProps) {
  const { user } = useAuth(); // Pega o usuário logado do contexto

  // Estados do formulário
  const [salaId, setSalaId] = useState("")
  const [data, setData] = useState<Date | undefined>()
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFim, setHoraFim] = useState("")
  const [observacao, setObservacao] = useState("")
  const [salas, setSalas] = useState<Sala[]>([])
  
  // Estados de controle da UI
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Busca as salas da API para popular o dropdown
  useEffect(() => {
    if (isOpen) {
      apiAgendamento.get('/salas')
        .then(response => {
          setSalas(response.data)
        })
        .catch(() => {
          toast.error("Falha ao carregar salas disponíveis.");
        });
    }
  }, [isOpen]);

  // Preenche o formulário se estivermos editando uma reserva
  useEffect(() => {
    if (reserva && isOpen) {
      const inicio = new Date(reserva.dataHoraInicio);
      const fim = new Date(reserva.dataHoraFim);
      setSalaId(reserva.salaId);
      setData(inicio);
      setHoraInicio(format(inicio, "HH:mm"));
      setHoraFim(format(fim, "HH:mm"));
      setObservacao(reserva.observacao || "");
    } else {
      // Limpa o formulário para uma nova reserva
      setSalaId("");
      setData(new Date());
      setHoraInicio("");
      setHoraFim("");
      setObservacao("");
      setFormError(null);
    }
  }, [reserva, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    if (!data || !horaInicio || !horaFim || !salaId || !user) {
        setFormError("Todos os campos de data, hora e sala são obrigatórios.");
        setIsLoading(false);
        return;
    }

    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const dataHoraInicio = new Date(data);
    dataHoraInicio.setHours(hInicio, mInicio, 0, 0);

    const [hFim, mFim] = horaFim.split(':').map(Number);
    const dataHoraFim = new Date(data);
    dataHoraFim.setHours(hFim, mFim, 0, 0);

    if (dataHoraInicio >= dataHoraFim) {
        setFormError("O horário de início deve ser anterior ao de fim.");
        setIsLoading(false);
        return;
    }

    const reservaData = {
      salaId,
      usuarioSolicitanteId: user.id,
      dataHoraInicio: dataHoraInicio.toISOString(),
      dataHoraFim: dataHoraFim.toISOString(),
      observacao,
    };

    try {
      const promise = reserva
        ? apiAgendamento.put(`/reservas/${reserva.id}`, reservaData)
        : apiAgendamento.post('/reservas', reservaData);

      await toast.promise(promise, {
        loading: 'Salvando...',
        success: `Reserva ${reserva ? 'atualizada' : 'criada'} com sucesso!`,
        error: (err) => err.response?.data?.error || 'Erro ao salvar a reserva.'
      });
      
      onSuccess(); 
      onClose();  
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Ocorreu um erro inesperado.";
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelarReserva = async () => {
    if (!reserva) return;

    // Usando o AlertDialog seria melhor, mas window.confirm é mais simples para o exemplo
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
        const promise = apiAgendamento.delete(`/reservas/${reserva.id}`);
        
        toast.promise(promise, {
            loading: 'Cancelando...',
            success: () => {
                onSuccess();
                onClose();
                return 'Reserva cancelada com sucesso!';
            },
            error: 'Erro ao cancelar a reserva.'
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{reserva ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Sala</Label>
            <Select value={salaId} onValueChange={setSalaId} required disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Selecione uma sala" /></SelectTrigger>
              <SelectContent>
                {salas.map((s) => (<SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isLoading}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={data} onSelect={setData} initialFocus /></PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora de Início</Label>
              <Input id="horaInicio" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaFim">Hora de Fim</Label>
              <Input id="horaFim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required disabled={isLoading} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacao">Observações (opcional)</Label>
            <Textarea id="observacao" value={observacao} onChange={(e) => setObservacao(e.target.value)} disabled={isLoading} />
          </div>

          {formError && (
            <div className="text-sm text-center font-medium text-red-600 bg-red-100 p-3 rounded-md border border-red-200">
              {formError}
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <div>
              {reserva && (<Button type="button" variant="destructive" onClick={handleCancelarReserva} disabled={isLoading}>Cancelar Reserva</Button>)}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Fechar</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {reserva ? 'Salvar Alterações' : 'Confirmar Reserva'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}