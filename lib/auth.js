import Session from "@/models/sessionModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";

export async function getLoggedInUser() {
  const cookieStore = await cookies();
  const errorResponse = Response.json(
    { error: "Please Login" },
    { status: 401 }
  );

  const signedSessionId = cookieStore.get("sid")?.value;
  if (!signedSessionId) return errorResponse;

  const sessionId = verifySignedCookie(signedSessionId);
  if (!sessionId) return errorResponse;

  const session = await Session.findById(sessionId).lean();
  if (!session) return errorResponse;

  const user = await User.findById(session.userId).select("-password -__v");
  if (!user) return errorResponse;

  return user;
}

export async function getUserSessionId() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("sid").value;
  return verifySignedCookie(cookie);
}

export function signCookie(cookie) {
  const signature = createHmac("sha256", process.env.COOKIE_SECRET)
    .update(cookie)
    .digest("base64url");
  const signedCookie = `${cookie}.${signature}`;
  return signedCookie;
}

export function verifySignedCookie(signedCookie) {
  const [cookie, cookieSignature] = signedCookie.split(".");
  const verificationSignature = signCookie(cookie).split(".")[1];
  return verificationSignature === cookieSignature ? cookie : false;
}
