
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
          fornecedores (nome),
          tags (id, nome, cor)
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
    mutationFn: async (produto: Omit<Produto, "id" | "created_at" | "updated_at" | "lucro">) => {
      // Gerar SKU se não fornecido
      if (!produto.sku) {
        const sku = produto.nome.substring(0, 3).toUpperCase() + 
                   (produto.codigo_barras ? produto.codigo_barras.substring(-4) : Math.random().toString(36).substring(2, 6).toUpperCase())
        produto.sku = sku
      }
      
      const { data, error } = await supabase
        .from("produtos")
        .insert(produto)
        .select()
        .single()
      
      if (error) throw error
      return data
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
    mutationFn: async ({ id, ...produto }: Partial<Produto> & { id: string }) => {
      const { data, error } = await supabase
        .from("produtos")
        .update(produto)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
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
