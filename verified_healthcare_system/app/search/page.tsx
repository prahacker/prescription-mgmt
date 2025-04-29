"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/patients/search?query=${query}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Search</h1>
      <Card>
        <CardHeader><CardTitle>Search by Name or Contact</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patients..." />
            <Button type="submit"><Search className="mr-2 h-4 w-4" /> Search</Button>
          </form>
          <ul className="space-y-2">
            {results.map((patient) => (
              <li key={patient.id} className="border p-2 rounded">{patient.name} — {patient.contact_info}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
