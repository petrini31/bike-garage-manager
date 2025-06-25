
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Gasto } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useGastos = () => {
  return useQuery({
    queryKey: ["gastos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gastos")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      return data as Gasto[]
    }
  })
}

export const useCreateGasto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (gasto: Omit<Gasto, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("gastos")
        .insert(gasto)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      toast({
        title: "Gasto criado com sucesso!",
        description: "O gasto foi registrado no sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar gasto",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateGasto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...gasto }: Partial<Gasto> & { id: string }) => {
      const { data, error } = await supabase
        .from("gastos")
        .update(gasto)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      toast({
        title: "Gasto atualizado com sucesso!",
        description: "As informações do gasto foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar gasto",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteGasto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gastos")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gastos"] })
      toast({
        title: "Gasto excluído com sucesso!",
        description: "O gasto foi removido do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir gasto",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
