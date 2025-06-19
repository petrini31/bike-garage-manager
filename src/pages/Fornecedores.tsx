
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Building } from "lucide-react"
import { useFornecedores } from "@/hooks/useFornecedores"
import { FornecedorDialog } from "@/components/dialogs/FornecedorDialog"
import { Fornecedor } from "@/types/database"

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedFornecedor, setSelectedFornecedor] = useState<Fornecedor | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")

  const { data: fornecedores, isLoading } = useFornecedores()

  const filteredFornecedores = fornecedores?.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm) ||
    fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleNewFornecedor = () => {
    setSelectedFornecedor(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleEditFornecedor = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleViewFornecedor = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor)
    setDialogMode("view")
    setDialogOpen(true)
  }

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando fornecedores...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie seus fornecedores e produtos</p>
        </div>
        <Button onClick={handleNewFornecedor} className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
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
            <p className="text-2xl font-bold text-foreground">{fornecedores?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Fornecedores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {fornecedores?.filter(f => f.ativo).length || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Fornecedores Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {fornecedores?.filter(f => !f.ativo).length || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Com Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brilliant-blue-600">
              {fornecedores?.filter(f => f.tags && f.tags.length > 0).length || 0}
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
            {filteredFornecedores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum fornecedor encontrado." : "Nenhum fornecedor cadastrado."}
              </div>
            ) : (
              filteredFornecedores.map((fornecedor) => (
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
                      {fornecedor.tags && fornecedor.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {fornecedor.tags.map((tag) => (
                            <Badge 
                              key={tag.id} 
                              style={{ backgroundColor: tag.cor + "20", color: tag.cor }}
                              className="text-xs"
                            >
                              #{tag.nome}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <Badge className={getStatusColor(fornecedor.ativo)}>
                      {fornecedor.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditFornecedor(fornecedor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewFornecedor(fornecedor)}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <FornecedorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fornecedor={selectedFornecedor}
        mode={dialogMode}
      />
    </div>
  );
};

export default Fornecedores;
