"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

export default function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/patients/search?query=${encodeURIComponent(searchTerm)}`)

      if (!res.ok) {
        throw new Error("Failed to fetch patients")
      }

      const data = await res.json()
      setPatients(data)
      setError("")
    } catch (err: any) {
      console.error(err)
      setError("Error fetching patients. Check the server or console.")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </form>

          {error && <p className="text-red-500">{error}</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.dob || "—"}</TableCell>
                    <TableCell>{patient.lastVisit || "—"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
