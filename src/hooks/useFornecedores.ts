
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
          fornecedor_tags (
            tag_id,
            tags (
              id,
              nome,
              cor
            )
          )
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
    mutationFn: async ({ fornecedor, tags }: { fornecedor: Omit<Fornecedor, "id" | "created_at" | "updated_at">, tags: string[] }) => {
      const { data: fornecedorData, error: fornecedorError } = await supabase
        .from("fornecedores")
        .insert(fornecedor)
        .select()
        .single()
      
      if (fornecedorError) throw fornecedorError
      
      if (tags && tags.length > 0) {
        const tagRelations = tags.map(tagId => ({
          fornecedor_id: fornecedorData.id,
          tag_id: tagId
        }))
        
        const { error: tagError } = await supabase
          .from("fornecedor_tags")
          .insert(tagRelations)
        
        if (tagError) throw tagError
      }
      
      return fornecedorData
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

export const useUpdateFornecedor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, fornecedor, tags }: { id: string, fornecedor: Partial<Fornecedor>, tags: string[] }) => {
      const { data: fornecedorData, error: fornecedorError } = await supabase
        .from("fornecedores")
        .update(fornecedor)
        .eq("id", id)
        .select()
        .single()
      
      if (fornecedorError) throw fornecedorError
      
      await supabase
        .from("fornecedor_tags")
        .delete()
        .eq("fornecedor_id", id)
      
      if (tags && tags.length > 0) {
        const tagRelations = tags.map(tagId => ({
          fornecedor_id: id,
          tag_id: tagId
        }))
        
        const { error: tagError } = await supabase
          .from("fornecedor_tags")
          .insert(tagRelations)
        
        if (tagError) throw tagError
      }
      
      return fornecedorData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      toast({
        title: "Fornecedor atualizado com sucesso!",
        description: "As informações do fornecedor foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar fornecedor",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteFornecedor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fornecedores"] })
      toast({
        title: "Fornecedor excluído com sucesso!",
        description: "O fornecedor foi removido do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir fornecedor",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
