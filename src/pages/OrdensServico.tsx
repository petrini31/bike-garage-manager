
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Search } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const OrdensServico = () => {
  const [showNewOS, setShowNewOS] = useState(false)
  const [osItems, setOsItems] = useState([
    { id: 1, quantity: 1, description: "", unitPrice: 0, discount: 0, total: 0 }
  ])

  const statusColors = {
    "Recebida": "bg-gray-100 text-gray-800",
    "Em Análise": "bg-blue-100 text-blue-800",
    "Aguardando Aprovação": "bg-yellow-100 text-yellow-800",
    "Em Serviço": "bg-orange-100 text-orange-800",
    "Pronta para Retirada": "bg-green-100 text-green-800",
    "Finalizada": "bg-purple-100 text-purple-800"
  }

  const mockOrdens = [
    { id: "001", cliente: "João Silva", telefone: "(11) 99999-9999", status: "Em Serviço", valor: "R$ 150,00", data: "18/06/2025" },
    { id: "002", cliente: "Maria Santos", telefone: "(11) 88888-8888", status: "Aguardando Aprovação", valor: "R$ 280,00", data: "17/06/2025" },
    { id: "003", cliente: "Pedro Costa", telefone: "(11) 77777-7777", status: "Pronta para Retirada", valor: "R$ 95,00", data: "16/06/2025" },
    { id: "004", cliente: "Ana Lima", telefone: "(11) 66666-6666", status: "Recebida", valor: "R$ 320,00", data: "18/06/2025" },
    { id: "005", cliente: "Carlos Oliveira", telefone: "(11) 55555-5555", status: "Finalizada", valor: "R$ 180,00", data: "15/06/2025" }
  ]

  const addItem = () => {
    const newItem = {
      id: osItems.length + 1,
      quantity: 1,
      description: "",
      unitPrice: 0,
      discount: 0,
      total: 0
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

  const calculateTotal = () => {
    return osItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleCreateOS = () => {
    toast({
      title: "O.S. Criada com Sucesso!",
      description: "Ordem de serviço foi registrada no sistema.",
    })
    setShowNewOS(false)
    setOsItems([{ id: 1, quantity: 1, description: "", unitPrice: 0, discount: 0, total: 0 }])
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
                <p className="text-brilliant-blue-600 dark:text-brilliant-blue-400">O.S. #006</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cliente">Nome do Cliente *</Label>
                  <Input id="cliente" placeholder="Digite o nome do cliente" />
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" placeholder="Endereço completo" />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(xx) xxxxx-xxxx" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documento">CPF/CNPJ</Label>
                  <Input id="documento" placeholder="000.000.000-00" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="Recebida">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recebida">Recebida</SelectItem>
                      <SelectItem value="Em Análise">Em Análise</SelectItem>
                      <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                      <SelectItem value="Em Serviço">Em Serviço</SelectItem>
                      <SelectItem value="Pronta para Retirada">Pronta para Retirada</SelectItem>
                      <SelectItem value="Finalizada">Finalizada</SelectItem>
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
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16"
                            min="1"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Descrição do item/serviço"
                            className="min-w-[200px]"
                          />
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
                <Button onClick={addItem} variant="outline">
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
              />
            </div>

            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setShowNewOS(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateOS} className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
                Criar O.S.
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardTitle className="text-foreground">Lista de Ordens de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrdens.map((ordem) => (
              <div key={ordem.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-brilliant-blue-100 dark:bg-brilliant-blue-900 px-3 py-2 rounded-lg">
                    <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300">#{ordem.id}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{ordem.cliente}</p>
                    <p className="text-sm text-muted-foreground">{ordem.telefone}</p>
                    <p className="text-xs text-muted-foreground">{ordem.data}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[ordem.status as keyof typeof statusColors]}>
                    {ordem.status}
                  </Badge>
                  <p className="font-bold text-foreground">{ordem.valor}</p>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdensServico;
