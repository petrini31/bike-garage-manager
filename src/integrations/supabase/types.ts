export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          numero_cliente: number
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          numero_cliente?: number
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          numero_cliente?: number
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fornecedor_produtos: {
        Row: {
          codigo_barras: string
          created_at: string
          fornecedor_id: string | null
          id: string
          preco_fornecedor: number | null
          produto_id: string | null
        }
        Insert: {
          codigo_barras: string
          created_at?: string
          fornecedor_id?: string | null
          id?: string
          preco_fornecedor?: number | null
          produto_id?: string | null
        }
        Update: {
          codigo_barras?: string
          created_at?: string
          fornecedor_id?: string | null
          id?: string
          preco_fornecedor?: number | null
          produto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedor_produtos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedor_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedor_tags: {
        Row: {
          fornecedor_id: string
          tag_id: string
        }
        Insert: {
          fornecedor_id: string
          tag_id: string
        }
        Update: {
          fornecedor_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fornecedor_tags_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fornecedor_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          ativo: boolean
          cidade: string | null
          cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cidade?: string | null
          cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cidade?: string | null
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gastos: {
        Row: {
          categoria: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string | null
          id: string
          nome: string
          recorrente: boolean | null
          status: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          nome: string
          recorrente?: boolean | null
          status?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          recorrente?: boolean | null
          status?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      metas: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          nome: string
          updated_at: string
          valor_atual: number
          valor_objetivo: number
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          nome: string
          updated_at?: string
          valor_atual?: number
          valor_objetivo?: number
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          nome?: string
          updated_at?: string
          valor_atual?: number
          valor_objetivo?: number
        }
        Relationships: []
      }
      metas_faturamento: {
        Row: {
          created_at: string
          id: string
          meta_anual: number
          meta_mensal: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_anual?: number
          meta_mensal?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_anual?: number
          meta_mensal?: number
          updated_at?: string
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          cliente_cpf_cnpj: string | null
          cliente_endereco: string | null
          cliente_id: string | null
          cliente_nome: string
          cliente_telefone: string | null
          created_at: string
          desconto_total: number | null
          id: string
          motivo_cancelamento: string | null
          numero_os: number
          observacoes: string | null
          status_id: string | null
          updated_at: string
          valor_final: number
          valor_total: number
        }
        Insert: {
          cliente_cpf_cnpj?: string | null
          cliente_endereco?: string | null
          cliente_id?: string | null
          cliente_nome: string
          cliente_telefone?: string | null
          created_at?: string
          desconto_total?: number | null
          id?: string
          motivo_cancelamento?: string | null
          numero_os?: number
          observacoes?: string | null
          status_id?: string | null
          updated_at?: string
          valor_final?: number
          valor_total?: number
        }
        Update: {
          cliente_cpf_cnpj?: string | null
          cliente_endereco?: string | null
          cliente_id?: string | null
          cliente_nome?: string
          cliente_telefone?: string | null
          created_at?: string
          desconto_total?: number | null
          id?: string
          motivo_cancelamento?: string | null
          numero_os?: number
          observacoes?: string | null
          status_id?: string | null
          updated_at?: string
          valor_final?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status_os"
            referencedColumns: ["id"]
          },
        ]
      }
      os_itens: {
        Row: {
          created_at: string
          desconto: number | null
          descricao: string
          id: string
          numero_item: number
          os_id: string | null
          preco_unitario: number
          quantidade: number
          total: number
        }
        Insert: {
          created_at?: string
          desconto?: number | null
          descricao: string
          id?: string
          numero_item: number
          os_id?: string | null
          preco_unitario?: number
          quantidade?: number
          total?: number
        }
        Update: {
          created_at?: string
          desconto?: number | null
          descricao?: string
          id?: string
          numero_item?: number
          os_id?: string | null
          preco_unitario?: number
          quantidade?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "os_itens_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_tags: {
        Row: {
          produto_id: string
          tag_id: string
        }
        Insert: {
          produto_id: string
          tag_id: string
        }
        Update: {
          produto_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_tags_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          codigo_barras: string | null
          created_at: string
          estoque_minimo: number | null
          fornecedor_id: string | null
          foto_url: string | null
          id: string
          lucro: number | null
          nome: string
          preco_compra: number | null
          preco_venda: number | null
          quantidade: number
          sku: string | null
          status: string
          tipo: string | null
          updated_at: string
        }
        Insert: {
          codigo_barras?: string | null
          created_at?: string
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          foto_url?: string | null
          id?: string
          lucro?: number | null
          nome: string
          preco_compra?: number | null
          preco_venda?: number | null
          quantidade?: number
          sku?: string | null
          status?: string
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          codigo_barras?: string | null
          created_at?: string
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          foto_url?: string | null
          id?: string
          lucro?: number | null
          nome?: string
          preco_compra?: number | null
          preco_venda?: number | null
          quantidade?: number
          sku?: string | null
          status?: string
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas_manuais: {
        Row: {
          created_at: string
          data: string
          descricao: string
          id: string
          valor: number
        }
        Insert: {
          created_at?: string
          data: string
          descricao: string
          id?: string
          valor?: number
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          valor?: number
        }
        Relationships: []
      }
      status_os: {
        Row: {
          cor: string
          created_at: string
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          cor: string
          created_at?: string
          id?: string
          nome: string
          ordem?: number
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      tags: {
        Row: {
          cor: string
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cor: string
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          login: string
          nome: string
          senha_hash: string
          telefone: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: string
          login: string
          nome: string
          senha_hash: string
          telefone?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          login?: string
          nome?: string
          senha_hash?: string
          telefone?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
