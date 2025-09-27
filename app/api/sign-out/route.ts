import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("signing out");
  await signOut();
  return NextResponse.json({ success: true });
}