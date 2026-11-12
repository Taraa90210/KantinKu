"use client";
import { useEffect, useState } from "react";
import { rupiah, type Menu } from "@/data/menu";
import KartuMenu from "@/components/KartuMenu";
import KontrolKatalog from "./KontrolKatalog";

export default function KatalogMenu({ menu }: { menu: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("default");
  useEffect(() => {
    const simpan = localStorage.getItem("urut");
    if (simpan) setUrut(simpan);
  }, []);

  const daftarKategori = ["Semua", ...new Set(menu.map((m) => m.kategori))];
  const hasil = menu.filter(
    (m) =>
      m.nama.toLowerCase().includes(cari.toLowerCase()) &&
      (kategori === "Semua" || m.kategori === kategori),
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.nama.localeCompare(b.nama);
    return a.id - b.id;
  });

  function handleSetCari(v: string) { setCari(v); }
  function handleSetKategori(v: string) { setKategori(v); }
  function handleSetUrut(v: string) {
    setUrut(v);
    localStorage.setItem("urut", v);
  }

  return (
    <div>
      <KontrolKatalog
        cari={cari} setCari={handleSetCari}
        kategori={kategori} setKategori={handleSetKategori}
        daftarKategori={daftarKategori}
        urut={urut} setUrut={handleSetUrut}
      />
      {tersusun.length === 0 ? (
        <p className="text-slate-500">Menu tidak ditemukan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tersusun.map((m) => (
            <KartuMenu key={m.id} menu={m} />
          ))}
        </div>
      )}
    </div>
  );
}
