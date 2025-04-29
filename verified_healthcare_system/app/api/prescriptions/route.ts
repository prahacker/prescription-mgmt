import { NextResponse } from 'next/server';
import { queryDB } from '@/lib/db';

export async function POST(req: Request) {
  const { patient_id, date, medication, dosage_instructions } = await req.json();

  await queryDB(
    `INSERT INTO prescriptions (patient_id, date, medication, dosage_instructions) VALUES (?, ?, ?, ?)`,
    [patient_id, date, medication, dosage_instructions]
  );

  await queryDB(
    `INSERT INTO history_logs (patient_id, date, type, details, additional_info) VALUES (?, ?, 'Prescription', ?, ?)`,
    [patient_id, date, medication, dosage_instructions]
  );

  return NextResponse.json({ success: true });
}
