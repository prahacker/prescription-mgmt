"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ChevronDown, ChevronRight } from "lucide-react"

export default function History() {
  const [patientId, setPatientId] = useState("1")
  const [searchTerm, setSearchTerm] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/patients/${patientId}/history`)
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.error("Error fetching history:", err)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [patientId])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/patients/${patientId}/history`)
      const data = await res.json()

      const filtered = data.filter(
        (item: any) =>
          item.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setHistory(filtered)
    } catch (err) {
      console.error("Search failed:", err)
    }
  }

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient History</h1>
      <Card>
        <CardHeader><CardTitle>Search History</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="max-w-[150px]"
            />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit"><Search className="mr-2 h-4 w-4" /> Search</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No history found.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.includes(item.id)
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.details}</TableCell>
                    </TableRow>
                    {expandedRows.includes(item.id) && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="p-4 bg-muted rounded-md">
                            {item.additional_info || "No additional details."}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
