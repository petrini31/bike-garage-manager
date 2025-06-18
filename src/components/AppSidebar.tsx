
import { NavLink, useLocation } from "react-router-dom"
import { 
  FileText, 
  Calendar, 
  Search,
  Edit,
  TrendingUp,
  Users,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", url: "/", icon: Calendar },
  { title: "Ordens de Serviço", url: "/ordens-servico", icon: FileText },
  { title: "Clientes", url: "/clientes", icon: Search },
  { title: "Estoque", url: "/estoque", icon: Edit },
  { title: "Fornecedores", url: "/fornecedores", icon: Users },
  { title: "Faturamento", url: "/faturamento", icon: TrendingUp },
  { title: "Administração", url: "/admin", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const collapsed = state === "collapsed"
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50"

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="offcanvas"
    >
      <SidebarTrigger className="m-2 self-end text-sidebar-foreground hover:bg-sidebar-accent" />

      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">GB</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-sidebar-foreground font-semibold">Garagem Bike</h2>
                <p className="text-sidebar-foreground/70 text-xs">Sistema de Gestão</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80">Menu Principal</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
