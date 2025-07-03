import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useClientes } from "@/hooks/useClientes"
import { useStatusOS } from "@/hooks/useStatusOS"
import { useProdutos } from "@/hooks/useProdutos"
import { useCreateOrdemServico, useUpdateOrdemServico, useOrdemServicoById } from "@/hooks/useOrdensServico"
import { OrdemServico, OSItem } from "@/types/database"
import { Plus, X, Search, UserPlus } from "lucide-react"
import { ClienteQuickSave } from "@/components/ClienteQuickSave"
import { ClienteDialog } from "@/components/dialogs/ClienteDialog"

interface OSDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ordem?: OrdemServico | null
  mode: "create" | "edit" | "view"
}

export function OSDialog({ open, onOpenChange, ordem, mode }: OSDialogProps) {
  const [clienteNome, setClienteNome] = useState("")
  const [clienteTelefone, setClienteTelefone] = useState("")
  const [clienteEndereco, setClienteEndereco] = useState("")
  const [clienteCpfCnpj, setClienteCpfCnpj] = useState("")
  const [statusId, setStatusId] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [itens, setItens] = useState<Omit<OSItem, "id" | "os_id" | "created_at">[]>([])
  const [descontoTotal, setDescontoTotal] = useState(0)
  const [showQuickSave, setShowQuickSave] = useState(false)
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false)
  const [isManualEntry, setIsManualEntry] = useState(false)

  const { data: clientes } = useClientes()
  const { data: statusList } = useStatusOS()
  const { data: produtos } = useProdutos()
  const { data: osData } = useOrdemServicoById(ordem?.id || "")
  const createOS = useCreateOrdemServico()
  const updateOS = useUpdateOrdemServico()

  const isReadOnly = mode === "view"
  const isEdit = mode === "edit"
  const title = mode === "create" ? "Nova Ordem de Serviço" : 
                mode === "edit" ? "Editar Ordem de Serviço" : 
                "Visualizar Ordem de Serviço"

  useEffect(() => {
    if (isEdit && osData) {
      setClienteNome(osData.cliente_nome || "")
      setClienteTelefone(osData.cliente_telefone || "")
      setClienteEndereco(osData.cliente_endereco || "")
      setClienteCpfCnpj(osData.cliente_cpf_cnpj || "")
      setStatusId(osData.status_id || "")
      setObservacoes(osData.observacoes || "")
      setDescontoTotal(osData.desconto_total || 0)
      
      if (osData.os_itens) {
        setItens(osData.os_itens.map(item => ({
          numero_item: item.numero_item,
          quantidade: item.quantidade,
          descricao: item.descricao,
          preco_unitario: item.preco_unitario,
          desconto: item.desconto || 0,
          total: item.total
        })))
      }
    } else if (mode === "view" && osData) {
      setClienteNome(osData.cliente_nome || "")
      setClienteTelefone(osData.cliente_telefone || "")
      setClienteEndereco(osData.cliente_endereco || "")
      setClienteCpfCnpj(osData.cliente_cpf_cnpj || "")
      setStatusId(osData.status_id || "")
      setObservacoes(osData.observacoes || "")
      setDescontoTotal(osData.desconto_total || 0)
      
      if (osData.os_itens) {
        setItens(osData.os_itens.map(item => ({
          numero_item: item.numero_item,
          quantidade: item.quantidade,
          descricao: item.descricao,
          preco_unitario: item.preco_unitario,
          desconto: item.desconto || 0,
          total: item.total
        })))
      }
    } else {
      // Reset for create mode
      setClienteNome("")
      setClienteTelefone("")
      setClienteEndereco("")
      setClienteCpfCnpj("")
      setStatusId("")
      setObservacoes("")
      setDescontoTotal(0)
      setItens([{ numero_item: 1, quantidade: 1, descricao: "", preco_unitario: 0, desconto: 0, total: 0 }])
      setIsManualEntry(false)
      setShowQuickSave(false)
    }
  }, [mode, osData, open])

  const handleClienteNomeChange = (value: string) => {
    setClienteNome(value)
    
    // Se o usuário está digitando manualmente e não selecionou um cliente da lista
    if (isManualEntry && value.trim() && !showQuickSave) {
      // Delay para mostrar a sugestão após o usuário parar de digitar
      setTimeout(() => {
        if (clienteNome.trim() && clienteTelefone.trim()) {
          setShowQuickSave(true)
        }
      }, 1500)
    }
  }

  const handleClienteTelefoneChange = (value: string) => {
    setClienteTelefone(value)
    
    // Se já tem nome e agora tem telefone, mostrar sugestão
    if (isManualEntry && clienteNome.trim() && value.trim() && !showQuickSave) {
      setTimeout(() => {
        setShowQuickSave(true)
      }, 500)
    }
  }

  const handleClienteSelect = (clienteNome: string) => {
    const cliente = clientes?.find(c => c.nome === clienteNome)
    if (cliente) {
      setClienteNome(cliente.nome)
      setClienteTelefone(cliente.telefone || "")
      setClienteEndereco(cliente.endereco || "")
      setClienteCpfCnpj(cliente.cpf_cnpj || "")
      setIsManualEntry(false)
      setShowQuickSave(false)
    } else {
      setClienteNome(clienteNome)
      setIsManualEntry(true)
    }
  }

  const addItem = () => {
    const nextNumber = itens.length + 1
    setItens([...itens, { 
      numero_item: nextNumber, 
      quantidade: 1, 
      descricao: "", 
      preco_unitario: 0, 
      desconto: 0, 
      total: 0 
    }])
  }

  const removeItem = (index: number) => {
    const newItens = itens.filter((_, i) => i !== index)
    const reindexedItens = newItens.map((item, i) => ({ ...item, numero_item: i + 1 }))
    setItens(reindexedItens)
  }

  const updateItem = (index: number, field: keyof OSItem, value: any) => {
    const newItens = [...itens]
    newItens[index] = { ...newItens[index], [field]: value }
    
    if (field === "quantidade" || field === "preco_unitario" || field === "desconto") {
      const quantidade = field === "quantidade" ? value : newItens[index].quantidade
      const precoUnitario = field === "preco_unitario" ? value : newItens[index].preco_unitario
      const desconto = field === "desconto" ? value : newItens[index].desconto
      newItens[index].total = (quantidade * precoUnitario) - desconto
    }
    
    setItens(newItens)
  }

  const selectProduto = (index: number, produtoId: string) => {
    const produto = produtos?.find(p => p.id === produtoId)
    if (produto) {
      updateItem(index, "descricao", produto.nome)
      let descricao = produto.nome
      if (produto.sku) descricao += ` (SKU: ${produto.sku})`
      if (produto.codigo_barras) descricao += ` (Código: ${produto.codigo_barras})`
      updateItem(index, "descricao", descricao)
      updateItem(index, "preco_unitario", produto.preco_venda || 0)
    }
  }

  const valorTotal = itens.reduce((sum, item) => sum + item.total, 0)
  const valorFinal = valorTotal - descontoTotal

  const handleSave = () => {
    if (mode === "create") {
      createOS.mutate({
        os: {
          cliente_nome: clienteNome,
          cliente_telefone: clienteTelefone,
          cliente_endereco: clienteEndereco,
          cliente_cpf_cnpj: clienteCpfCnpj,
          status_id: statusId,
          valor_total: valorTotal,
          desconto_total: descontoTotal,
          valor_final: valorFinal,
          observacoes: observacoes
        },
        itens
      }, {
        onSuccess: () => onOpenChange(false)
      })
    } else if (mode === "edit" && ordem) {
      updateOS.mutate({
        id: ordem.id,
        cliente_nome: clienteNome,
        cliente_telefone: clienteTelefone,
        cliente_endereco: clienteEndereco,
        cliente_cpf_cnpj: clienteCpfCnpj,
        status_id: statusId,
        valor_total: valorTotal,
        desconto_total: descontoTotal,
        valor_final: valorFinal,
        observacoes: observacoes
      }, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Cliente Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente">Cliente *</Label>
                <div className="flex gap-2">
                  {!isReadOnly ? (
                    <>
                      <Select value={clienteNome} onValueChange={handleClienteSelect}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione ou digite o nome" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes?.filter(cliente => cliente.nome?.trim()).map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.nome}>
                              <div className="flex flex-col">
                                <span className="font-medium">{cliente.nome}</span>
                                <span className="text-sm text-muted-foreground">
                                  {cliente.telefone && `Tel: ${cliente.telefone}`}
                                  {cliente.cpf_cnpj && ` • CPF/CNPJ: ${cliente.cpf_cnpj}`}
                                </span>
                                {cliente.endereco && (
                                  <span className="text-xs text-muted-foreground">{cliente.endereco}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input 
                        placeholder="Ou digite manualmente"
                        value={clienteNome}
                        onChange={(e) => {
                          handleClienteNomeChange(e.target.value)
                          setIsManualEntry(true)
                        }}
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={() => setClienteDialogOpen(true)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Input value={clienteNome} readOnly className="bg-muted" />
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  value={clienteTelefone} 
                  onChange={(e) => handleClienteTelefoneChange(e.target.value)}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input 
                  value={clienteEndereco} 
                  onChange={(e) => setClienteEndereco(e.target.value)}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                <Input 
                  value={clienteCpfCnpj} 
                  onChange={(e) => setClienteCpfCnpj(e.target.value)}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-muted" : ""}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              {!isReadOnly ? (
                <Select value={statusId} onValueChange={setStatusId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusList?.filter(status => status.id && status.nome?.trim()).map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.cor }}
                          />
                          {status.nome}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={statusList?.find(s => s.id === statusId)?.nome || ""} readOnly className="bg-muted" />
              )}
            </div>

            {/* Itens */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Itens da Ordem de Serviço</Label>
                {!isReadOnly && (
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {itens.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Item {String(item.numero_item).padStart(3, '0')}</span>
                      {!isReadOnly && itens.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label>Qtd.</Label>
                        <Input 
                          type="number" 
                          value={item.quantidade}
                          onChange={(e) => updateItem(index, "quantidade", parseInt(e.target.value) || 1)}
                          readOnly={isReadOnly}
                          className={isReadOnly ? "bg-muted" : ""}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label>Descrição</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={item.descricao}
                            onChange={(e) => updateItem(index, "descricao", e.target.value)}
                            placeholder="Descrição do item"
                            readOnly={isReadOnly}
                            className={isReadOnly ? "bg-muted" : ""}
                          />
                          {!isReadOnly && (
                            <Select onValueChange={(value) => selectProduto(index, value)}>
                              <SelectTrigger className="w-12">
                                <Search className="h-4 w-4" />
                              </SelectTrigger>
                              <SelectContent>
                                {produtos?.filter(produto => produto.nome?.trim()).map((produto) => (
                                  <SelectItem key={produto.id} value={produto.id}>
                                    {produto.nome} {produto.sku && `(${produto.sku})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Preço Unit.</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={item.preco_unitario}
                          onChange={(e) => updateItem(index, "preco_unitario", parseFloat(e.target.value) || 0)}
                          readOnly={isReadOnly}
                          className={isReadOnly ? "bg-muted" : ""}
                        />
                      </div>
                      
                      <div>
                        <Label>Desconto</Label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={item.desconto}
                          onChange={(e) => updateItem(index, "desconto", parseFloat(e.target.value) || 0)}
                          readOnly={isReadOnly}
                          className={isReadOnly ? "bg-muted" : ""}
                        />
                      </div>
                      
                      <div>
                        <Label>Total</Label>
                        <Input 
                          value={`R$ ${item.total.toFixed(2)}`}
                          readOnly 
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totais */}
            <div className="border-t pt-4">
              <div className="flex justify-end space-y-2 flex-col w-64 ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="desconto_total">Desconto Total:</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={descontoTotal}
                    onChange={(e) => setDescontoTotal(parseFloat(e.target.value) || 0)}
                    className="w-24"
                    readOnly={isReadOnly}
                  />
                </div>
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Final:</span>
                  <span>R$ {valorFinal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais..."
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-muted" : ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isReadOnly ? "Fechar" : "Cancelar"}
            </Button>
            {!isReadOnly && (
              <Button 
                onClick={handleSave}
                disabled={createOS.isPending || updateOS.isPending}
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
              >
                {mode === "create" ? "Criar O.S." : "Salvar Alterações"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClienteQuickSave
        show={showQuickSave}
        clienteNome={clienteNome}
        clienteTelefone={clienteTelefone}
        clienteEndereco={clienteEndereco}
        clienteCpfCnpj={clienteCpfCnpj}
        onSave={() => setShowQuickSave(false)}
        onCancel={() => setShowQuickSave(false)}
      />

      <ClienteDialog
        open={clienteDialogOpen}
        onOpenChange={setClienteDialogOpen}
        mode="create"
        onSuccess={(cliente) => {
          setClienteNome(cliente.nome)
          setClienteTelefone(cliente.telefone || "")
          setClienteEndereco(cliente.endereco || "")
          setClienteCpfCnpj(cliente.cpf_cnpj || "")
          setIsManualEntry(false)
          setShowQuickSave(false)
        }}
      />
    </>
  )
}
