"use client"

import { Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Exam Management</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 w-64 h-9 bg-gray-50 border-gray-200"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <User className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
