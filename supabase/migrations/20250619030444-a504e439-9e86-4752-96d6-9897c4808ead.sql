
-- Adicionar numeração automática aos clientes
ALTER TABLE public.clientes ADD COLUMN numero_cliente SERIAL UNIQUE;

-- Adicionar limite mínimo de estoque para produtos
ALTER TABLE public.produtos ADD COLUMN estoque_minimo INTEGER DEFAULT 5;

-- Criar storage bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true);

-- Política para permitir upload de imagens
CREATE POLICY "Permitir upload de imagens" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'produtos');

CREATE POLICY "Permitir visualização de imagens" ON storage.objects
FOR SELECT USING (bucket_id = 'produtos');

CREATE POLICY "Permitir atualização de imagens" ON storage.objects
FOR UPDATE USING (bucket_id = 'produtos');

CREATE POLICY "Permitir exclusão de imagens" ON storage.objects
FOR DELETE USING (bucket_id = 'produtos');

-- Criar tabela de usuários da plataforma
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  login TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('administrador master', 'administrador', 'mecanico')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para usuários
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política RLS para usuários (permitir acesso total por enquanto)
CREATE POLICY "Permitir acesso total usuarios" ON public.usuarios FOR ALL USING (true);

-- Trigger para atualizar updated_at em usuários
CREATE TRIGGER update_usuarios_updated_at 
BEFORE UPDATE ON public.usuarios 
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Atualizar tabela de produtos para incluir tipo de item (produto ou serviço)
ALTER TABLE public.produtos ADD COLUMN tipo TEXT DEFAULT 'produto' CHECK (tipo IN ('produto', 'servico'));

-- Função para atualizar status do produto baseado na quantidade
CREATE OR REPLACE FUNCTION public.update_produto_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantidade = 0 THEN
    NEW.status = 'Sem Estoque';
  ELSIF NEW.quantidade <= NEW.estoque_minimo THEN
    NEW.status = 'Estoque Baixo';
  ELSE
    NEW.status = 'Em Estoque';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar status automaticamente
CREATE TRIGGER trigger_update_produto_status
BEFORE INSERT OR UPDATE OF quantidade, estoque_minimo ON public.produtos
FOR EACH ROW EXECUTE FUNCTION public.update_produto_status();

-- Adicionar relacionamento fornecedor-tags
CREATE TABLE public.fornecedor_tags (
  fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (fornecedor_id, tag_id)
);

-- Habilitar RLS para fornecedor_tags
ALTER TABLE public.fornecedor_tags ENABLE ROW LEVEL SECURITY;

-- Política RLS para fornecedor_tags
CREATE POLICY "Permitir acesso total fornecedor_tags" ON public.fornecedor_tags FOR ALL USING (true);
