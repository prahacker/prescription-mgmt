"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

const reactivePairs = [
  ["amoxicillin", "metronidazole"],
  ["ibuprofen", "warfarin"],
]

export default function NewPrescription() {
  const [prescription, setPrescription] = useState({
    patientId: "",
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  })

  const [file, setFile] = useState<File | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [reportMsg, setReportMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPrescription((prev) => ({ ...prev, [name]: value }))
  }

  const checkInteraction = () => {
    const meds = [prescription.medication.toLowerCase(), ...prescription.notes.toLowerCase().split(/\s+/)]
    return reactivePairs.some(([a, b]) => meds.includes(a) && meds.includes(b))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    setSubmitSuccess(false)

    const payload = {
      patient_id: Number(prescription.patientId),
      date: new Date().toISOString().split("T")[0],
      medication: prescription.medication,
      dosage_instructions: `Dosage: ${prescription.dosage}, Frequency: ${prescription.frequency}, Duration: ${prescription.duration}. Notes: ${prescription.notes}`,
    }

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to save")
      setSubmitSuccess(true)
    } catch (err) {
      console.error("❌ Submission failed:", err)
      alert("❌ Failed to save prescription. Check console.")
    }

    setSubmitLoading(false)
  }

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  })

  const parseFromOCR = (text: string) => {
    const cleanText = text.replace(/\n/g, " ")
    console.log("🧠 Cleaned OCR text:", cleanText)

    const match = cleanText.match(
      /\d\)\s*(?:TAB\.|CAP\.)?\s*([A-Z0-9\s\/-]+?)\s+(Morning|Night|Evening|Afternoon)?\s+(\d+)\s+Days/i
    )

    if (match) {
      const [, med, freq = "", dur = ""] = match
      setPrescription((prev) => ({
        ...prev,
        medication: med.trim(),
        frequency: freq.trim(),
        duration: dur.trim(),
        notes: cleanText,
      }))
    } else {
      console.warn("❌ OCR parsing failed – no match found.")
    }
  }

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    setOcrLoading(true)

    try {
      const res = await fetch("http://localhost:5001/extract", {
        method: "POST",
        body: formData,
      })

      const raw = await res.text()
      const data = JSON.parse(raw)

      if (data.success && Array.isArray(data.text)) {
        const joined = data.text.join("\n")
        console.log("📦 OCR Output:\n", joined)
        parseFromOCR(joined)
      } else {
        alert("OCR failed: " + data.error)
      }
    } catch (err) {
      console.error("OCR Error:", err)
      alert("❌ Network error while running OCR.")
    }

    setOcrLoading(false)
  }

  const handleReportSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5050/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reportMsg }),
      })

      const data = await res.json()
      if (data.success) {
        alert("✅ Report sent successfully!")
        setReportMsg("")
        setShowReport(false)
      } else {
        alert("❌ Failed to send report.")
      }
    } catch (e) {
      console.error("❌ Report Error:", e)
      alert("❌ Could not send report.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Prescription</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Prescription Image (Auto Fill)</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
              isDragActive ? "border-primary" : "border-muted-foreground"
            }`}
          >
            <input {...getInputProps()} />
            {file ? <p>{file.name}</p> : <p>Drag & drop or click to select an image</p>}
          </div>
          <Button onClick={handleUpload} disabled={!file || ocrLoading} className="mt-4">
            {ocrLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Reading Prescription...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Read Prescription
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Prescription Details</CardTitle>
          <Button variant="outline" onClick={() => setShowReport(true)}>
            📩 Report
          </Button>
        </CardHeader>
        <CardContent>
          {checkInteraction() && (
            <p className="text-red-600 font-semibold mb-4">
              ⚠️ Warning: Potential interaction between reactive drugs!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                name="patientId"
                type="number"
                value={prescription.patientId}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                value={prescription.patientName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="medication">Medication</Label>
              <Input
                id="medication"
                name="medication"
                value={prescription.medication}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={prescription.dosage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  name="frequency"
                  value={prescription.frequency}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={prescription.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={prescription.notes}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" disabled={submitLoading} className="flex gap-2 items-center">
              {submitLoading ? (
                <>
                  <span className="animate-spin">⏳</span> Saving...
                </>
              ) : submitSuccess ? (
                <>✅ Saved!</>
              ) : (
                <>Create Prescription</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Report Discrepancy</h2>
            <Textarea
              rows={5}
              placeholder="Describe the issue..."
              value={reportMsg}
              onChange={(e) => setReportMsg(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowReport(false)}>
                Cancel
              </Button>
              <Button onClick={handleReportSubmit}>Send Report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
