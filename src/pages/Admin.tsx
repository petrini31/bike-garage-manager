
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Palette
} from "lucide-react"

const Admin = () => {
  const [activeTab, setActiveTab] = useState("usuarios")

  const mockUsuarios = [
    { id: 1, nome: "Admin Master", email: "admin@garagembike.com", tipo: "Administrador Master", status: "Ativo", ultimoAcesso: "18/06/2025" },
    { id: 2, nome: "João Silva", email: "joao@garagembike.com", tipo: "Administrador", status: "Ativo", ultimoAcesso: "17/06/2025" },
    { id: 3, nome: "Carlos Mecânico", email: "carlos@garagembike.com", tipo: "Mecânico", status: "Ativo", ultimoAcesso: "18/06/2025" },
    { id: 4, nome: "Maria Santos", email: "maria@garagembike.com", tipo: "Mecânico", status: "Inativo", ultimoAcesso: "10/06/2025" }
  ]

  const statusOS = [
    { id: 1, nome: "Finalizada", cor: "#2563eb", ordem: 6 },
    { id: 2, nome: "Pronta Para Retirada", cor: "#0ea5e9", ordem: 5 },
    { id: 3, nome: "Em Serviço", cor: "#ea580c", ordem: 4 },
    { id: 4, nome: "Aprovada", cor: "#16a34a", ordem: 3 },
    { id: 5, nome: "Aguardando aprovação", cor: "#eab308", ordem: 2 },
    { id: 6, nome: "Cancelada", cor: "#dc2626", ordem: 1 }
  ]

  const statusEstoque = [
    { id: 1, nome: "Em Estoque", cor: "#16a34a", descricao: "Produto disponível" },
    { id: 2, nome: "Estoque Baixo", cor: "#eab308", descricao: "Quantidade limitada" },
    { id: 3, nome: "Fora de Estoque", cor: "#dc2626", descricao: "Produto indisponível" },
    { id: 4, nome: "Descontinuado", cor: "#6b7280", descricao: "Produto descontinuado" }
  ]

  const getUserStatusColor = (status: string) => {
    return status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case "Administrador Master": return "bg-purple-100 text-purple-800"
      case "Administrador": return "bg-blue-100 text-blue-800"
      case "Mecânico": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
          <p className="text-muted-foreground">Configurações avançadas do sistema</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          Administrador Master
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="status-os">
            <Settings className="mr-2 h-4 w-4" />
            Status O.S.
          </TabsTrigger>
          <TabsTrigger value="status-estoque">
            <Palette className="mr-2 h-4 w-4" />
            Status Estoque
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Gerenciamento de Usuários</h2>
            <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{mockUsuarios.length}</p>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Usuários Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {mockUsuarios.filter(u => u.status === "Ativo").length}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Administradores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {mockUsuarios.filter(u => u.tipo.includes("Administrador")).length}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Mecânicos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {mockUsuarios.filter(u => u.tipo === "Mecânico").length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Lista de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsuarios.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-full flex items-center justify-center">
                        <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300">
                          {usuario.nome.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground">{usuario.email}</p>
                        <p className="text-xs text-muted-foreground">Último acesso: {usuario.ultimoAcesso}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getTipoColor(usuario.tipo)}>
                        {usuario.tipo}
                      </Badge>
                      <Badge className={getUserStatusColor(usuario.status)}>
                        {usuario.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {usuario.status === "Ativo" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
        </TabsContent>

        <TabsContent value="status-os" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Status das Ordens de Serviço</h2>
            <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Status
            </Button>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Configuração de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusOS.map((status) => (
                  <div key={status.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: status.cor }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{status.nome}</p>
                        <p className="text-sm text-muted-foreground">Ordem: {status.ordem}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Cor:</span>
                        <Input 
                          type="color" 
                          value={status.cor} 
                          className="w-12 h-8 p-0 border-0" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="status-estoque" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Status do Estoque</h2>
            <Button className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Status
            </Button>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Configuração de Status do Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusEstoque.map((status) => (
                  <div key={status.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: status.cor }}
                      />
                      <div>
                        <p className="font-semibold text-foreground">{status.nome}</p>
                        <p className="text-sm text-muted-foreground">{status.descricao}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Cor:</span>
                        <Input 
                          type="color" 
                          value={status.cor} 
                          className="w-12 h-8 p-0 border-0" 
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
