"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RegisterPatient() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    dob: "",
    gender: "",
    contact_info: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/patients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        alert("✅ Patient registered successfully!")
        setForm({ id: "", name: "", dob: "", gender: "", contact_info: "" })
      } else {
        alert("❌ Failed: " + data.message)
      }
    } catch (err) {
      alert("❌ Network error")
      console.error(err)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register New Patient</h1>
      <Card>
        <CardHeader><CardTitle>Patient Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="id">Patient ID</Label>
              <Input id="id" name="id" value={form.id} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input type="date" id="dob" name="dob" value={form.dob} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" name="gender" value={form.gender} onChange={handleChange} placeholder="Male / Female / Other" />
            </div>
            <div>
              <Label htmlFor="contact_info">Contact Info</Label>
              <Input id="contact_info" name="contact_info" value={form.contact_info} onChange={handleChange} />
            </div>
            <Button type="submit">Register Patient</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
