
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, ChevronRight } from "lucide-react"
import { useTags } from "@/hooks/useTags"
import { TagDialog } from "@/components/dialogs/TagDialog"
import { EditTagDialog } from "@/components/dialogs/EditTagDialog"
import { ProdutosByTagDialog } from "@/components/dialogs/ProdutosByTagDialog"
import { Tag } from "@/types/database"

export const TagsSection = () => {
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [editTagDialogOpen, setEditTagDialogOpen] = useState(false)
  const [produtosByTagDialogOpen, setProdutosByTagDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

  const { data: tags } = useTags()

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setEditTagDialogOpen(true)
  }

  const handleViewProdutos = (tag: Tag) => {
    setSelectedTag(tag)
    setProdutosByTagDialogOpen(true)
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-foreground">Gerenciar Tags</CardTitle>
          <Button 
            onClick={() => setTagDialogOpen(true)}
            className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Tag
          </Button>
        </CardHeader>
        <CardContent>
          {tags && tags.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div 
                  key={tag.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Badge 
                    style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                    className="text-sm font-medium"
                  >
                    #{tag.nome}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProdutos(tag)}
                      title="Ver produtos desta tag"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTag(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma tag cadastrada. Clique em "Nova Tag" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      <TagDialog 
        open={tagDialogOpen} 
        onOpenChange={setTagDialogOpen} 
      />
      
      <EditTagDialog 
        open={editTagDialogOpen} 
        onOpenChange={setEditTagDialogOpen}
        tag={selectedTag}
      />

      <ProdutosByTagDialog
        open={produtosByTagDialogOpen}
        onOpenChange={setProdutosByTagDialogOpen}
        tag={selectedTag}
      />
    </>
  )
}
