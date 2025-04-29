const express = require("express")
const multer = require("multer")
const { spawn } = require("child_process")
const path = require("path")
const cors = require("cors")
const fs = require("fs")

const app = express()
const upload = multer({ dest: "uploads/" })

app.use(cors())

let currentPythonProcess = null  // <-- save the running Python process here

app.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const uploadedPath = path.resolve(req.file.path)
  const pythonScriptPath = path.resolve("speak.py")

  // Kill existing Python process if running
  if (currentPythonProcess) {
    currentPythonProcess.kill()
  }

  currentPythonProcess = spawn("python3", [pythonScriptPath, uploadedPath])

  currentPythonProcess.stdout.on("data", (data) => {
    console.log(`[Python stdout]: ${data}`)
  })

  currentPythonProcess.stderr.on("data", (data) => {
    console.error(`[Python stderr]: ${data}`)
  })

  currentPythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`)
    fs.unlink(uploadedPath, (err) => {
      if (err) console.error("Error deleting uploaded file:", err)
    })
    currentPythonProcess = null
  })

  return res.json({ message: "Python script triggered. Speaking..." })
})

// New endpoint to STOP speaking
app.post("/stop-speaking", (req, res) => {
  if (currentPythonProcess) {
    currentPythonProcess.kill()
    currentPythonProcess = null
    return res.json({ message: "Speaking stopped." })
  } else {
    return res.json({ message: "No speaking process running." })
  }
})

const PORT = 5002
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`)
})
