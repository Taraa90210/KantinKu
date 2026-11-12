"use client";

import { useState } from "react";
import { rupiah, type Menu } from "@/data/menu";

export default function FormPesan({ menu }: { menu: Menu }) {
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");
  const [berhasil, setBerhasil] = useState(false);

  if (menu.stok === 0) {
    return <p className="mt-6 font-medium text-red-600">Menu ini habis.</p>;
  }

  function tambahKeKeranjang() {
    setBerhasil(false);
    if (jumlah < 1) return setPesan("Jumlah minimal 1.");
    if (jumlah > menu.stok) return setPesan(`Stok hanya ${menu.stok}.`);

    const tersimpan = localStorage.getItem("keranjang");
    const keranjang: { id: number; jumlah: number }[] = tersimpan
      ? JSON.parse(tersimpan)
      : [];

    const ada = keranjang.find((k) => k.id === menu.id);
    const jumlahSudahAda = ada ? ada.jumlah : 0;

    if (jumlahSudahAda + jumlah > menu.stok) {
      return setPesan(
        `Jumlah melebihi stok. Sudah ada ${jumlahSudahAda} di keranjang, stok tersisa ${menu.stok - jumlahSudahAda}.`,
      );
    }

    if (ada) {
      ada.jumlah += jumlah;
    } else {
      keranjang.push({ id: menu.id, jumlah });
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    window.dispatchEvent(new Event("keranjang-berubah"));
    setPesan("");
    setBerhasil(true);
  }

  return (
    <div className="mt-6 space-y-3 border-t pt-4">
      <h2 className="text-lg font-semibold">Tambah ke keranjang</h2>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600">Jumlah:</label>
        <input
          type="number"
          value={jumlah}
          min={1}
          max={menu.stok}
          onChange={(e) => {
            setJumlah(Number(e.target.value));
            setBerhasil(false);
            setPesan("");
          }}
          className="block w-24 rounded border px-3 py-2"
        />
      </div>
      <p className="text-sm text-slate-600">
        Total: <b>{rupiah(menu.harga * jumlah)}</b>
      </p>
      {pesan && <p className="text-sm text-red-600">{pesan}</p>}
      {berhasil && (
        <p className="text-sm text-green-700">Ditambahkan ke keranjang.</p>
      )}
      <button
        onClick={tambahKeKeranjang}
        className="rounded bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-700"
      >
        Tambah ke keranjang
      </button>
    </div>
  );
}

