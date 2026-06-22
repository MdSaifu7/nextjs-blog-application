import { getBlogAction } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getBlogAction();
  return NextResponse.json(res);
}
