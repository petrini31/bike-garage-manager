
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { OrdemServico, OSItem } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useOrdensServico = () => {
  return useQuery({
    queryKey: ["ordens-servico"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select(`
          *,
          status_os (nome, cor),
          clientes (nome, telefone)
        `)
        .order("numero_os", { ascending: false })
      
      if (error) throw error
      return data as OrdemServico[]
    }
  })
}

export const useStatusOS = () => {
  return useQuery({
    queryKey: ["status-os"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_os")
        .select("*")
        .order("ordem")
      
      if (error) throw error
      return data
    }
  })
}

export const useCreateOrdemServico = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ os, itens }: { os: Omit<OrdemServico, "id" | "numero_os" | "created_at" | "updated_at">, itens: Omit<OSItem, "id" | "os_id" | "created_at">[] }) => {
      const { data: osData, error: osError } = await supabase
        .from("ordens_servico")
        .insert(os)
        .select()
        .single()
      
      if (osError) throw osError
      
      const itensWithOsId = itens.map(item => ({
        ...item,
        os_id: osData.id
      }))
      
      const { error: itensError } = await supabase
        .from("os_itens")
        .insert(itensWithOsId)
      
      if (itensError) throw itensError
      
      return osData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-servico"] })
      toast({
        title: "O.S. criada com sucesso!",
        description: "A ordem de serviço foi registrada no sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar O.S.",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
