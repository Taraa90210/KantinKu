"use client";

type Props = {
  cari: string;
  setCari: (v: string) => void;
  kategori: string;
  setKategori: (v: string) => void;
  daftarKategori: string[];
  urut: string;
  setUrut: (v: string) => void;
};

export default function KontrolKatalog({
  cari, setCari,
  kategori, setKategori, daftarKategori,
  urut, setUrut,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        placeholder="Cari Menu..."
        className="rounded border bg-white px-3 py-2"
      />
      <select
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        {daftarKategori.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <select
        value={urut}
        onChange={(e) => setUrut(e.target.value)}
        className="rounded border bg-white px-3 py-2"
      >
        <option value="default">Urutan awal</option>
        <option value="murah">Harga termurah</option>
        <option value="mahal">Harga termahal</option>
        <option value="nama">Nama A-Z</option>
      </select>
    </div>
  );
}

