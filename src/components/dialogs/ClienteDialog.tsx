
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCliente, useUpdateCliente } from "@/hooks/useClientes"
import { Cliente } from "@/types/database"
import { formatCPF, formatPhone } from "@/utils/formatters"

interface ClienteDialogProps {
  cliente?: Cliente
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit" | "view"
}

export function ClienteDialog({ cliente, trigger, open, onOpenChange, mode = "create" }: ClienteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    telefone: cliente?.telefone || "",
    email: cliente?.email || "",
    endereco: cliente?.endereco || "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cpf_cnpj: cliente?.cpf_cnpj || ""
  })

  const createCliente = useCreateCliente()
  const updateCliente = useUpdateCliente()

  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf_cnpj') {
      setFormData(prev => ({ ...prev, [field]: formatCPF(value) }))
    } else if (field === 'telefone') {
      setFormData(prev => ({ ...prev, [field]: formatPhone(value) }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === "view") return
    
    // Combinar campos de endereço
    const enderecoCompleto = [
      formData.endereco,
      formData.numero,
      formData.bairro,
      formData.cidade,
      formData.estado
    ].filter(Boolean).join(", ")

    const clienteData = {
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      endereco: enderecoCompleto,
      cpf_cnpj: formData.cpf_cnpj
    }
    
    if (cliente && mode === "edit") {
      updateCliente.mutate(
        { id: cliente.id, ...clienteData },
        {
          onSuccess: () => {
            setOpen(false)
            setFormData({ nome: "", telefone: "", email: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "", cpf_cnpj: "" })
          }
        }
      )
    } else {
      createCliente.mutate(
        clienteData,
        {
          onSuccess: () => {
            setOpen(false)
            setFormData({ nome: "", telefone: "", email: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "", cpf_cnpj: "" })
          }
        }
      )
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "Visualizar Cliente" : cliente ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required
              readOnly={isReadOnly}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(xx) xxxxx-xxxx"
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
            <Input
              id="cpf_cnpj"
              value={formData.cpf_cnpj}
              onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Endereço</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Logradouro</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Rua, Avenida..."
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  placeholder="123"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  placeholder="Centro"
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  placeholder="São Paulo"
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  placeholder="SP"
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {isReadOnly ? "Fechar" : "Cancelar"}
            </Button>
            {!isReadOnly && (
              <Button 
                type="submit" 
                disabled={createCliente.isPending || updateCliente.isPending}
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
              >
                {cliente ? "Atualizar" : "Criar"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
