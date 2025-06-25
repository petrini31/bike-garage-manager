
-- Criar tabela para gastos da empresa
CREATE TABLE public.gastos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  valor NUMERIC NOT NULL DEFAULT 0,
  data_vencimento DATE,
  data_pagamento DATE,
  categoria TEXT DEFAULT 'Outros',
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Pago', 'Vencido')),
  recorrente BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para metas e projeções editáveis
CREATE TABLE public.metas_faturamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meta_mensal NUMERIC NOT NULL DEFAULT 0,
  meta_anual NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir meta padrão
INSERT INTO public.metas_faturamento (meta_mensal, meta_anual) 
VALUES (18000, 216000);

-- Trigger para atualizar updated_at em gastos
CREATE TRIGGER update_gastos_updated_at
  BEFORE UPDATE ON public.gastos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em metas_faturamento
CREATE TRIGGER update_metas_faturamento_updated_at
  BEFORE UPDATE ON public.metas_faturamento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Verificar se a tabela produto_tags existe e tem as colunas corretas
-- Se não existir, criar a relação many-to-many entre produtos e tags
CREATE TABLE IF NOT EXISTS public.produto_tags (
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (produto_id, tag_id)
);
