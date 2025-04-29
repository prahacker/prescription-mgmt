import { NextRequest, NextResponse } from "next/server";
import { queryDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") || "";

  console.log("🚨 Incoming search query:", query);

  try {
    const sql = `SELECT id, name, dob, created_at as lastVisit FROM patients WHERE LOWER(name) LIKE ?`;
    const values = [`%${query.toLowerCase()}%`];

    console.log("🛠 Executing SQL:", sql);
    console.log("🔍 With values:", values);

    const results = await queryDB(sql, values);

    console.log("✅ Query results:", results);
    return NextResponse.json(results);
  } catch (err: any) {
    console.error("❌ API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
