-- Criar tabela para receitas manuais
CREATE TABLE public.receitas_manuais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL DEFAULT 0,
  data DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.receitas_manuais ENABLE ROW LEVEL SECURITY;

-- Política para acesso total
CREATE POLICY "Permitir acesso total receitas_manuais" 
ON public.receitas_manuais 
FOR ALL 
USING (true);

-- Criar tabela para metas
CREATE TABLE public.metas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  valor_objetivo NUMERIC NOT NULL DEFAULT 0,
  valor_atual NUMERIC NOT NULL DEFAULT 0,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

-- Política para acesso total
CREATE POLICY "Permitir acesso total metas" 
ON public.metas 
FOR ALL 
USING (true);

-- Trigger para updated_at na tabela metas
CREATE TRIGGER update_metas_updated_at
BEFORE UPDATE ON public.metas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para atualizar valor atual das metas
CREATE OR REPLACE FUNCTION public.atualizar_metas_faturamento()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar todas as metas ativas quando uma O.S. for finalizada
  IF NEW.status_id IS DISTINCT FROM OLD.status_id THEN
    -- Verificar se o novo status é 'Finalizada'
    IF EXISTS (
      SELECT 1 FROM status_os 
      WHERE id = NEW.status_id AND nome = 'Finalizada'
    ) THEN
      -- Atualizar valor_atual de todas as metas ativas
      UPDATE public.metas 
      SET valor_atual = (
        SELECT COALESCE(SUM(os.valor_final), 0)
        FROM ordens_servico os
        JOIN status_os st ON os.status_id = st.id
        WHERE st.nome = 'Finalizada'
        AND DATE(os.updated_at) BETWEEN metas.data_inicio AND metas.data_fim
      )
      WHERE data_fim >= CURRENT_DATE;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar a função quando o status de uma O.S. mudar
CREATE TRIGGER trigger_atualizar_metas_faturamento
AFTER UPDATE OF status_id ON public.ordens_servico
FOR EACH ROW
EXECUTE FUNCTION public.atualizar_metas_faturamento();