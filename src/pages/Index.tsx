
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, FileText, Clock, Wrench, CheckCircle, ArrowRight, Search } from "lucide-react"
import { Link } from "react-router-dom"

const Index = () => {
  // Dados mockados para demonstração
  const faturamentoMensal = 15750.00
  const variacao = 12.5 // percentual em relação ao mês anterior
  const osFinalizadas = 28
  const osProntasRetirada = 5
  const osEmServico = 12
  const osAguardandoAprovacao = 8

  const faturamentoTrimestre = [
    { mes: "Mar", valor: 12300 },
    { mes: "Abr", valor: 14100 },
    { mes: "Mai", valor: 13950 },
    { mes: "Jun", valor: 15750 }
  ]

  const volumeDiario = [
    { dia: 1, total: 2 }, { dia: 2, total: 1 }, { dia: 3, total: 3 },
    { dia: 4, total: 0 }, { dia: 5, total: 4 }, { dia: 6, total: 2 },
    { dia: 7, total: 1 }, { dia: 8, total: 3 }, { dia: 9, total: 2 },
    { dia: 10, total: 5 }
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da Garagem Bike - Junho 2025</p>
      </div>

      {/* Desempenho Financeiro */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Desempenho Financeiro</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faturamento Mensal */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-foreground">Faturamento Mensal</span>
                <div className={`flex items-center gap-1 text-sm ${variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variacao >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(variacao)}%
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-brilliant-blue-600">
                  R$ {faturamentoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-muted-foreground text-sm">
                  {variacao >= 0 ? 'Aumento' : 'Diminuição'} de R$ {Math.abs((faturamentoMensal * variacao / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em relação ao mês anterior
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Tendência */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tendência Trimestral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faturamentoTrimestre.map((item, index) => (
                  <div key={item.mes} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.mes}/25</span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 bg-brilliant-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${(item.valor / Math.max(...faturamentoTrimestre.map(f => f.valor))) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      R$ {(item.valor / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Operações do Mês */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Operações do Mês</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Finalizadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{osFinalizadas}</div>
              <p className="text-xs text-muted-foreground mt-1">
                O.S. concluídas este mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Prontas para Retirada
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{osProntasRetirada}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Aguardando retirada
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Serviço
              </CardTitle>
              <Wrench className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{osEmServico}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sendo executadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aguardando Aprovação
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{osAguardandoAprovacao}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Pendentes de aprovação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Volume Diário e Botão de Acesso */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Volume de O.S. por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {volumeDiario.map((item) => (
                  <div key={item.dia} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="bg-brilliant-blue-500 rounded-t w-full transition-all duration-300 hover:bg-brilliant-blue-600"
                      style={{ height: `${(item.total / Math.max(...volumeDiario.map(v => v.total))) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">{item.dia}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/ordens-servico">
                <Button className="w-full bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Ordens de Serviço
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/clientes">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Gerenciar Clientes
                </Button>
              </Link>
              <Link to="/estoque">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Controlar Estoque
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
