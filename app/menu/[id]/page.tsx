import Link from "next/link";
import { notFound } from "next/navigation";
import { menus, rupiah } from "@/data/menu";
import FormPesan from "@/components/FormPesan";
import TombolFavorit from "@/components/TombolFavorit";

export default async function Detail({ params }: PageProps<"/menu/[id]">) {
  const { id } = await params;
  const item = menus.find((m) => m.id === Number(id));
  if (!item) notFound();

  const terkait = menus.filter(
    (m) => m.kategori === item.kategori && m.id !== item.id,
  );

  return (
    <article className="rounded-xl border bg-white p-6">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {item.kategori}
      </span>
      <h1 className="mt-2 text-3xl font-bold">{item.nama}</h1>
      <p className="mt-4 text-xl font-semibold">{rupiah(item.harga)}</p>
      <p className={item.stok === 0 ? "text-sm text-red-600" : "text-sm text-green-700"}>
        {item.stok === 0 ? "Stok habis" : `Sisa ${item.stok} porsi`}
      </p>
      
      <TombolFavorit id={Number(id)}/>
      <FormPesan menu={item} />

      <section className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold">Menu terkait</h2>
        {terkait.length === 0 ? (
          <p className="mt-2 text-slate-500">Belum ada menu terkait.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {terkait.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/menu/${m.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {m.nama}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
