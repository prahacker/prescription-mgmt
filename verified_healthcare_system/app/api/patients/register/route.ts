import { NextResponse } from "next/server"
import { queryDB } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.json()
  const { id, name, dob, gender, contact_info } = body

  try {
    await queryDB(
      `INSERT INTO patients (id, name, dob, gender, contact_info) VALUES (?, ?, ?, ?, ?)`,
      [id, name, dob || null, gender || null, contact_info || null]
    )
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
