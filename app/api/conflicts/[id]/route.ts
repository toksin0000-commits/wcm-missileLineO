import conflicts from "@/data/conflicts.json";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const conflict = conflicts.find(c => c.id === id);
  return Response.json(conflict || {});
}

