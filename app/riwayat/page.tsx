"use client";

import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";

type ItemRiwayat = {
  waktu: string;
  nama: string;
  jumlahMenu?: number;
  items?: { id: number; jumlah: number }[];
  total: number;
};

export default function HalamanRiwayat() {
  const [riwayat, setRiwayat] = useState<ItemRiwayat[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    try {
      const data = localStorage.getItem("riwayat");
      if (data) {
        setRiwayat(JSON.parse(data));
      }
    } catch {
    } finally {
      setMemuat(false);
    }
  }, []);

  if (memuat) {
    return <p>Memuat...</p>;
  }

  function hapusRiwayat() {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pesanan?")) {
      localStorage.removeItem("riwayat");
      setRiwayat([]);
    }
  }

  const daftarTerbalik = [...riwayat].reverse();
  const totalBelanja = riwayat.reduce((sum, r) => sum + (r.total || 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

      {daftarTerbalik.length === 0 ? (
        <p className="text-slate-500">Belum ada pesanan.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">
              {daftarTerbalik.length} pesanan, total belanja {rupiah(totalBelanja)}
            </p>
            <button
              onClick={hapusRiwayat}
              className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              Hapus riwayat
            </button>
          </div>

          <div className="space-y-3">
            {daftarTerbalik.map((pesanan, idx) => {
              const jumlah =
                pesanan.jumlahMenu ??
                pesanan.items?.reduce((acc, curr) => acc + curr.jumlah, 0) ??
                0;

              return (
                <div
                  key={idx}
                  className="rounded-xl border bg-white p-4 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{pesanan.waktu}</span>
                    <span className="text-base font-bold text-slate-800">
                      {rupiah(pesanan.total)}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {pesanan.nama}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Jumlah menu: {jumlah}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

