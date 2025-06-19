import { getUserSessionId } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Session from "@/models/sessionModel";
import { cookies } from "next/headers";

export async function POST() {
  await connectDB();

  const cookieStore = await cookies();
  const sessionId = await getUserSessionId();

  await Session.findByIdAndDelete(sessionId);
  cookieStore.delete("sid");

  return new Response(null, { status: 204 });
}
