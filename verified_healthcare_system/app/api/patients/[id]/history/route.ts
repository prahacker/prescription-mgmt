import { NextRequest, NextResponse } from "next/server";
import { queryDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const urlParts = req.nextUrl.pathname.split("/");
  const patientId = urlParts[urlParts.indexOf("patients") + 1]; // dynamic segment after 'patients'

  const history = await queryDB(
    `SELECT * FROM history_logs WHERE patient_id = ? ORDER BY date DESC`,
    [patientId]
  );

  return NextResponse.json(history);
}
