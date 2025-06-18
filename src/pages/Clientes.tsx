
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit } from "lucide-react"

const Clientes = () => {
  const mockClientes = [
    { id: 1, nome: "João Silva", telefone: "(11) 99999-9999", email: "joao@email.com", totalOs: 5, valorTotal: "R$ 850,00" },
    { id: 2, nome: "Maria Santos", telefone: "(11) 88888-8888", email: "maria@email.com", totalOs: 3, valorTotal: "R$ 420,00" },
    { id: 3, nome: "Pedro Costa", telefone: "(11) 77777-7777", email: "pedro@email.com", totalOs: 8, valorTotal: "R$ 1.250,00" },
    { id: 4, nome: "Ana Lima", telefone: "(11) 66666-6666", email: "ana@email.com", totalOs: 2, valorTotal: "R$ 320,00" },
    { id: 5, nome: "Carlos Oliveira", telefone: "(11) 55555-5555", email: "carlos@email.com", totalOs: 6, valorTotal: "R$ 980,00" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
          <Edit className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Lista de Clientes</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar cliente..." className="w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-full flex items-center justify-center">
                    <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300">
                      {cliente.nome.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{cliente.nome}</p>
                    <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                    <p className="text-sm text-muted-foreground">{cliente.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">O.S. Total</p>
                    <p className="font-bold text-foreground">{cliente.totalOs}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-bold text-foreground">{cliente.valorTotal}</p>
                  </div>
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

export default Clientes;
