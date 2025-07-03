
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, X, Upload } from "lucide-react"
import { Produto } from "@/types/database"
import { useCreateProduto, useUpdateProduto, useDeleteProduto } from "@/hooks/useProdutos"
import { useTags } from "@/hooks/useTags"

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
    status: "Em Estoque",
    estoque_minimo: 5
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)

  const createProduto = useCreateProduto()
  const updateProduto = useUpdateProduto()
  const deleteProduto = useDeleteProduto()
  const { data: tags } = useTags()

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
        status: produto.status || "Em Estoque",
        estoque_minimo: produto.estoque_minimo || 5
      })
      setSelectedTags(produto.tags?.map(tag => tag.id) || [])
    } else {
      setFormData({
        nome: "",
        sku: "",
        codigo_barras: "",
        quantidade: 0,
        preco_compra: 0,
        preco_venda: 0,
        foto_url: "",
        status: "Em Estoque",
        estoque_minimo: 5
      })
      setSelectedTags([])
    }
    setImageFile(null)
  }, [produto])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setImageFile(file)
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, foto_url: url }))
    }
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSave = () => {
    if (mode === "create") {
      createProduto.mutate({
        produto: formData,
        tags: selectedTags
      }, {
        onSuccess: () => onOpenChange(false)
      })
    } else if (mode === "edit" && produto) {
      updateProduto.mutate({ 
        id: produto.id, 
        produto: formData, 
        tags: selectedTags 
      }, {
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

  if (mode === "view") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Visualizar Produto</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Produto Header */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              {formData.foto_url && (
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img 
                    src={formData.foto_url} 
                    alt={formData.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{formData.nome}</h2>
                <p className="text-muted-foreground">SKU: {formData.sku || "N/A"}</p>
                <Badge className={`${formData.status === "Em Estoque" ? "bg-green-100 text-green-800" : 
                  formData.status === "Estoque Baixo" ? "bg-yellow-100 text-yellow-800" : 
                  "bg-red-100 text-red-800"} mt-1`}>
                  {formData.status}
                </Badge>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Código de Barras</Label>
                <p className="text-foreground">{formData.codigo_barras || "N/A"}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Quantidade em Estoque</Label>
                <p className="text-2xl font-bold text-foreground">{formData.quantidade}</p>
              </div>
            </div>

            {/* Preços */}
            <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="text-center">
                <Label className="text-sm font-medium text-muted-foreground">Preço de Compra</Label>
                <p className="text-lg font-semibold text-foreground">R$ {formData.preco_compra.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <Label className="text-sm font-medium text-muted-foreground">Preço de Venda</Label>
                <p className="text-lg font-semibold text-foreground">R$ {formData.preco_venda.toFixed(2)}</p>
              </div>
              <div className="text-center p-2 bg-green-100 dark:bg-green-900 rounded">
                <Label className="text-sm font-medium text-green-700 dark:text-green-300">Lucro</Label>
                <p className="text-lg font-bold text-green-800 dark:text-green-200">R$ {lucro.toFixed(2)}</p>
              </div>
            </div>

            {/* Estoque Mínimo */}
            <div className="p-4 border rounded-lg">
              <Label className="text-sm font-medium text-muted-foreground">Estoque Mínimo</Label>
              <p className="text-foreground">{formData.estoque_minimo} unidades</p>
            </div>

            {/* Tags */}
            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tagId => {
                    const tag = tags?.find(t => t.id === tagId)
                    return tag ? (
                      <Badge 
                        key={tag.id}
                        style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                      >
                        #{tag.nome}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Novo Produto"}
            {mode === "edit" && "Editar Produto"}
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
          
          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                value={formData.estoque_minimo}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque_minimo: parseInt(e.target.value) || 5 }))}
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
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="foto">Foto do Produto</Label>
            <div className="space-y-2">
              <Input
                id="foto"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
                disabled={isReadonly}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brilliant-blue-50 file:text-brilliant-blue-700 hover:file:bg-brilliant-blue-100"
              />
              {formData.foto_url && (
                <div className="w-20 h-20 rounded border overflow-hidden">
                  <img 
                    src={formData.foto_url} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags Selection */}
          <div>
            <Label>Tags</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tags?.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    disabled={isReadonly}
                    className="rounded"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Badge 
                      style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                      className="text-xs"
                    >
                      #{tag.nome}
                    </Badge>
                  </label>
                </div>
              )) || <p className="text-muted-foreground text-sm">Nenhuma tag disponível</p>}
            </div>
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
              Cancelar
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
