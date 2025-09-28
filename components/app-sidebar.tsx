import { Sidebar } from "@/components/ui/sidebar"

interface AppSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  return <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
}
