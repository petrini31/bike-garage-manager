
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useStatusOS } from "@/hooks/useStatusOS"
import { useUpdateOrdemServico } from "@/hooks/useOrdensServico"
import { OrdemServico } from "@/types/database"

interface QuickStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ordem?: OrdemServico | null
}

export function QuickStatusDialog({ open, onOpenChange, ordem }: QuickStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState("")
  const { data: statusList } = useStatusOS()
  const updateOS = useUpdateOrdemServico()

  const handleSave = () => {
    if (ordem && selectedStatus) {
      updateOS.mutate(
        { id: ordem.id, status_id: selectedStatus },
        {
          onSuccess: () => onOpenChange(false)
        }
      )
    }
  }

  const getStatusColor = (status?: string) => {
    const statusObj = statusList?.find(s => s.nome === status)
    return statusObj ? { backgroundColor: statusObj.cor + "20", color: statusObj.cor } : {}
  }

  if (!ordem) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Alterar Status da O.S.</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold">O.S. Nº {String(ordem.numero_os).padStart(3, '0')}</p>
            <p className="text-muted-foreground">{ordem.cliente_nome}</p>
            <div className="mt-2">
              <Badge style={getStatusColor(ordem.status_os?.nome)}>
                Status Atual: {ordem.status_os?.nome || "Sem Status"}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Novo Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {statusList?.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.cor }}
                      />
                      {status.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedStatus || updateOS.isPending}
            className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
          >
            Alterar Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
