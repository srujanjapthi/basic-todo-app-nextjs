import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";

export async function GET() {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    if (user instanceof Response) return user;
    return Response.json(user);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
