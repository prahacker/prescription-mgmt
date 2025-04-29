"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { PlusCircle, FileText, History, LayoutDashboard, Search } from "lucide-react"

const menuItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/new-case", icon: PlusCircle, label: "New Case" },
  { href: "/new-prescription", icon: FileText, label: "New Prescription" },
  { href: "/patient-search", icon: Search, label: "Patient Search" },
  { href: "/history", icon: History, label: "History" },
  { href: "/upload-prescription", icon: FileText, label: "Read Prescription" }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-muted/40 border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">HealthRx</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <ModeToggle />
      </div>
    </div>
  )
}

