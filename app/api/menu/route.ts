import { menus } from "@/data/menu";

export async function GET() {
    return Response.json(menus);
}