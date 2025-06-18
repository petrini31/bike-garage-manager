
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { Cliente } from "@/types/database"
import { useCreateCliente, useUpdateCliente, useDeleteCliente } from "@/hooks/useClientes"

interface ClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente | null
  mode: "create" | "edit" | "view"
}

export function ClienteDialog({ open, onOpenChange, cliente, mode }: ClienteDialogProps) {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    endereco: "",
    cpf_cnpj: ""
  })

  const createCliente = useCreateCliente()
  const updateCliente = useUpdateCliente()
  const deleteCliente = useDeleteCliente()

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || "",
        telefone: cliente.telefone || "",
        email: cliente.email || "",
        endereco: cliente.endereco || "",
        cpf_cnpj: cliente.cpf_cnpj || ""
      })
    } else {
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        endereco: "",
        cpf_cnpj: ""
      })
    }
  }, [cliente])

  const handleSave = () => {
    if (mode === "create") {
      createCliente.mutate(formData, {
        onSuccess: () => onOpenChange(false)
      })
    } else if (mode === "edit" && cliente) {
      updateCliente.mutate({ ...formData, id: cliente.id }, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  const handleDelete = () => {
    if (cliente) {
      deleteCliente.mutate(cliente.id, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  const isReadonly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Novo Cliente"}
            {mode === "edit" && "Editar Cliente"}
            {mode === "view" && "Visualizar Cliente"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              readOnly={isReadonly}
            />
          </div>
          
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(xx) xxxxx-xxxx"
              readOnly={isReadonly}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              readOnly={isReadonly}
            />
          </div>
          
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              readOnly={isReadonly}
            />
          </div>
          
          <div>
            <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
            <Input
              id="cpf_cnpj"
              value={formData.cpf_cnpj}
              onChange={(e) => setFormData(prev => ({ ...prev, cpf_cnpj: e.target.value }))}
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
                      Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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
                disabled={!formData.nome || createCliente.isPending || updateCliente.isPending}
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
