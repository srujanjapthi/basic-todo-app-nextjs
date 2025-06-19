import { connectDB } from "@/lib/connectDB";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

export async function POST(request) {
  console.log("POST Request", request.url);

  try {
    await connectDB();

    const user = await request.json();
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json({ name, email }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    return Response.json({ error: "Something went wrong!!" }, { status: 500 });
  }
}
