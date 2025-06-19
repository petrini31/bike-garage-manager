import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Search, Plus, Filter, Calendar, Trash2, X, Eye, Zap } from "lucide-react"
import { useOrdensServico, useCreateOrdemServico, useOrdemServicoById } from "@/hooks/useOrdensServico"
import { useStatusOS } from "@/hooks/useStatusOS"
import { useClientes } from "@/hooks/useClientes"
import { useProdutos } from "@/hooks/useProdutos"
import { ProdutoSelectorDialog } from "@/components/dialogs/ProdutoSelectorDialog"
import { QuickStatusDialog } from "@/components/dialogs/QuickStatusDialog"
import { toast } from "@/hooks/use-toast"
import { OrdemServico, Cliente, Produto } from "@/types/database"
import { formatPhone, formatCPF } from "@/utils/formatters"

interface OSItem {
  id: number
  quantity: number
  description: string
  unitPrice: number
  discount: number
  total: number
  tipo: "produto" | "servico"
  sku?: string
  codigo_barras?: string
}

const OrdensServico = () => {
  const [showNewOS, setShowNewOS] = useState(false)
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null)
  const [viewingOS, setViewingOS] = useState<OrdemServico | null>(null)
  const [quickStatusOS, setQuickStatusOS] = useState<OrdemServico | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showClienteSearch, setShowClienteSearch] = useState(false)
  const [showProdutoSelector, setShowProdutoSelector] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  
  const [osItems, setOsItems] = useState<OSItem[]>([
    { id: 1, quantity: 1, description: "", unitPrice: 0, discount: 0, total: 0, tipo: "servico" }
  ])
  
  const [clienteData, setClienteData] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cpf_cnpj: ""
  })
  
  const [statusId, setStatusId] = useState("")
  const [observacoes, setObservacoes] = useState("")

  const { data: ordensServico, isLoading } = useOrdensServico()
  const { data: statusList } = useStatusOS()
  const { data: clientes } = useClientes()
  const createOS = useCreateOrdemServico()

  const filteredOrdens = ordensServico?.filter(ordem => {
    const matchesSearch = ordem.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.numero_os.toString().includes(searchTerm) ||
                         ordem.cliente_telefone?.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || ordem.status_os?.nome === statusFilter
    
    const matchesDate = !dateFilter || ordem.created_at.includes(dateFilter)
    
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "baixo" && ordem.valor_final < 100) ||
      (priceFilter === "medio" && ordem.valor_final >= 100 && ordem.valor_final < 500) ||
      (priceFilter === "alto" && ordem.valor_final >= 500)
    
    return matchesSearch && matchesStatus && matchesDate && matchesPrice
  }) || []

  const addItem = () => {
    const newItem: OSItem = {
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

  const removeItem = (id: number) => {
    if (osItems.length > 1) {
      setOsItems(osItems.filter(item => item.id !== id))
    }
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
    const enderecoArray = cliente.endereco?.split(", ") || []
    
    setClienteData({
      nome: cliente.nome,
      telefone: cliente.telefone || "",
      email: cliente.email || "",
      endereco: enderecoArray[0] || "",
      numero: enderecoArray[1] || "",
      bairro: enderecoArray[2] || "",
      cidade: enderecoArray[3] || "",
      estado: enderecoArray[4] || "",
      cpf_cnpj: cliente.cpf_cnpj || ""
    })
    setShowClienteSearch(false)
  }

  const selectProduto = (produto: Produto) => {
    if (selectedItemId) {
      updateItem(selectedItemId, 'description', produto.nome)
      updateItem(selectedItemId, 'unitPrice', produto.preco_venda || 0)
      updateItem(selectedItemId, 'sku', produto.sku || "")
      updateItem(selectedItemId, 'codigo_barras', produto.codigo_barras || "")
      updateItem(selectedItemId, 'tipo', 'produto')
    }
  }

  const handleClienteInputChange = (field: string, value: string) => {
    if (field === 'cpf_cnpj') {
      setClienteData(prev => ({ ...prev, [field]: formatCPF(value) }))
    } else if (field === 'telefone') {
      setClienteData(prev => ({ ...prev, [field]: formatPhone(value) }))
    } else {
      setClienteData(prev => ({ ...prev, [field]: value }))
    }
  }

  const calculateTotal = () => {
    return osItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleCreateOS = () => {
    const defaultStatusId = statusList?.[0]?.id || ""
    
    const enderecoCompleto = [
      clienteData.endereco,
      clienteData.numero,
      clienteData.bairro,
      clienteData.cidade,
      clienteData.estado
    ].filter(Boolean).join(", ")

    const osData = {
      cliente_nome: clienteData.nome,
      cliente_telefone: clienteData.telefone,
      cliente_endereco: enderecoCompleto,
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
        setClienteData({ nome: "", telefone: "", email: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "", cpf_cnpj: "" })
        setObservacoes("")
        setStatusId("")
      }
    })
  }

  const getStatusColor = (status?: string) => {
    const statusObj = statusList?.find(s => s.nome === status)
    return statusObj ? { backgroundColor: statusObj.cor + "20", color: statusObj.cor } : {}
  }

  const handleEditOS = (ordem: OrdemServico) => {
    setEditingOS(ordem)
    // Logic to populate form with existing data would go here
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de O.S. será implementada em breve."
    })
  }

  const handleViewOS = (ordem: OrdemServico) => {
    setViewingOS(ordem)
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "A visualização detalhada de O.S. será implementada em breve."
    })
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
            <div className="space-y-4">
              <div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="cliente">Nome do Cliente *</Label>
                    <Input 
                      id="cliente" 
                      placeholder="Digite o nome do cliente"
                      value={clienteData.nome}
                      onChange={(e) => handleClienteInputChange('nome', e.target.value)}
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
                    <div className="space-y-2">
                      {clientes?.slice(0, 5).map((cliente) => (
                        <button
                          key={cliente.id}
                          type="button"
                          className="w-full text-left p-3 hover:bg-background rounded border border-border transition-colors"
                          onClick={() => selectCliente(cliente)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-foreground">{cliente.nome}</p>
                              <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                              {cliente.cpf_cnpj && (
                                <p className="text-xs text-muted-foreground">CPF/CNPJ: {cliente.cpf_cnpj}</p>
                              )}
                            </div>
                            {cliente.endereco && (
                              <p className="text-xs text-muted-foreground max-w-[200px]">
                                {cliente.endereco.length > 30 ? cliente.endereco.substring(0, 30) + "..." : cliente.endereco}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(xx) xxxxx-xxxx"
                    value={clienteData.telefone}
                    onChange={(e) => handleClienteInputChange('telefone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="cliente@email.com"
                    value={clienteData.email}
                    onChange={(e) => handleClienteInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="documento">CPF/CNPJ</Label>
                <Input 
                  id="documento" 
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={clienteData.cpf_cnpj}
                  onChange={(e) => handleClienteInputChange('cpf_cnpj', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">Endereço</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Logradouro</Label>
                    <Input
                      id="endereco"
                      value={clienteData.endereco}
                      onChange={(e) => handleClienteInputChange('endereco', e.target.value)}
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={clienteData.numero}
                      onChange={(e) => handleClienteInputChange('numero', e.target.value)}
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={clienteData.bairro}
                      onChange={(e) => handleClienteInputChange('bairro', e.target.value)}
                      placeholder="Centro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={clienteData.cidade}
                      onChange={(e) => handleClienteInputChange('cidade', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={clienteData.estado}
                      onChange={(e) => handleClienteInputChange('estado', e.target.value)}
                      placeholder="SP"
                    />
                  </div>
                </div>
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
                      <th className="border border-border p-2 text-left">SKU</th>
                      <th className="border border-border p-2 text-left">Código</th>
                      <th className="border border-border p-2 text-left">Preço Unit. (R$)</th>
                      <th className="border border-border p-2 text-left">Desconto (R$)</th>
                      <th className="border border-border p-2 text-left">Total (R$)</th>
                      <th className="border border-border p-2 text-left">Ações</th>
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
                                  setSelectedItemId(item.id)
                                  setShowProdutoSelector(true)
                                }}
                              >
                                <Search className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="border border-border p-2">
                          {item.tipo === 'produto' && (
                            <Input
                              value={item.sku || ""}
                              onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                              placeholder="SKU"
                              className="w-20"
                            />
                          )}
                        </td>
                        <td className="border border-border p-2">
                          {item.tipo === 'produto' && (
                            <Input
                              value={item.codigo_barras || ""}
                              onChange={(e) => updateItem(item.id, 'codigo_barras', e.target.value)}
                              placeholder="Código"
                              className="w-24"
                            />
                          )}
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
                        <td className="border border-border p-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={osItems.length === 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
                  <Plus className="mr-2 h-4 w-4" />
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

        <ProdutoSelectorDialog
          open={showProdutoSelector}
          onOpenChange={setShowProdutoSelector}
          onSelectProduto={selectProduto}
        />
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
                    <SelectItem value="all">Todos os status</SelectItem>
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
                    <SelectItem value="all">Todas as faixas</SelectItem>
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
                    setStatusFilter("all")
                    setDateFilter("")
                    setPriceFilter("all")
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
                {searchTerm || statusFilter !== "all" || dateFilter || priceFilter !== "all" ? "Nenhuma O.S. encontrada." : "Nenhuma ordem de serviço cadastrada."}
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
                    <div className="flex items-center gap-2">
                      <Badge 
                        style={getStatusColor(ordem.status_os?.nome)}
                        className="cursor-pointer"
                        onClick={() => setQuickStatusOS(ordem)}
                      >
                        {ordem.status_os?.nome || "Sem Status"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuickStatusOS(ordem)}
                        className="p-1 h-6 w-6"
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-bold text-foreground">R$ {ordem.valor_final.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditOS(ordem)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewOS(ordem)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <QuickStatusDialog
        open={!!quickStatusOS}
        onOpenChange={(open) => !open && setQuickStatusOS(null)}
        ordem={quickStatusOS}
      />
    </div>
  );
};

export default OrdensServico;
