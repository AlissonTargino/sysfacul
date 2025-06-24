"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, DoorOpen, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const name = localStorage.getItem("user-name") || "Usuário"
    setUserName(name)
  }, [])

  const stats = [
    {
      title: "Recursos Cadastrados",
      value: "128",
      icon: Archive,
      color: "text-blue-600",
    },
    {
      title: "Salas Disponíveis",
      value: "12",
      icon: DoorOpen,
      color: "text-green-600",
    },
    {
      title: "Reservas para Hoje",
      value: "5",
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Bem-vindo, {userName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova reserva criada</p>
                  <p className="text-xs text-slate-500">Sala A101 - 14:00-16:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Recurso adicionado</p>
                  <p className="text-xs text-slate-500">Projetor Epson X450</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sala liberada</p>
                  <p className="text-xs text-slate-500">Laboratório 203</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Sala A101</p>
                  <p className="text-xs text-slate-500">14:00 - 16:00</p>
                </div>
                <div className="text-xs text-slate-500">Hoje</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Lab. Informática</p>
                  <p className="text-xs text-slate-500">08:00 - 12:00</p>
                </div>
                <div className="text-xs text-slate-500">Amanhã</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Auditório</p>
                  <p className="text-xs text-slate-500">19:00 - 22:00</p>
                </div>
                <div className="text-xs text-slate-500">Sexta</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
