import Link from "next/link";
import { rupiah, type Menu } from "@/data/menu";
import TombolFavorit from "@/components/TombolFavorit";

export default function KartuMenu({ menu }: { menu: Menu }) {
  const habis = menu.stok <= 0;

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-all ${
        habis ? "border-gray-200 bg-gray-100 opacity-60" : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`rounded px-2 py-0.5 text-xs ${
          habis ? "bg-gray-200 text-gray-500" : "bg-blue-100 text-blue-700"
        }`}
      >
        {menu.kategori}
      </span>
      <h3
        className={`mt-2 text-lg font-semibold ${
          habis ? "text-gray-500" : "text-slate-800"
        }`}
      >
        {menu.nama}
      </h3>
      <p
        className={`mt-1 font-medium ${
          habis ? "text-gray-400" : "text-slate-700"
        }`}
      >
        {rupiah(menu.harga)}
      </p>
      <p
        className={`text-sm ${
          habis ? "text-red-500 font-medium" : "text-green-700"
        }`}
      >
        {habis ? `${menu.nama} habis` : `Sisa ${menu.stok} buah`}
      </p>

      <div className="mt-3 flex items-center gap-2">
        {habis ? (
          <button
            type="button"
            disabled
            className="rounded bg-gray-300 px-3 py-1.5 text-sm text-gray-500 cursor-not-allowed pointer-events-none select-none"
          >
            Beli
          </button>
        ) : (
          <Link
            href={`/menu/${menu.id}`}
            className="rounded bg-cyan-600 px-3 py-1.5 text-sm text-white hover:bg-cyan-700"
          >
            Beli
          </Link>
        )}
        <TombolFavorit
          id={menu.id}
          className="rounded border bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
        />
      </div>
    </div>
  );
}
