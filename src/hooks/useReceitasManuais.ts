import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

export interface ReceitaManual {
  id: string
  descricao: string
  valor: number
  data: string
  created_at: string
}

export const useReceitasManuais = () => {
  return useQuery({
    queryKey: ["receitas-manuais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receitas_manuais")
        .select("*")
        .order("data", { ascending: false })
      
      if (error) throw error
      return data as ReceitaManual[]
    }
  })
}

export const useCreateReceitaManual = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (receita: Omit<ReceitaManual, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("receitas_manuais")
        .insert(receita)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas-manuais"] })
      toast({
        title: "Receita criada com sucesso!",
        description: "A receita foi registrada no sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar receita",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteReceitaManual = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("receitas_manuais")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas-manuais"] })
      toast({
        title: "Receita excluída com sucesso!",
        description: "A receita foi removida do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir receita",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}