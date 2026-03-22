import conflicts from "@/data/conflicts.json";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const conflict = conflicts.find(c => c.id === id);
  return Response.json(conflict || {});
}
