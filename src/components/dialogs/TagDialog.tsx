
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Palette } from "lucide-react"
import { useTags, useCreateTag } from "@/hooks/useTags"

interface TagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const cores = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
  "#8B5CF6", "#06B6D4", "#F97316", "#84CC16"
]

export const TagDialog = ({ open, onOpenChange }: TagDialogProps) => {
  const [nome, setNome] = useState("")
  const [cor, setCor] = useState(cores[0])
  
  const { data: tags } = useTags()
  const createTag = useCreateTag()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return

    createTag.mutate({
      nome,
      cor
    }, {
      onSuccess: () => {
        setNome("")
        setCor(cores[0])
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome da Tag</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome da tag"
              />
            </div>

            <div>
              <Label>Cor da Tag</Label>
              <div className="flex gap-2 mt-2">
                {cores.map((corOption) => (
                  <button
                    key={corOption}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      cor === corOption ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: corOption }}
                    onClick={() => setCor(corOption)}
                  />
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!nome.trim() || createTag.isPending}
              className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Tag
            </Button>
          </form>

          <div>
            <h3 className="font-semibold mb-3">Tags Existentes</h3>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <Badge 
                  key={tag.id}
                  style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                >
                  #{tag.nome}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
