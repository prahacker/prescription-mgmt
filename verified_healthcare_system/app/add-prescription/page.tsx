"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddPrescription() {
  const [form, setForm] = useState({
    patient_id: "",
    date: "",
    medication: "",
    dosage_instructions: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data:", form);

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok) {
        alert("✅ Prescription submitted successfully!");
        setForm({ patient_id: "", date: "", medication: "", dosage_instructions: "" });
      } else {
        alert("❌ Failed to submit: " + data.message);
      }
    } catch (err) {
      console.error("❌ Network or server error:", err);
      alert("❌ Network error! Check console for details.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Prescription</h1>
      <Card>
        <CardHeader><CardTitle>Manual Entry</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Input name="patient_id" value={form.patient_id} onChange={handleChange} placeholder="Patient ID" required />
            <Input name="date" value={form.date} onChange={handleChange} placeholder="YYYY-MM-DD" required />
            <Input name="medication" value={form.medication} onChange={handleChange} placeholder="Medication" required />
            <Input name="dosage_instructions" value={form.dosage_instructions} onChange={handleChange} placeholder="Dosage Instructions" />
            <Button type="submit">Add Prescription</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
