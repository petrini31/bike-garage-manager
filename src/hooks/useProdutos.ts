
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Produto } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select(`
          *,
          fornecedores (
            nome
          ),
          produto_tags (
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
      return data as Produto[]
    }
  })
}

export const useCreateProduto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ produto, tags }: { produto: Omit<Produto, "id" | "created_at" | "updated_at">, tags: string[] }) => {
      if (produto.preco_compra && produto.preco_venda) {
        produto.lucro = produto.preco_venda - produto.preco_compra
      }
      
      const { data: produtoData, error: produtoError } = await supabase
        .from("produtos")
        .insert(produto)
        .select()
        .single()
      
      if (produtoError) throw produtoError
      
      if (tags && tags.length > 0) {
        const tagRelations = tags.map(tagId => ({
          produto_id: produtoData.id,
          tag_id: tagId
        }))
        
        const { error: tagError } = await supabase
          .from("produto_tags")
          .insert(tagRelations)
        
        if (tagError) throw tagError
      }
      
      return produtoData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
      toast({
        title: "Produto criado com sucesso!",
        description: "O produto foi adicionado ao estoque."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateProduto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, produto, tags }: { id: string, produto: Partial<Produto>, tags: string[] }) => {
      if (produto.preco_compra && produto.preco_venda) {
        produto.lucro = produto.preco_venda - produto.preco_compra
      }
      
      const { data: produtoData, error: produtoError } = await supabase
        .from("produtos")
        .update(produto)
        .eq("id", id)
        .select()
        .single()
      
      if (produtoError) throw produtoError
      
      await supabase
        .from("produto_tags")
        .delete()
        .eq("produto_id", id)
      
      if (tags && tags.length > 0) {
        const tagRelations = tags.map(tagId => ({
          produto_id: id,
          tag_id: tagId
        }))
        
        const { error: tagError } = await supabase
          .from("produto_tags")
          .insert(tagRelations)
        
        if (tagError) throw tagError
      }
      
      return produtoData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
      toast({
        title: "Produto atualizado com sucesso!",
        description: "As informações do produto foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteProduto = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("produtos")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
      toast({
        title: "Produto excluído com sucesso!",
        description: "O produto foi removido do estoque."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
