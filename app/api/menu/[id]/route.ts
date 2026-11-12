import { menus } from "@/data/menu";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/api/menu/[id]">,
) {
  const { id } = await params;
  const menu = menus.find((e) => e.id === Number(id));

  if (!menu) {
    return Response.json({ pesan: "Menu tidak ditemukan" }, { status: 404 });
  }

  return Response.json(menu);
}