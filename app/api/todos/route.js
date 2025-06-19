import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";

export async function GET() {
  await connectDB();

  const user = await getLoggedInUser();
  if (user instanceof Response) return user;

  const todos = await Todo.find({ userId: user.id }, { __v: 0 });

  return Response.json(
    todos.map(({ id, text, completed }) => ({ id, text, completed })).reverse()
  );
}

export async function POST(request) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    if (user instanceof Response) return user;

    const todo = await request.json();
    await Todo.create({ text: todo.text, userId: user.id });

    return Response.json(
      { message: "Todo created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return Response.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
