
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from "lucide-react"
import { useOrdensServico } from "@/hooks/useOrdensServico"
import { useMetasFaturamento } from "@/hooks/useMetasFaturamento"

const Faturamento = () => {
  const [periodo, setPeriodo] = useState("mes")

  const { data: metas } = useMetasFaturamento()
  const { data: ordensServico } = useOrdensServico()

  // Calculate real revenue from finalized orders
  const faturamentoReal = ordensServico
    ?.filter(os => os.status_os?.nome === "Finalizada")
    ?.reduce((total, os) => total + os.valor_final, 0) || 0

  // Dados mockados para demonstração
  const faturamentoAtual = 15750.00
  const faturamentoAnterior = 14100.00
  const variacao = ((faturamentoAtual - faturamentoAnterior) / faturamentoAnterior) * 100

  const dadosPorPeriodo = {
    dia: [
      { periodo: "01/06", valor: 450 },
      { periodo: "02/06", valor: 320 },
      { periodo: "03/06", valor: 680 },
      { periodo: "04/06", valor: 0 },
      { periodo: "05/06", valor: 890 },
      { periodo: "06/06", valor: 1200 },
      { periodo: "07/06", valor: 760 }
    ],
    semana: [
      { periodo: "Sem 1", valor: 3450 },
      { periodo: "Sem 2", valor: 4200 },
      { periodo: "Sem 3", valor: 3890 },
      { periodo: "Sem 4", valor: 4210 }
    ],
    mes: [
      { periodo: "Jan", valor: 12300 },
      { periodo: "Fev", valor: 11800 },
      { periodo: "Mar", valor: 13200 },
      { periodo: "Abr", valor: 14100 },
      { periodo: "Mai", valor: 13950 },
      { periodo: "Jun", valor: 15750 }
    ],
    ano: [
      { periodo: "2022", valor: 145000 },
      { periodo: "2023", valor: 162000 },
      { periodo: "2024", valor: 178000 },
      { periodo: "2025", valor: 95000 }
    ]
  }

  const dadosAtuais = dadosPorPeriodo[periodo as keyof typeof dadosPorPeriodo]
  const maxValue = Math.max(...dadosAtuais.map(d => d.valor))

  const getPeriodicLabel = () => {
    switch(periodo) {
      case "dia": return "Últimos 7 dias"
      case "semana": return "Últimas 4 semanas"
      case "mes": return "Últimos 6 meses"
      case "ano": return "Últimos 4 anos"
      default: return "Período"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faturamento</h1>
          <p className="text-muted-foreground">Análise financeira detalhada</p>
        </div>
      </div>

      <Tabs defaultValue="resumo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="metas">Metas e Projeções</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-6">
          <div className="flex items-center justify-end">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Por Dia</SelectItem>
                <SelectItem value="semana">Por Semana</SelectItem>
                <SelectItem value="mes">Por Mês</SelectItem>
                <SelectItem value="ano">Por Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Faturamento Real
                </CardTitle>
                <DollarSign className="h-4 w-4 text-brilliant-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brilliant-blue-600">
                  R$ {faturamentoReal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  O.S. Finalizadas
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Variação
                </CardTitle>
                {variacao >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-600" /> : 
                  <TrendingDown className="h-4 w-4 text-red-600" />
                }
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Em relação ao período anterior
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Meta Mensal
                </CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  R$ {(metas?.meta_mensal || 18000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Meta definida
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Atingimento da Meta
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {((faturamentoReal / (metas?.meta_mensal || 18000)) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Da meta mensal
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico Principal */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Evolução do Faturamento - {getPeriodicLabel()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-80 flex items-end gap-4 px-4">
                  {dadosAtuais.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs font-medium text-foreground">
                        R$ {(item.valor / 1000).toFixed(1)}k
                      </div>
                      <div 
                        className="bg-brilliant-blue-500 rounded-t w-full transition-all duration-500 hover:bg-brilliant-blue-600 min-h-[20px]"
                        style={{ height: `${(item.valor / maxValue) * 250}px` }}
                      />
                      <span className="text-xs text-muted-foreground font-medium">{item.periodo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receitas" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Seção de Receitas</h3>
                <p>Esta seção será configurada em breve para mostrar toda a receita gerada com Ordens de Serviço finalizadas e demais receitas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Gestão de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Seção de Despesas</h3>
                <p>Esta seção será configurada para lançar todas as despesas da bicicletaria.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Metas e Projeções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Meta Mensal</span>
                      <span className="text-sm font-medium text-foreground">
                        R$ {(metas?.meta_mensal || 18000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-brilliant-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((faturamentoReal / (metas?.meta_mensal || 18000)) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {((faturamentoReal / (metas?.meta_mensal || 18000)) * 100).toFixed(1)}% da meta atingida
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Meta Anual</span>
                      <span className="text-sm font-medium text-foreground">
                        R$ {(metas?.meta_anual || 216000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Baseado na performance atual
                    </div>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground border-t">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Configurações avançadas de metas serão implementadas em breve.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Faturamento;
