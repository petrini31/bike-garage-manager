
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Building } from "lucide-react"

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const mockFornecedores = [
    { 
      id: 1, 
      cnpj: "12.345.678/0001-90", 
      nome: "Bike Parts Ltda", 
      telefone: "(11) 3456-7890", 
      email: "contato@bikeparts.com.br",
      cidade: "São Paulo",
      estado: "SP",
      produtos: 25,
      status: "Ativo"
    },
    { 
      id: 2, 
      cnpj: "98.765.432/0001-10", 
      nome: "Shimano Brasil", 
      telefone: "(11) 2345-6789", 
      email: "vendas@shimano.com.br",
      cidade: "Atibaia",
      estado: "SP",
      produtos: 45,
      status: "Ativo"
    },
    { 
      id: 3, 
      cnpj: "11.222.333/0001-44", 
      nome: "Trek Components", 
      telefone: "(11) 4567-8901", 
      email: "suporte@trek.com.br",
      cidade: "Campinas",
      estado: "SP",
      produtos: 18,
      status: "Inativo"
    }
  ]

  const filteredFornecedores = mockFornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm) ||
    fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie seus fornecedores e produtos</p>
        </div>
        <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total de Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{mockFornecedores.length}</p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Fornecedores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {mockFornecedores.filter(f => f.status === "Ativo").length}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Produtos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brilliant-blue-600">
              {mockFornecedores.reduce((acc, f) => acc + f.produtos, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Média de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(mockFornecedores.reduce((acc, f) => acc + f.produtos, 0) / mockFornecedores.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Lista de Fornecedores</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, CNPJ ou email..." 
                className="w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFornecedores.map((fornecedor) => (
              <div key={fornecedor.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-brilliant-blue-700 dark:text-brilliant-blue-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{fornecedor.nome}</p>
                    <p className="text-sm text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{fornecedor.email}</span>
                      <span>{fornecedor.telefone}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{fornecedor.cidade} - {fornecedor.estado}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Produtos</p>
                    <p className="font-bold text-foreground text-lg">{fornecedor.produtos}</p>
                  </div>
                  <Badge className={getStatusColor(fornecedor.status)}>
                    {fornecedor.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
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

export default Fornecedores;
