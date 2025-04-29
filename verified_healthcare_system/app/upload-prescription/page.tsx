"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UploadPrescription() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a PDF file.")
      return
    }

    const formData = new FormData()
    formData.append("pdf", file)

    setMessage("⏳ Uploading...")

    try {
      const response = await fetch("http://localhost:5002/upload-pdf", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("✅ " + "speaking....")
      } else {
        setMessage("❌ Error: " + (data.error || "Unknown error"))
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Upload failed.")
    }
  }

  const handleStop = async () => {
    setMessage("⏳ Stopping...")

    try {
      const response = await fetch("http://localhost:5002/stop-speaking", {
        method: "POST",
      })

      const data = await response.json()
      if (response.ok) {
        setMessage("🛑 " + data.message)
      } else {
        setMessage("❌ Error stopping speaking")
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Failed to stop speaking.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">Upload Prescription (PDF)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdfUpload">Choose PDF File</Label>
            <Input
              id="pdfUpload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpload} className="w-full">Upload and Speak</Button>
            <Button onClick={handleStop} variant="destructive" className="w-full">Stop Speaking</Button>
          </div>

          {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
