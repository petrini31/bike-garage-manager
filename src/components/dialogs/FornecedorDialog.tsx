
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateFornecedor } from "@/hooks/useFornecedores"
import { useTags } from "@/hooks/useTags"
import { Fornecedor } from "@/types/database"

interface FornecedorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fornecedor?: Fornecedor | null
  mode: "create" | "edit" | "view"
}

export const FornecedorDialog = ({ open, onOpenChange, fornecedor, mode }: FornecedorDialogProps) => {
  const [formData, setFormData] = useState({
    cnpj: "",
    nome: "",
    telefone: "",
    endereco: "",
    email: "",
    cidade: "",
    estado: "",
    ativo: true,
    tagIds: [] as string[]
  })

  const createFornecedor = useCreateFornecedor()
  const { data: tags } = useTags()

  useEffect(() => {
    if (fornecedor) {
      setFormData({
        cnpj: fornecedor.cnpj || "",
        nome: fornecedor.nome || "",
        telefone: fornecedor.telefone || "",
        endereco: fornecedor.endereco || "",
        email: fornecedor.email || "",
        cidade: fornecedor.cidade || "",
        estado: fornecedor.estado || "",
        ativo: fornecedor.ativo,
        tagIds: fornecedor.tags?.map(t => t.id) || []
      })
    } else {
      setFormData({
        cnpj: "",
        nome: "",
        telefone: "",
        endereco: "",
        email: "",
        cidade: "",
        estado: "",
        ativo: true,
        tagIds: []
      })
    }
  }, [fornecedor, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return

    const { tagIds, ...fornecedorData } = formData
    
    if (mode === "create") {
      createFornecedor.mutate(fornecedorData, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    }
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Fornecedor" : mode === "edit" ? "Editar Fornecedor" : "Visualizar Fornecedor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0000-00"
                disabled={isReadOnly}
                required
              />
            </div>
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do fornecedor"
                disabled={isReadOnly}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(xx) xxxxx-xxxx"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              placeholder="Endereço completo"
              disabled={isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                placeholder="Cidade"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))} disabled={isReadOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tags && tags.length > 0 && (
            <div>
              <Label>Tags de Produtos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={formData.tagIds.includes(tag.id)}
                      onCheckedChange={() => handleTagToggle(tag.id)}
                      disabled={isReadOnly}
                    />
                    <Badge 
                      style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                      className="text-xs"
                    >
                      #{tag.nome}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: !!checked }))}
              disabled={isReadOnly}
            />
            <Label htmlFor="ativo">Fornecedor ativo</Label>
          </div>

          {!isReadOnly && (
            <div className="flex gap-4 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createFornecedor.isPending}
                className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
              >
                {mode === "create" ? "Criar Fornecedor" : "Salvar Alterações"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
