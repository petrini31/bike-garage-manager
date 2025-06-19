
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Eye, Plus } from "lucide-react"
import { useClientes } from "@/hooks/useClientes"
import { ClienteDialog } from "@/components/dialogs/ClienteDialog"
import { Cliente } from "@/types/database"

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create")

  const { data: clientes, isLoading } = useClientes()

  const filteredClientes = clientes?.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone?.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf_cnpj?.includes(searchTerm) ||
    cliente.numero_cliente?.toString().includes(searchTerm)
  ) || []

  const handleNewCliente = () => {
    setSelectedCliente(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleViewCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setDialogMode("view")
    setDialogOpen(true)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando clientes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <Button onClick={handleNewCliente} className="bg-brilliant-blue-600 hover:bg-brilliant-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Lista de Clientes</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome, telefone, email ou CPF/CNPJ..." 
                className="w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClientes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado."}
              </div>
            ) : (
              filteredClientes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-brilliant-blue-100 dark:bg-brilliant-blue-900 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-brilliant-blue-700 dark:text-brilliant-blue-300 text-xs">
                        {String(cliente.numero_cliente).padStart(5, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{cliente.nome}</p>
                      <p className="text-lg font-bold text-brilliant-blue-600">{cliente.telefone}</p>
                      <p className="text-sm text-muted-foreground">{cliente.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                      <p className="font-medium text-foreground">{cliente.cpf_cnpj || "N/A"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCliente(cliente)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewCliente(cliente)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={selectedCliente}
        mode={dialogMode}
      />
    </div>
  );
};

export default Clientes;
