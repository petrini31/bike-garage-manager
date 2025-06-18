
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Edit } from "lucide-react"

const Estoque = () => {
  const mockEstoque = [
    { id: 1, nome: "Pneu MTB 29x2.25", codigo: "PN001", precoCompra: "R$ 45,00", precoVenda: "R$ 89,00", quantidade: 12, status: "Em Estoque" },
    { id: 2, nome: "Corrente Shimano 11v", codigo: "CR002", precoCompra: "R$ 35,00", precoVenda: "R$ 69,00", quantidade: 8, status: "Em Estoque" },
    { id: 3, nome: "Freio Disco Hidráulico", codigo: "FR003", precoCompra: "R$ 120,00", precoVenda: "R$ 230,00", quantidade: 3, status: "Estoque Baixo" },
    { id: 4, nome: "Guidão MTB 780mm", codigo: "GU004", precoCompra: "R$ 25,00", precoVenda: "R$ 49,00", quantidade: 15, status: "Em Estoque" },
    { id: 5, nome: "Pedal Clip SPD", codigo: "PD005", precoCompra: "R$ 80,00", precoVenda: "R$ 159,00", quantidade: 0, status: "Sem Estoque" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return "bg-green-100 text-green-800"
      case "Estoque Baixo":
        return "bg-yellow-100 text-yellow-800"
      case "Sem Estoque":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerencie peças e acessórios</p>
        </div>
        <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
          <Edit className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">156</p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">142</p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">8</p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sem Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">6</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Itens do Estoque</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar item..." className="w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEstoque.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300 text-xs">
                      {item.codigo}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.nome}</p>
                    <p className="text-sm text-muted-foreground">Código: {item.codigo}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Compra: {item.precoCompra}</span>
                      <span>Venda: {item.precoVenda}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-bold text-foreground text-lg">{item.quantidade}</p>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estoque;
