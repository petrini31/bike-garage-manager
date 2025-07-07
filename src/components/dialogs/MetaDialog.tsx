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
import { useCreateMeta, useUpdateMeta, type Meta } from "@/hooks/useMetas"

interface MetaDialogProps {
  trigger: React.ReactNode
  meta?: Meta
  mode: "create" | "edit"
}

type FormData = {
  nome: string
  valor_objetivo: number
  data_inicio: string
  data_fim: string
}

export const MetaDialog = ({ trigger, meta, mode }: MetaDialogProps) => {
  const [open, setOpen] = useState(false)
  const [dataInicio, setDataInicio] = useState<Date | undefined>(
    meta?.data_inicio ? new Date(meta.data_inicio) : undefined
  )
  const [dataFim, setDataFim] = useState<Date | undefined>(
    meta?.data_fim ? new Date(meta.data_fim) : undefined
  )

  const createMutation = useCreateMeta()
  const updateMutation = useUpdateMeta()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: meta ? {
      nome: meta.nome,
      valor_objetivo: meta.valor_objetivo,
      data_inicio: meta.data_inicio,
      data_fim: meta.data_fim
    } : undefined
  })

  const onSubmit = (data: FormData) => {
    if (!dataInicio || !dataFim) return

    const metaData = {
      ...data,
      valor_objetivo: Number(data.valor_objetivo),
      data_inicio: format(dataInicio, "yyyy-MM-dd"),
      data_fim: format(dataFim, "yyyy-MM-dd")
    }

    const mutation = mode === "create" ? createMutation : updateMutation
    const mutationData = mode === "edit" && meta ? { id: meta.id, ...metaData } : metaData

    if (mode === "create") {
      createMutation.mutate(metaData, {
        onSuccess: () => {
          setOpen(false)
          reset()
          setDataInicio(undefined)
          setDataFim(undefined)
        }
      })
    } else if (mode === "edit" && meta) {
      updateMutation.mutate({ id: meta.id, ...metaData }, {
        onSuccess: () => {
          setOpen(false)
          reset()
          setDataInicio(undefined)
          setDataFim(undefined)
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova Meta" : "Editar Meta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Meta *</Label>
            <Input
              id="nome"
              {...register("nome", { required: "Nome é obrigatório" })}
              placeholder="Ex: Faturamento Janeiro 2025"
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_objetivo">Valor Objetivo (R$) *</Label>
            <Input
              id="valor_objetivo"
              type="number"
              step="0.01"
              {...register("valor_objetivo", { 
                required: "Valor objetivo é obrigatório",
                min: { value: 0.01, message: "Valor deve ser maior que zero" }
              })}
              placeholder="0,00"
            />
            {errors.valor_objetivo && (
              <p className="text-sm text-destructive">{errors.valor_objetivo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Fim *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : "Fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
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
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}