import { signCookie } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Session from "@/models/sessionModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    const invalidCredentialsResponse = Response.json(
      { error: "Invalid Credentials" },
      { status: 400 }
    );

    const user = await User.findByEmail(email);
    if (!user) return invalidCredentialsResponse;

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return invalidCredentialsResponse;

    const cookieStore = await cookies();
    const allSessions = await Session.find({ userId: user._id });

    if (allSessions.length >= 2) await allSessions[0].deleteOne();
    const session = await Session.create({ userId: user._id });

    cookieStore.set("sid", signCookie(session.id), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json(
      { name: user.name, email: user.email },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong!!" }, { status: 500 });
  }
}
