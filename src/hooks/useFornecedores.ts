
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
            tags (id, nome, cor, created_at)
          )
        `)
        .order("nome")
      
      if (error) throw error
      
      // Transform the data to match the expected structure with correct types
      return data.map(fornecedor => ({
        ...fornecedor,
        tags: fornecedor.fornecedor_tags?.map(ft => ft.tags).filter(Boolean) || []
      })) as Fornecedor[]
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

export const useUpdateFornecedor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, tags, ...fornecedor }: Partial<Fornecedor> & { id: string, tags?: string[] }) => {
      const { data, error } = await supabase
        .from("fornecedores")
        .update(fornecedor)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      
      // Handle tags if provided
      if (tags !== undefined) {
        // Remove existing tags
        await supabase
          .from("fornecedor_tags")
          .delete()
          .eq("fornecedor_id", id)
        
        // Add new tags
        if (tags.length > 0) {
          const tagRelations = tags.map(tagId => ({
            fornecedor_id: id,
            tag_id: tagId
          }))
          
          const { error: tagsError } = await supabase
            .from("fornecedor_tags")
            .insert(tagRelations)
          
          if (tagsError) throw tagsError
        }
      }
      
      return data
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
