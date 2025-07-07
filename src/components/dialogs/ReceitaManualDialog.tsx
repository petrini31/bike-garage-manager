import { useState } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useCreateReceitaManual, type ReceitaManual } from "@/hooks/useReceitasManuais"

interface ReceitaManualDialogProps {
  trigger: React.ReactNode
}

type FormData = Omit<ReceitaManual, "id" | "created_at">

export const ReceitaManualDialog = ({ trigger }: ReceitaManualDialogProps) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const createMutation = useCreateReceitaManual()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    if (!date) return

    createMutation.mutate({
      ...data,
      valor: Number(data.valor),
      data: format(date, "yyyy-MM-dd")
    }, {
      onSuccess: () => {
        setOpen(false)
        reset()
        setDate(undefined)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Receita Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              {...register("descricao", { required: "Descrição é obrigatória" })}
              placeholder="Ex: Venda de produto avulso"
            />
            {errors.descricao && (
              <p className="text-sm text-destructive">{errors.descricao.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              {...register("valor", { 
                required: "Valor é obrigatório",
                min: { value: 0.01, message: "Valor deve ser maior que zero" }
              })}
              placeholder="0,00"
            />
            {errors.valor && (
              <p className="text-sm text-destructive">{errors.valor.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}