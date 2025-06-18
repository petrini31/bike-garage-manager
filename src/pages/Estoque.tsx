
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Eye, Plus } from "lucide-react"
import { useProdutos } from "@/hooks/useProdutos"
import { ProdutoDialog } from "@/components/dialogs/ProdutoDialog"
import { Produto } from "@/types/database"

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")

  const { data: produtos, isLoading } = useProdutos()

  const filteredProdutos = produtos?.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo_barras?.includes(searchTerm)
    
    const matchesStatus = !statusFilter || produto.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return "bg-green-100 text-green-800"
      case "Estoque Baixo":
        return "bg-yellow-100 text-yellow-800"
      case "Sem Estoque":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalItens = produtos?.length || 0
  const emEstoque = produtos?.filter(p => p.status === "Em Estoque").length || 0
  const estoqueBaixo = produtos?.filter(p => p.status === "Estoque Baixo").length || 0
  const semEstoque = produtos?.filter(p => p.status === "Sem Estoque").length || 0

  const handleNewProduto = () => {
    setSelectedProduto(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleEditProduto = (produto: Produto) => {
    setSelectedProduto(produto)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleViewProduto = (produto: Produto) => {
    setSelectedProduto(produto)
    setDialogMode("view")
    setDialogOpen(true)
  }

  const handleStatusClick = (status: string) => {
    setStatusFilter(statusFilter === status ? "" : status)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando estoque...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerencie peças e acessórios</p>
        </div>
        <Button onClick={handleNewProduto} className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className={`border-border cursor-pointer transition-all ${statusFilter === "" ? "ring-2 ring-brilliant-blue-500" : "hover:shadow-md"}`}
          onClick={() => setStatusFilter("")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{totalItens}</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`border-border cursor-pointer transition-all ${statusFilter === "Em Estoque" ? "ring-2 ring-green-500" : "hover:shadow-md"}`}
          onClick={() => handleStatusClick("Em Estoque")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{emEstoque}</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`border-border cursor-pointer transition-all ${statusFilter === "Estoque Baixo" ? "ring-2 ring-yellow-500" : "hover:shadow-md"}`}
          onClick={() => handleStatusClick("Estoque Baixo")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{estoqueBaixo}</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`border-border cursor-pointer transition-all ${statusFilter === "Sem Estoque" ? "ring-2 ring-red-500" : "hover:shadow-md"}`}
          onClick={() => handleStatusClick("Sem Estoque")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sem Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{semEstoque}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Itens do Estoque</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, SKU ou código de barras..." 
                className="w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProdutos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
              </div>
            ) : (
              filteredProdutos.map((produto) => (
                <div key={produto.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300 text-xs">
                        {produto.sku || produto.nome.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{produto.nome}</p>
                      <p className="text-sm text-muted-foreground">SKU: {produto.sku || "N/A"}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Compra: R$ {produto.preco_compra?.toFixed(2) || "0,00"}</span>
                        <span>Venda: R$ {produto.preco_venda?.toFixed(2) || "0,00"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Quantidade</p>
                      <p className="font-bold text-foreground text-lg">{produto.quantidade}</p>
                    </div>
                    <Badge 
                      className={`${getStatusColor(produto.status)} cursor-pointer`}
                      onClick={() => handleStatusClick(produto.status)}
                    >
                      {produto.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditProduto(produto)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewProduto(produto)}>
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

      <ProdutoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        produto={selectedProduto}
        mode={dialogMode}
      />
    </div>
  );
};

export default Estoque;
