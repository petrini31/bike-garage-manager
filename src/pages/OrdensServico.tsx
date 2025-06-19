import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Search, Plus, Filter, Calendar } from "lucide-react"
import { useOrdensServico, useStatusOS, useCreateOrdemServico } from "@/hooks/useOrdensServico"
import { useClientes } from "@/hooks/useClientes"
import { useProdutos } from "@/hooks/useProdutos"
import { toast } from "@/hooks/use-toast"
import { OrdemServico, Cliente, Produto } from "@/types/database"

const OrdensServico = () => {
  const [showNewOS, setShowNewOS] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showClienteSearch, setShowClienteSearch] = useState(false)
  
  const [osItems, setOsItems] = useState([
    { id: 1, quantity: 1, description: "", unitPrice: 0, discount: 0, total: 0, tipo: "servico" }
  ])
  
  const [clienteData, setClienteData] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    cpf_cnpj: ""
  })
  
  const [statusId, setStatusId] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const { data: ordensServico, isLoading } = useOrdensServico()
  const { data: statusList } = useStatusOS()
  const { data: clientes } = useClientes()
  const { data: produtos } = useProdutos()
  const createOS = useCreateOrdemServico()

  const filteredOrdens = ordensServico?.filter(ordem => {
    const matchesSearch = ordem.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.numero_os.toString().includes(searchTerm) ||
                         ordem.cliente_telefone?.includes(searchTerm)
    
    const matchesStatus = !statusFilter || ordem.status_os?.nome === statusFilter
    
    const matchesDate = !dateFilter || ordem.created_at.includes(dateFilter)
    
    const matchesPrice = !priceFilter || 
      (priceFilter === "baixo" && ordem.valor_final < 100) ||
      (priceFilter === "medio" && ordem.valor_final >= 100 && ordem.valor_final < 500) ||
      (priceFilter === "alto" && ordem.valor_final >= 500)
    
    return matchesSearch && matchesStatus && matchesDate && matchesPrice
  }) || []

  const addItem = () => {
    const newItem = {
      id: osItems.length + 1,
      quantity: 1,
      description: "",
      unitPrice: 0,
      discount: 0,
      total: 0,
      tipo: "servico"
    }
    setOsItems([...osItems, newItem])
  }

  const updateItem = (id: number, field: string, value: any) => {
    setOsItems(osItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          updatedItem.total = (updatedItem.quantity * updatedItem.unitPrice) - updatedItem.discount
        }
        return updatedItem
      }
      return item
    }))
  }

  const selectCliente = (cliente: Cliente) => {
    setClienteData({
      nome: cliente.nome,
      telefone: cliente.telefone || "",
      endereco: cliente.endereco || "",
      cpf_cnpj: cliente.cpf_cnpj || ""
    })
    setShowClienteSearch(false)
  }

  const selectProduto = (itemId: number, produto: Produto) => {
    updateItem(itemId, 'description', produto.nome)
    updateItem(itemId, 'unitPrice', produto.preco_venda || 0)
    updateItem(itemId, 'tipo', 'produto')
  }

  const calculateTotal = () => {
    return osItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleCreateOS = () => {
    const defaultStatusId = statusList?.[0]?.id || ""
    
    const osData = {
      cliente_nome: clienteData.nome,
      cliente_telefone: clienteData.telefone,
      cliente_endereco: clienteData.endereco,
      cliente_cpf_cnpj: clienteData.cpf_cnpj,
      status_id: statusId || defaultStatusId,
      valor_total: calculateTotal(),
      valor_final: calculateTotal(),
      observacoes
    }

    const itensData = osItems.map((item, index) => ({
      numero_item: index + 1,
      quantidade: item.quantity,
      descricao: item.description,
      preco_unitario: item.unitPrice,
      desconto: item.discount || 0,
      total: item.total
    }))

    createOS.mutate({ os: osData, itens: itensData }, {
      onSuccess: () => {
        setShowNewOS(false)
        setOsItems([{ id: 1, quantity: 1, description: "", unitPrice: 0, discount: 0, total: 0, tipo: "servico" }])
        setClienteData({ nome: "", telefone: "", endereco: "", cpf_cnpj: "" })
        setObservacoes("")
        setStatusId("")
      }
    })
  }

  const getStatusColor = (status?: string) => {
    const statusObj = statusList?.find(s => s.nome === status)
    return statusObj ? { backgroundColor: statusObj.cor + "20", color: statusObj.cor } : {}
  }

  if (showNewOS) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nova Ordem de Serviço</h1>
            <p className="text-muted-foreground">Preencha os dados da nova O.S.</p>
          </div>
          <Button variant="outline" onClick={() => setShowNewOS(false)}>
            Voltar
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader className="bg-brilliant-blue-50 dark:bg-brilliant-blue-900/20">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-brilliant-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GB</span>
              </div>
              <div>
                <CardTitle className="text-2xl text-brilliant-blue-700 dark:text-brilliant-blue-300">ORDEM DE SERVIÇO</CardTitle>
                <p className="text-brilliant-blue-600 dark:text-brilliant-blue-400">Nova O.S.</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor="cliente">Nome do Cliente *</Label>
                      <Input 
                        id="cliente" 
                        placeholder="Digite o nome do cliente"
                        value={clienteData.nome}
                        onChange={(e) => setClienteData(prev => ({ ...prev, nome: e.target.value }))}
                      />
                    </div>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setShowClienteSearch(!showClienteSearch)}
                      className="mb-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showClienteSearch && (
                    <div className="mt-2 border rounded-lg p-3 bg-muted/50 max-h-48 overflow-y-auto">
                      <Input 
                        placeholder="Buscar cliente..."
                        className="mb-2"
                        onChange={(e) => {
                          // Filtrar clientes conforme digitação
                        }}
                      />
                      <div className="space-y-1">
                        {clientes?.slice(0, 5).map((cliente) => (
                          <button
                            key={cliente.id}
                            type="button"
                            className="w-full text-left p-2 hover:bg-background rounded text-sm"
                            onClick={() => selectCliente(cliente)}
                          >
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-muted-foreground text-xs">{cliente.telefone}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input 
                    id="endereco" 
                    placeholder="Endereço completo"
                    value={clienteData.endereco}
                    onChange={(e) => setClienteData(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(xx) xxxxx-xxxx"
                    value={clienteData.telefone}
                    onChange={(e) => setClienteData(prev => ({ ...prev, telefone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documento">CPF/CNPJ</Label>
                  <Input 
                    id="documento" 
                    placeholder="000.000.000-00"
                    value={clienteData.cpf_cnpj}
                    onChange={(e) => setClienteData(prev => ({ ...prev, cpf_cnpj: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusId} onValueChange={setStatusId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusList?.map((status) => (
                        <SelectItem key={status.id} value={status.id}>
                          {status.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Itens da Ordem de Serviço</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">#</th>
                      <th className="border border-border p-2 text-left">Tipo</th>
                      <th className="border border-border p-2 text-left">Qtd</th>
                      <th className="border border-border p-2 text-left">Descrição</th>
                      <th className="border border-border p-2 text-left">Preço Unit. (R$)</th>
                      <th className="border border-border p-2 text-left">Desconto (R$)</th>
                      <th className="border border-border p-2 text-left">Total (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {osItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-border p-2">
                          {String(item.id).padStart(3, '0')}
                        </td>
                        <td className="border border-border p-2">
                          <Select value={item.tipo} onValueChange={(value) => updateItem(item.id, 'tipo', value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="produto">Produto</SelectItem>
                              <SelectItem value="servico">Serviço</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16"
                            min="1"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <div className="flex gap-1">
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder={item.tipo === 'produto' ? "Nome do produto" : "Descrição do serviço"}
                              className="min-w-[200px]"
                            />
                            {item.tipo === 'produto' && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Abrir modal de seleção de produtos
                                }}
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                            className="w-24"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="border border-border p-2 font-medium">
                          R$ {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  onClick={addItem} 
                  className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
                >
                  Adicionar Item
                </Button>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    Valor Total: R$ {calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais sobre a ordem de serviço..."
                rows={4}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setShowNewOS(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateOS} 
                disabled={!clienteData.nome || createOS.isPending}
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
              >
                Criar O.S.
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando ordens de serviço...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie todas as ordens de serviço</p>
        </div>
        <Button onClick={() => setShowNewOS(true)} className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
          <FileText className="mr-2 h-4 w-4" />
          Nova O.S.
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Lista de Ordens de Serviço</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por cliente, nº O.S. ou telefone..." 
                className="w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    {statusList?.map((status) => (
                      <SelectItem key={status.id} value={status.nome}>
                        {status.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Data</Label>
                <Input 
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Faixa de Preço</Label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as faixas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as faixas</SelectItem>
                    <SelectItem value="baixo">Até R$ 100</SelectItem>
                    <SelectItem value="medio">R$ 100 - R$ 500</SelectItem>
                    <SelectItem value="alto">Acima de R$ 500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter("")
                    setDateFilter("")
                    setPriceFilter("")
                    setSearchTerm("")
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrdens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter || dateFilter || priceFilter ? "Nenhuma O.S. encontrada." : "Nenhuma ordem de serviço cadastrada."}
              </div>
            ) : (
              filteredOrdens.map((ordem) => (
                <div key={ordem.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-brilliant-blue-100 dark:bg-brilliant-blue-900 px-3 py-2 rounded-lg">
                      <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300">
                        Nº {String(ordem.numero_os).padStart(3, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{ordem.cliente_nome}</p>
                      <p className="text-lg font-bold text-brilliant-blue-600">{ordem.cliente_telefone}</p>
                      <p className="text-sm font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {new Date(ordem.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge style={getStatusColor(ordem.status_os?.nome)}>
                      {ordem.status_os?.nome || "Sem Status"}
                    </Badge>
                    <p className="font-bold text-foreground">R$ {ordem.valor_final.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdensServico;
