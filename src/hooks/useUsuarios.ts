
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Usuario } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("nome")
      
      if (error) throw error
      return data as Usuario[]
    }
  })
}

export const useCreateUsuario = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (usuario: Omit<Usuario, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("usuarios")
        .insert(usuario)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      toast({
        title: "Usuário criado com sucesso!",
        description: "O usuário foi adicionado ao sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...usuario }: Partial<Usuario> & { id: string }) => {
      const { data, error } = await supabase
        .from("usuarios")
        .update(usuario)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      toast({
        title: "Usuário atualizado com sucesso!",
        description: "As informações do usuário foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      toast({
        title: "Usuário excluído com sucesso!",
        description: "O usuário foi removido do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
