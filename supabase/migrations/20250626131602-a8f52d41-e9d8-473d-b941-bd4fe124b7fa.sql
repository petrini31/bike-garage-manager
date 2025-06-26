
-- Verificar se existe a tabela fornecedor_tags (relação many-to-many)
CREATE TABLE IF NOT EXISTS public.fornecedor_tags (
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (fornecedor_id, tag_id)
);

-- Garantir que a trigger para atualizar status do produto existe
CREATE OR REPLACE FUNCTION public.update_produto_status()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.quantidade = 0 THEN
    NEW.status = 'Sem Estoque';
  ELSIF NEW.quantidade <= COALESCE(NEW.estoque_minimo, 5) THEN
    NEW.status = 'Estoque Baixo';
  ELSE
    NEW.status = 'Em Estoque';
  END IF;
  RETURN NEW;
END;
$function$;

-- Aplicar trigger se não existir
DROP TRIGGER IF EXISTS update_produto_status_trigger ON public.produtos;
CREATE TRIGGER update_produto_status_trigger
  BEFORE INSERT OR UPDATE ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_produto_status();

-- Garantir que as foreign keys existem
ALTER TABLE public.produto_tags 
  DROP CONSTRAINT IF EXISTS produto_tags_produto_id_fkey,
  DROP CONSTRAINT IF EXISTS produto_tags_tag_id_fkey;

ALTER TABLE public.produto_tags 
  ADD CONSTRAINT produto_tags_produto_id_fkey 
    FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE,
  ADD CONSTRAINT produto_tags_tag_id_fkey 
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

ALTER TABLE public.fornecedor_tags 
  DROP CONSTRAINT IF EXISTS fornecedor_tags_fornecedor_id_fkey,
  DROP CONSTRAINT IF EXISTS fornecedor_tags_tag_id_fkey;

ALTER TABLE public.fornecedor_tags 
  ADD CONSTRAINT fornecedor_tags_fornecedor_id_fkey 
    FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  ADD CONSTRAINT fornecedor_tags_tag_id_fkey 
    FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;
