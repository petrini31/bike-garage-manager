
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Cliente } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useClientes = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nome")
      
      if (error) throw error
      return data as Cliente[]
    }
  })
}

export const useCreateCliente = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("clientes")
        .insert(cliente)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast({
        title: "Cliente criado com sucesso!",
        description: "O cliente foi adicionado ao sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar cliente",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateCliente = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...cliente }: Partial<Cliente> & { id: string }) => {
      const { data, error } = await supabase
        .from("clientes")
        .update(cliente)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast({
        title: "Cliente atualizado com sucesso!",
        description: "As informações do cliente foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteCliente = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast({
        title: "Cliente excluído com sucesso!",
        description: "O cliente foi removido do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
