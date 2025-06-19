
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/hooks/useTags"
import { EditTagDialog } from "./EditTagDialog"
import { Tag } from "@/types/database"

interface TagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TagDialog = ({ open, onOpenChange }: TagDialogProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  
  const { data: tags } = useTags()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const handleEditTag = (tag: Tag) => {
    setSelectedTag(tag)
    setEditDialogOpen(true)
  }

  const handleNewTag = () => {
    setSelectedTag(null)
    setEditDialogOpen(true)
  }

  const handleSaveTag = (tagData: Partial<Tag> & { id?: string }) => {
    if (tagData.id) {
      updateTag.mutate({ ...tagData, id: tagData.id })
    } else {
      createTag.mutate(tagData as Omit<Tag, "id" | "created_at">)
    }
  }

  const handleDeleteTag = (tagId: string) => {
    deleteTag.mutate(tagId)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Tags Existentes</h3>
              <Button 
                onClick={handleNewTag}
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Tag
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tags?.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: tag.cor }}
                    />
                    <div>
                      <Badge 
                        style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                        className="text-sm font-medium"
                      >
                        #{tag.nome}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTag(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {(!tags || tags.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma tag cadastrada.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditTagDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tag={selectedTag}
        onSave={handleSaveTag}
        onDelete={handleDeleteTag}
      />
    </>
  )
}
