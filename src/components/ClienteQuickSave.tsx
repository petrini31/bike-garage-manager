
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Save, UserPlus } from "lucide-react"
import { useCreateCliente } from "@/hooks/useClientes"

interface ClienteQuickSaveProps {
  clienteNome: string
  clienteTelefone: string
  clienteEndereco: string
  clienteCpfCnpj: string
  onSave: () => void
  onCancel: () => void
  show: boolean
}

export function ClienteQuickSave({ 
  clienteNome, 
  clienteTelefone, 
  clienteEndereco, 
  clienteCpfCnpj,
  onSave, 
  onCancel,
  show 
}: ClienteQuickSaveProps) {
  const [isVisible, setIsVisible] = useState(show)
  const createCliente = useCreateCliente()

  if (!show || !isVisible) return null

  const hasRequiredFields = clienteNome.trim() && clienteTelefone.trim()

  const handleSave = () => {
    if (!hasRequiredFields) return

    createCliente.mutate({
      nome: clienteNome,
      telefone: clienteTelefone,
      endereco: clienteEndereco || undefined,
      cpf_cnpj: clienteCpfCnpj || undefined
    }, {
      onSuccess: () => {
        onSave()
        setIsVisible(false)
      }
    })
  }

  const handleCancel = () => {
    setIsVisible(false)
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in-0">
      <Card className="w-full max-w-md mx-4 animate-in slide-in-from-bottom-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-brilliant-blue-600" />
              <h3 className="font-semibold">Salvar Cliente</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Você deseja salvar este cliente no banco de dados?
          </p>
          
          {!hasRequiredFields && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                Para salvar o cliente, é necessário informar pelo menos o <strong>Nome</strong> e o <strong>Telefone</strong>.
              </p>
            </div>
          )}
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Não
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasRequiredFields || createCliente.isPending}
              className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {createCliente.isPending ? "Salvando..." : "Sim"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
