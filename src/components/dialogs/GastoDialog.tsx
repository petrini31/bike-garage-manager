
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCreateGasto, useUpdateGasto } from "@/hooks/useGastos"
import { Gasto } from "@/types/database"

interface GastoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gasto?: Gasto | null
}

export function GastoDialog({ open, onOpenChange, gasto }: GastoDialogProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState(0)
  const [categoria, setCategoria] = useState("Outros")
  const [status, setStatus] = useState<"Pendente" | "Pago" | "Vencido">("Pendente")
  const [dataVencimento, setDataVencimento] = useState("")
  const [dataPagamento, setDataPagamento] = useState("")
  const [recorrente, setRecorrente] = useState(false)

  const createGasto = useCreateGasto()
  const updateGasto = useUpdateGasto()

  const isEdit = !!gasto

  useEffect(() => {
    if (gasto) {
      setNome(gasto.nome)
      setDescricao(gasto.descricao || "")
      setValor(gasto.valor)
      setCategoria(gasto.categoria)
      setStatus(gasto.status)
      setDataVencimento(gasto.data_vencimento || "")
      setDataPagamento(gasto.data_pagamento || "")
      setRecorrente(gasto.recorrente || false)
    } else {
      setNome("")
      setDescricao("")
      setValor(0)
      setCategoria("Outros")
      setStatus("Pendente")
      setDataVencimento("")
      setDataPagamento("")
      setRecorrente(false)
    }
  }, [gasto, open])

  const handleSave = () => {
    const gastoData = {
      nome,
      descricao: descricao || undefined,
      valor,
      categoria,
      status,
      data_vencimento: dataVencimento || undefined,
      data_pagamento: dataPagamento || undefined,
      recorrente
    }

    if (isEdit) {
      updateGasto.mutate(
        { id: gasto.id, ...gastoData },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createGasto.mutate(gastoData, {
        onSuccess: () => onOpenChange(false)
      })
    }
  }

  const categorias = [
    "Aluguel", "Energia", "Água", "Internet", "Telefone", "Funcionários", 
    "Materiais", "Equipamentos", "Marketing", "Impostos", "Seguros", "Outros"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Gasto" : "Novo Gasto"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Gasto *</Label>
            <Input 
              value={nome} 
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Aluguel da loja"
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes adicionais sobre o gasto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor *</Label>
              <Input 
                type="number" 
                step="0.01"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <Input 
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "Pendente" | "Pago" | "Vencido") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === "Pago" && (
            <div>
              <Label htmlFor="data_pagamento">Data de Pagamento</Label>
              <Input 
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch 
              checked={recorrente}
              onCheckedChange={setRecorrente}
            />
            <Label>Gasto recorrente</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={createGasto.isPending || updateGasto.isPending || !nome || valor <= 0}
            className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700"
          >
            {isEdit ? "Salvar Alterações" : "Criar Gasto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
