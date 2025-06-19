
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useProdutos } from "@/hooks/useProdutos"
import { Produto } from "@/types/database"

interface ProdutoSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProduto: (produto: Produto) => void
}

export function ProdutoSelectorDialog({ open, onOpenChange, onSelectProduto }: ProdutoSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: produtos } = useProdutos()

  const filteredProdutos = produtos?.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo_barras?.includes(searchTerm)
  ) || []

  const handleSelectProduto = (produto: Produto) => {
    onSelectProduto(produto)
    onOpenChange(false)
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar Produto do Estoque</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, SKU ou código de barras..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredProdutos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto encontrado.
              </div>
            ) : (
              filteredProdutos.map((produto) => (
                <div 
                  key={produto.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSelectProduto(produto)}
                >
                  <div className="flex items-center gap-3">
                    {produto.foto_url && (
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img 
                          src={produto.foto_url} 
                          alt={produto.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="w-16 h-10 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded flex items-center justify-center">
                      <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300 text-xs text-center px-1">
                        {produto.sku || produto.nome.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{produto.nome}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>SKU: {produto.sku || "N/A"}</span>
                        {produto.codigo_barras && <span>Código: {produto.codigo_barras}</span>}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Preço: R$ {produto.preco_venda?.toFixed(2) || "0,00"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Qtd</p>
                      <p className="font-bold text-foreground">{produto.quantidade}</p>
                    </div>
                    <Badge className={getStatusColor(produto.status)}>
                      {produto.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
