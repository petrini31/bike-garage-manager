
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tag } from "@/types/database"
import { toast } from "@/hooks/use-toast"

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("nome")
      
      if (error) throw error
      return data as Tag[]
    }
  })
}

export const useCreateTag = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (tag: Omit<Tag, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("tags")
        .insert(tag)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      toast({
        title: "Tag criada com sucesso!",
        description: "A tag foi adicionada ao sistema."
      })
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar tag",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
