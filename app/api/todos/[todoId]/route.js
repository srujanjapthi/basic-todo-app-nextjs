import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";

export async function GET(_, { params }) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    if (user instanceof Response) return user;

    const { todoId } = await params;
    const todo = await Todo.findOne(
      { _id: todoId, userId: user.id },
      { __v: 0 }
    );

    if (todo) return Response.json(todo);
    return Response.json({ error: "Todo not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return Response.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    if (user instanceof Response) return user;

    const editedTodo = await request.json();
    const { todoId } = await params;

    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, userId: user._id },
      editedTodo,
      { new: true }
    );

    if (!todo) {
      return Response.json({ error: "Todo not found!!" }, { status: 404 });
    }

    return Response.json(
      { message: "Todo updated successfully", todo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return Response.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    if (user instanceof Response) return user;

    const { todoId } = await params;
    const deletedTodo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: user.id,
    });

    if (!deletedTodo) {
      return Response.json({ error: "Todo not found!!" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return Response.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
