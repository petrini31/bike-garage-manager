
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { MetaFaturamento } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useMetasFaturamento = () => {
  return useQuery({
    queryKey: ["metas-faturamento"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metas_faturamento")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      
      if (error) throw error
      return data as MetaFaturamento
    }
  })
}

export const useUpdateMetasFaturamento = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...metas }: Partial<MetaFaturamento> & { id: string }) => {
      const { data, error } = await supabase
        .from("metas_faturamento")
        .update(metas)
        .eq("id", id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas-faturamento"] })
      toast({
        title: "Metas atualizadas com sucesso!",
        description: "As metas de faturamento foram atualizadas."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar metas",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
