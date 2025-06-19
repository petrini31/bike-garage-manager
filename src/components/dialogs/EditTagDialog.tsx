
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, X } from "lucide-react"
import { Tag, Produto } from "@/types/database"
import { useProdutos } from "@/hooks/useProdutos"

interface EditTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: Tag | null
  onSave: (tag: Partial<Tag> & { id?: string }) => void
  onDelete?: (tagId: string) => void
}

export function EditTagDialog({ open, onOpenChange, tag, onSave, onDelete }: EditTagDialogProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [cor, setCor] = useState("#3B82F6")
  const [customCor, setCustomCor] = useState("")
  
  const { data: produtos } = useProdutos()
  
  const produtosComTag = produtos?.filter(produto => 
    produto.tags?.some(t => t.id === tag?.id)
  ) || []

  useEffect(() => {
    if (tag) {
      setNome(tag.nome)
      setDescricao("")
      setCor(tag.cor)
      setCustomCor(tag.cor)
    } else {
      setNome("")
      setDescricao("")
      setCor("#3B82F6")
      setCustomCor("#3B82F6")
    }
  }, [tag])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tagData = {
      ...(tag && { id: tag.id }),
      nome,
      descricao,
      cor: customCor || cor
    }
    
    onSave(tagData)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (tag && onDelete) {
      onDelete(tag.id)
      onOpenChange(false)
    }
  }

  const predefinedColors = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
    "#8B5CF6", "#06B6D4", "#F97316", "#84CC16",
    "#EC4899", "#6366F1", "#14B8A6", "#F59E0B"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {tag ? "Editar Tag" : "Nova Tag"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nome">Nome da Tag *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome da tag"
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição da tag..."
              rows={3}
            />
          </div>

          <div>
            <Label>Cor da Tag</Label>
            <div className="space-y-3 mt-2">
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((corOption) => (
                  <button
                    key={corOption}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      cor === corOption ? 'border-gray-600 scale-110' : 'border-gray-300'
                    } transition-all`}
                    style={{ backgroundColor: corOption }}
                    onClick={() => {
                      setCor(corOption)
                      setCustomCor(corOption)
                    }}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="customCor" className="text-sm">Cor personalizada (HEX):</Label>
                <Input
                  id="customCor"
                  type="text"
                  value={customCor}
                  onChange={(e) => setCustomCor(e.target.value)}
                  placeholder="#000000"
                  className="w-24"
                />
                <div 
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: customCor }}
                />
              </div>
            </div>
          </div>

          {tag && produtosComTag.length > 0 && (
            <div>
              <Label>Produtos com esta tag ({produtosComTag.length})</Label>
              <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                {produtosComTag.map((produto) => (
                  <div key={produto.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{produto.nome}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <div>
              {tag && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Tag
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
                {tag ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
