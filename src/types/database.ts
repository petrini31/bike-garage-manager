export interface Cliente {
  id: string
  numero_cliente: number
  nome: string
  telefone?: string
  email?: string
  endereco?: string
  cpf_cnpj?: string
  created_at: string
  updated_at: string
}

export interface StatusOS {
  id: string
  nome: string
  cor: string
  ordem: number
  created_at: string
}

export interface OrdemServico {
  id: string
  numero_os: number
  cliente_id?: string
  cliente_nome: string
  cliente_telefone?: string
  cliente_endereco?: string
  cliente_cpf_cnpj?: string
  status_id?: string
  valor_total: number
  desconto_total?: number
  valor_final: number
  observacoes?: string
  motivo_cancelamento?: string
  created_at: string
  updated_at: string
  status_os?: StatusOS
  clientes?: Cliente
}

export interface OSItem {
  id: string
  os_id: string
  numero_item: number
  quantidade: number
  descricao: string
  preco_unitario: number
  desconto?: number
  total: number
  created_at: string
}

export interface Fornecedor {
  id: string
  cnpj: string
  nome: string
  telefone?: string
  endereco?: string
  email?: string
  cidade?: string
  estado?: string
  ativo: boolean
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface Tag {
  id: string
  nome: string
  cor: string
  created_at: string
}

export interface Produto {
  id: string
  nome: string
  sku?: string
  codigo_barras?: string
  quantidade: number
  estoque_minimo?: number
  preco_compra?: number
  preco_venda?: number
  lucro?: number
  foto_url?: string
  status: string
  tipo?: string
  fornecedor_id?: string
  created_at: string
  updated_at: string
  fornecedores?: Fornecedor
  tags?: Tag[]
}

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone?: string
  login: string
  senha_hash: string
  user_type: 'administrador master' | 'administrador' | 'mecanico'
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Gasto {
  id: string
  nome: string
  descricao?: string
  valor: number
  data_vencimento?: string
  data_pagamento?: string
  categoria: string
  status: 'Pendente' | 'Pago' | 'Vencido'
  recorrente?: boolean
  created_at: string
  updated_at: string
}

export interface MetaFaturamento {
  id: string
  meta_mensal: number
  meta_anual: number
  created_at: string
  updated_at: string
}
