
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
      
      if (error) {
        console.error("Erro ao buscar ordens de serviço:", error)
        throw error
      }
      
      return data as OrdemServico[]
    }
  })
}

export const useOrdemServicoById = (id: string) => {
  return useQuery({
    queryKey: ["ordem-servico", id],
    queryFn: async () => {
      if (!id) return null
      
      const { data, error } = await supabase
        .from("ordens_servico")
        .select(`
          *,
          status_os (nome, cor),
          os_itens (*)
        `)
        .eq("id", id)
        .single()
      
      if (error) {
        console.error("Erro ao buscar ordem de serviço:", error)
        throw error
      }
      
      return data
    },
    enabled: !!id
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
      
      if (osError) {
        console.error("Erro ao criar ordem de serviço:", osError)
        throw osError
      }
      
      if (itens && itens.length > 0) {
        const itensWithOsId = itens.map(item => ({
          ...item,
          os_id: osData.id
        }))
        
        const { error: itensError } = await supabase
          .from("os_itens")
          .insert(itensWithOsId)
        
        if (itensError) {
          console.error("Erro ao criar itens da ordem de serviço:", itensError)
          throw itensError
        }
      }
      
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
      console.error("Erro na criação da O.S.:", error)
      toast({
        title: "Erro ao criar O.S.",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateOrdemServico = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<OrdemServico> & { id: string }) => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()
      
      if (error) {
        console.error("Erro ao atualizar ordem de serviço:", error)
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordens-servico"] })
      toast({
        title: "O.S. atualizada com sucesso!",
        description: "As informações da ordem de serviço foram atualizadas."
      })
    },
    onError: (error) => {
      console.error("Erro na atualização da O.S.:", error)
      toast({
        title: "Erro ao atualizar O.S.",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
