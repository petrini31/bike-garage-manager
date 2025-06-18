
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { Produto } from "@/types/database"
import { useCreateProduto, useUpdateProduto, useDeleteProduto } from "@/hooks/useProdutos"

interface ProdutoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto?: Produto | null
  mode: "create" | "edit" | "view"
}

export function ProdutoDialog({ open, onOpenChange, produto, mode }: ProdutoDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    codigo_barras: "",
    quantidade: 0,
    preco_compra: 0,
    preco_venda: 0,
    foto_url: "",
    status: "Em Estoque"
  })

  const createProduto = useCreateProduto()
  const updateProduto = useUpdateProduto()
  const deleteProduto = useDeleteProduto()

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || "",
        sku: produto.sku || "",
        codigo_barras: produto.codigo_barras || "",
        quantidade: produto.quantidade || 0,
        preco_compra: produto.preco_compra || 0,
        preco_venda: produto.preco_venda || 0,
        foto_url: produto.foto_url || "",
        status: produto.status || "Em Estoque"
      })
    } else {
      setFormData({
        nome: "",
        sku: "",
        codigo_barras: "",
        quantidade: 0,
        preco_compra: 0,
        preco_venda: 0,
        foto_url: "",
        status: "Em Estoque"
      })
    }
  }, [produto])

  const handleSave = () => {
    if (mode === "create") {
      createProduto.mutate(formData, {
        onSuccess: () => onOpenChange(false)
      })
    } else if (mode === "edit" && produto) {
      updateProduto.mutate({ ...formData, id: produto.id }, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  const handleDelete = () => {
    if (produto) {
      deleteProduto.mutate(produto.id, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  const lucro = formData.preco_venda - formData.preco_compra
  const isReadonly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Novo Produto"}
            {mode === "edit" && "Editar Produto"}
            {mode === "view" && "Visualizar Produto"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              readOnly={isReadonly}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Gerado automaticamente"
                readOnly={isReadonly}
              />
            </div>
            
            <div>
              <Label htmlFor="codigo_barras">Código de Barras</Label>
              <Input
                id="codigo_barras"
                value={formData.codigo_barras}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo_barras: e.target.value }))}
                readOnly={isReadonly}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 0 }))}
                readOnly={isReadonly}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={isReadonly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em Estoque">Em Estoque</SelectItem>
                  <SelectItem value="Estoque Baixo">Estoque Baixo</SelectItem>
                  <SelectItem value="Sem Estoque">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="preco_compra">Preço de Compra</Label>
              <Input
                id="preco_compra"
                type="number"
                step="0.01"
                value={formData.preco_compra}
                onChange={(e) => setFormData(prev => ({ ...prev, preco_compra: parseFloat(e.target.value) || 0 }))}
                readOnly={isReadonly}
              />
            </div>
            
            <div>
              <Label htmlFor="preco_venda">Preço de Venda</Label>
              <Input
                id="preco_venda"
                type="number"
                step="0.01"
                value={formData.preco_venda}
                onChange={(e) => setFormData(prev => ({ ...prev, preco_venda: parseFloat(e.target.value) || 0 }))}
                readOnly={isReadonly}
              />
            </div>
            
            <div>
              <Label>Lucro</Label>
              <Input
                value={`R$ ${lucro.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="foto_url">URL da Foto</Label>
            <Input
              id="foto_url"
              value={formData.foto_url}
              onChange={(e) => setFormData(prev => ({ ...prev, foto_url: e.target.value }))}
              placeholder="https://..."
              readOnly={isReadonly}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {mode === "edit" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {mode === "view" ? "Fechar" : "Cancelar"}
            </Button>
            {(mode === "create" || mode === "edit") && (
              <Button 
                onClick={handleSave} 
                disabled={!formData.nome || createProduto.isPending || updateProduto.isPending}
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
              >
                {mode === "create" ? "Criar" : "Salvar"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
