import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

export interface Meta {
  id: string
  nome: string
  valor_objetivo: number
  valor_atual: number
  data_inicio: string
  data_fim: string
  created_at: string
  updated_at: string
}

export const useMetas = () => {
  return useQuery({
    queryKey: ["metas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metas")
        .select("*")
        .order("data_inicio", { ascending: false })
      
      if (error) throw error
      return data as Meta[]
    }
  })
}

export const useCreateMeta = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (meta: Omit<Meta, "id" | "valor_atual" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("metas")
        .insert(meta)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas"] })
      toast({
        title: "Meta criada com sucesso!",
        description: "A meta foi registrada no sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateMeta = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...meta }: Partial<Meta> & { id: string }) => {
      const { data, error } = await supabase
        .from("metas")
        .update(meta)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas"] })
      toast({
        title: "Meta atualizada com sucesso!",
        description: "As informações da meta foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteMeta = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("metas")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas"] })
      toast({
        title: "Meta excluída com sucesso!",
        description: "A meta foi removida do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir meta",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}