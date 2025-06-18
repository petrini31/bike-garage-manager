
-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  cpf_cnpj TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de status personalizáveis
CREATE TABLE public.status_os (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir status padrão
INSERT INTO public.status_os (nome, cor, ordem) VALUES
  ('Recebida', '#6B7280', 1),
  ('Em Análise', '#3B82F6', 2),
  ('Aguardando Aprovação', '#F59E0B', 3),
  ('Aprovada', '#10B981', 4),
  ('Em Serviço', '#F97316', 5),
  ('Pronta para Retirada', '#06B6D4', 6),
  ('Finalizada', '#8B5CF6', 7),
  ('Cancelada', '#EF4444', 8);

-- Tabela de ordens de serviço
CREATE TABLE public.ordens_servico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_os SERIAL UNIQUE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_endereco TEXT,
  cliente_cpf_cnpj TEXT,
  status_id UUID REFERENCES public.status_os(id),
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  desconto_total DECIMAL(10,2) DEFAULT 0,
  valor_final DECIMAL(10,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  motivo_cancelamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de itens da ordem de serviço
CREATE TABLE public.os_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  os_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  numero_item INTEGER NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  descricao TEXT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
  desconto DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cnpj TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  email TEXT,
  cidade TEXT,
  estado TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de tags
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  cor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de produtos/estoque
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sku TEXT UNIQUE,
  codigo_barras TEXT,
  quantidade INTEGER NOT NULL DEFAULT 0,
  preco_compra DECIMAL(10,2) DEFAULT 0,
  preco_venda DECIMAL(10,2) DEFAULT 0,
  lucro DECIMAL(10,2) GENERATED ALWAYS AS (preco_venda - preco_compra) STORED,
  foto_url TEXT,
  status TEXT NOT NULL DEFAULT 'Em Estoque',
  fornecedor_id UUID REFERENCES public.fornecedores(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relacionamento produto-tags
CREATE TABLE public.produto_tags (
  produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (produto_id, tag_id)
);

-- Tabela de produtos dos fornecedores
CREATE TABLE public.fornecedor_produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  codigo_barras TEXT NOT NULL,
  preco_fornecedor DECIMAL(10,2),
  produto_id UUID REFERENCES public.produtos(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_os ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedor_produtos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir acesso total por enquanto)
CREATE POLICY "Permitir acesso total" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.status_os FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.ordens_servico FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.os_itens FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.fornecedores FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.tags FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.produtos FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.produto_tags FOR ALL USING (true);
CREATE POLICY "Permitir acesso total" ON public.fornecedor_produtos FOR ALL USING (true);

-- Função para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON public.produtos FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_ordens_servico_updated_at BEFORE UPDATE ON public.ordens_servico FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
