
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Fornecedor } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useFornecedores = () => {
  return useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fornecedores")
        .select(`
          *,
          tags (id, nome, cor)
        `)
        .order("nome")
      
      if (error) throw error
      return data as Fornecedor[]
    }
  })
}

export const useCreateFornecedor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (fornecedor: Omit<Fornecedor, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .insert(fornecedor)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      toast({
        title: "Fornecedor criado com sucesso!",
        description: "O fornecedor foi adicionado ao sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar fornecedor",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
