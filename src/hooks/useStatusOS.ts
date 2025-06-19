
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { StatusOS } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useStatusOS = () => {
  return useQuery({
    queryKey: ["status-os"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_os")
        .select("*")
        .order("ordem")
      
      if (error) throw error
      return data as StatusOS[]
    }
  })
}

export const useCreateStatusOS = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (status: Omit<StatusOS, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("status_os")
        .insert(status)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status-os"] })
      toast({
        title: "Status criado com sucesso!",
        description: "O status foi adicionado ao sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar status",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateStatusOS = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...status }: Partial<StatusOS> & { id: string }) => {
      const { data, error } = await supabase
        .from("status_os")
        .update(status)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status-os"] })
      toast({
        title: "Status atualizado com sucesso!",
        description: "As informações do status foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteStatusOS = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("status_os")
        .delete()
        .eq("id", id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status-os"] })
      toast({
        title: "Status excluído com sucesso!",
        description: "O status foi removido do sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir status",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
