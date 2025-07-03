
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Phone, Eye, Edit } from "lucide-react"
import { useOrdensServico } from "@/hooks/useOrdensServico"
import { useClientes } from "@/hooks/useClientes"
import { useStatusOS } from "@/hooks/useStatusOS"
import { QuickStatusDialog } from "@/components/dialogs/QuickStatusDialog"
import { OrdemServico } from "@/types/database"
import { OSDialog } from "@/components/dialogs/OSDialog"

const OrdensServico = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [clienteFilter, setClienteFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [quickStatusOpen, setQuickStatusOpen] = useState(false)

  const { data: ordens, isLoading, isError } = useOrdensServico()
  const { data: clientes } = useClientes()
  const { data: statusList } = useStatusOS()

  const [osDialogOpen, setOsDialogOpen] = useState(false)
  const [selectedOS, setSelectedOS] = useState<OrdemServico | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")

  const handleEdit = (ordem: OrdemServico) => {
    setSelectedOS(ordem)
    setDialogMode("edit")
    setOsDialogOpen(true)
  }

  const handleView = (ordem: OrdemServico) => {
    setSelectedOS(ordem)
    setDialogMode("view")
    setOsDialogOpen(true)
  }

  const handleQuickStatusEdit = (ordem: OrdemServico) => {
    setSelectedOS(ordem)
    setQuickStatusOpen(true)
  }

  const filteredOrdens = ordens?.filter((ordem) => {
    const searchRegex = new RegExp(searchTerm, "i")
    
    const clienteMatch = clienteFilter && clienteFilter !== "todos" ? 
      ordem.cliente_nome && new RegExp(clienteFilter, "i").test(ordem.cliente_nome) : true
    const statusMatch = statusFilter && statusFilter !== "todos" ? 
      ordem.status_id === statusFilter : true
    
    const searchMatch = !searchTerm || 
      (ordem.cliente_nome && searchRegex.test(ordem.cliente_nome)) || 
      (ordem.numero_os && searchRegex.test(ordem.numero_os.toString()))
    
    return searchMatch && clienteMatch && statusMatch
  })

  if (isLoading) return <div>Carregando ordens de serviço...</div>
  if (isError) return <div>Erro ao carregar ordens de serviço.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie as ordens de serviço da oficina</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedOS(null)
            setDialogMode("create")
            setOsDialogOpen(true)
          }}
          className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova O.S.
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="search"
          placeholder="Buscar por cliente ou número da O.S."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={clienteFilter} onValueChange={setClienteFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os clientes</SelectItem>
            {clientes?.filter(cliente => cliente.nome?.trim()).map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.nome}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {statusList?.filter(status => status.id && status.nome?.trim()).map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Ordens */}
      <div className="grid gap-4">
        {filteredOrdens?.map((ordem) => {
          const statusNome = ordem.status_os?.nome || "Sem Status"
          const statusCor = ordem.status_os?.cor || "#808080"
          
          return (
            <Card key={ordem.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300 text-xs">
                        {String(ordem.numero_os || 0).padStart(3, '0')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{ordem.cliente_nome || "Cliente não informado"}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        {ordem.cliente_telefone && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {ordem.cliente_telefone}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ordem.created_at ? format(new Date(ordem.created_at), "dd/MM/yyyy", { locale: ptBR }) : 'Data inválida'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        R$ {(ordem.valor_final || 0).toFixed(2)}
                      </div>
                      <div 
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ 
                          backgroundColor: statusCor + '20', 
                          color: statusCor 
                        }}
                        onClick={() => handleQuickStatusEdit(ordem)}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: statusCor }}
                        />
                        {statusNome}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleView(ordem)}
                      className="hover:bg-muted"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(ordem)}
                      className="hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {filteredOrdens?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma ordem de serviço encontrada.
          </div>
        )}
      </div>

      <OSDialog
        open={osDialogOpen}
        onOpenChange={setOsDialogOpen}
        ordem={selectedOS}
        mode={dialogMode}
      />

      <QuickStatusDialog
        open={quickStatusOpen}
        onOpenChange={setQuickStatusOpen}
        ordem={selectedOS}
      />
    </div>
  )
}

export default OrdensServico
