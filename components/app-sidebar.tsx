import { Sidebar } from "@/components/ui/sidebar"
import type { Dispatch, SetStateAction } from "react"

interface AppSidebarProps {
  collapsed?: boolean;
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
}

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
  return <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
}
