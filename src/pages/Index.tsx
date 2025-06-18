
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Search, Edit } from "lucide-react"

const Index = () => {
  const stats = [
    {
      title: "O.S. Ativas",
      value: "12",
      description: "Ordens em andamento",
      icon: FileText,
      color: "text-brilliant-blue-600"
    },
    {
      title: "Agendamentos Hoje",
      value: "5",
      description: "Serviços programados",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Clientes Cadastrados",
      value: "234",
      description: "Base de clientes",
      icon: Search,
      color: "text-purple-600"
    },
    {
      title: "Itens em Estoque",
      value: "156",
      description: "Peças disponíveis",
      icon: Edit,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da Garagem Bike</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">O.S. Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">O.S. #{String(item).padStart(3, '0')}</p>
                    <p className="text-sm text-muted-foreground">Cliente: João Silva</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-brilliant-blue-600">Em Andamento</p>
                    <p className="text-xs text-muted-foreground">R$ 150,00</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Agenda do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "09:00", client: "Maria Santos", service: "Revisão completa" },
                { time: "10:30", client: "Pedro Costa", service: "Troca de pneu" },
                { time: "14:00", client: "Ana Lima", service: "Ajuste de freios" },
                { time: "15:30", client: "Carlos Oliveira", service: "Lubrificação corrente" },
                { time: "16:00", client: "Lucia Ferreira", service: "Regulagem de câmbio" }
              ].map((appointment, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                  <div className="bg-brilliant-blue-100 dark:bg-brilliant-blue-900 px-2 py-1 rounded text-xs font-medium text-brilliant-blue-700 dark:text-brilliant-blue-300">
                    {appointment.time}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
