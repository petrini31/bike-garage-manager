
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useProdutosByTag } from "@/hooks/useProdutos"
import { Tag } from "@/types/database"

interface ProdutosByTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag: Tag | null
}

export const ProdutosByTagDialog = ({ open, onOpenChange, tag }: ProdutosByTagDialogProps) => {
  const { data: produtos, isLoading } = useProdutosByTag(tag?.id || "")

  if (!tag) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Produtos da Tag
            <Badge style={{ backgroundColor: tag.cor + "20", color: tag.cor }}>
              #{tag.nome}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Carregando produtos...</div>
        ) : produtos && produtos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Código de Barras</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço de Compra</TableHead>
                <TableHead>Preço de Venda</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.sku || "-"}</TableCell>
                  <TableCell>{produto.codigo_barras || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={produto.quantidade === 0 ? "destructive" : produto.quantidade <= (produto.estoque_minimo || 5) ? "secondary" : "default"}>
                      {produto.quantidade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {produto.preco_compra ? `R$ ${produto.preco_compra.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    {produto.preco_venda ? `R$ ${produto.preco_venda.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      produto.status === "Sem Estoque" ? "destructive" :
                      produto.status === "Estoque Baixo" ? "secondary" : "default"
                    }>
                      {produto.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum produto encontrado para esta tag.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
