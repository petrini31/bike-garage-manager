
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Plus, Edit, Trash2 } from "lucide-react"
import { useOrdensServico } from "@/hooks/useOrdensServico"
import { useMetasFaturamento } from "@/hooks/useMetasFaturamento"
import { useReceitasManuais } from "@/hooks/useReceitasManuais"
import { useGastos } from "@/hooks/useGastos"
import { useMetas, useDeleteMeta } from "@/hooks/useMetas"
import { ReceitaManualDialog } from "@/components/dialogs/ReceitaManualDialog"
import { MetaDialog } from "@/components/dialogs/MetaDialog"
import { GastoDialog } from "@/components/dialogs/GastoDialog"

const Faturamento = () => {
  const [periodo, setPeriodo] = useState("mes")
  const [categoriaFilter, setCategoriaFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [gastoDialogOpen, setGastoDialogOpen] = useState(false)

  const { data: metas } = useMetasFaturamento()
  const { data: ordensServico } = useOrdensServico()
  const { data: receitasManuais } = useReceitasManuais()
  const { data: gastos } = useGastos()
  const { data: metasCustom } = useMetas()
  const deleteMeta = useDeleteMeta()

  // Calculate real revenue from finalized orders
  const faturamentoReal = ordensServico
    ?.filter(os => os.status_os?.nome === "Finalizada")
    ?.reduce((total, os) => total + os.valor_final, 0) || 0

  // Combine all revenues (OS + manual)
  const totalReceitas = faturamentoReal + (receitasManuais?.reduce((total, receita) => total + receita.valor, 0) || 0)

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Receitas</CardTitle>
              <ReceitaManualDialog
                trigger={
                  <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Receita
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Receitas de Ordens de Serviço */}
                  {ordensServico
                    ?.filter(os => os.status_os?.nome === "Finalizada")
                    ?.map((os) => (
                      <TableRow key={`os-${os.id}`}>
                        <TableCell>{os.cliente_nome}</TableCell>
                        <TableCell>
                          {format(new Date(os.updated_at), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Ordem de Serviço</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          R$ {os.valor_final.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* Receitas Manuais */}
                  {receitasManuais?.map((receita) => (
                    <TableRow key={`receita-${receita.id}`}>
                      <TableCell>{receita.descricao}</TableCell>
                      <TableCell>
                        {format(new Date(receita.data), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Receita Manual</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        R$ {receita.valor.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {(!ordensServico?.length && !receitasManuais?.length) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhuma receita encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="space-y-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Gestão de Despesas</CardTitle>
              <Button 
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
                onClick={() => setGastoDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as categorias</SelectItem>
                    <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                    <SelectItem value="Funcionários">Funcionários</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabela de Despesas */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome/Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gastos
                    ?.filter(gasto => {
                      const categoriaMatch = categoriaFilter === "todos" || gasto.categoria === categoriaFilter
                      const statusMatch = statusFilter === "todos" || gasto.status === statusFilter
                      return categoriaMatch && statusMatch
                    })
                    ?.map((gasto) => (
                      <TableRow key={gasto.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{gasto.nome}</div>
                            {gasto.descricao && (
                              <div className="text-sm text-muted-foreground">{gasto.descricao}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{gasto.categoria}</Badge>
                        </TableCell>
                        <TableCell>
                          {gasto.data_vencimento 
                            ? format(new Date(gasto.data_vencimento), "dd/MM/yyyy", { locale: ptBR })
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              gasto.status === "Pago" ? "default" : 
                              gasto.status === "Vencido" ? "destructive" : "secondary"
                            }
                          >
                            {gasto.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          R$ {gasto.valor.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                  {!gastos?.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma despesa encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Metas e Projeções</CardTitle>
              <MetaDialog
                mode="create"
                trigger={
                  <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Meta
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {metasCustom?.map((meta) => {
                  const progresso = meta.valor_objetivo > 0 ? (meta.valor_atual / meta.valor_objetivo) * 100 : 0
                  
                  return (
                    <Card key={meta.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-foreground">{meta.nome}</h3>
                          <div className="flex gap-2">
                            <MetaDialog
                              mode="edit"
                              meta={meta}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteMeta.mutate(meta.id)}
                              disabled={deleteMeta.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {format(new Date(meta.data_inicio), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(meta.data_fim), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                            <span className="font-medium">
                              R$ {meta.valor_atual.toFixed(2)} / R$ {meta.valor_objetivo.toFixed(2)}
                            </span>
                          </div>
                          
                          <Progress value={Math.min(progresso, 100)} className="h-2" />
                          
                          <div className="text-xs text-muted-foreground">
                            {progresso.toFixed(1)}% da meta atingida
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {!metasCustom?.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma meta criada ainda.</p>
                    <p className="text-sm">Crie sua primeira meta para acompanhar o progresso.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <GastoDialog
        open={gastoDialogOpen}
        onOpenChange={setGastoDialogOpen}
      />
    </div>
  );
};

export default Faturamento;
