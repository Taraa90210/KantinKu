"use client";

import { useEffect, useState } from "react";
import { menus as daftarMenu, rupiah } from "@/data/menu";

type ItemKeranjang = { id: number; jumlah: number };

function bacaKeranjang(): ItemKeranjang[] {
  if (typeof window === "undefined") return [];
  const tersimpan = localStorage.getItem("keranjang");
  return tersimpan ? JSON.parse(tersimpan) : [];
}

function simpanKeranjang(keranjang: ItemKeranjang[]) {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  window.dispatchEvent(new Event("keranjang-berubah"));
}

export default function HalamanKeranjang() {
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>([]);
  const [kodePromo, setKodePromo] = useState("");
  const [pesanPromo, setPesanPromo] = useState("");
  const [diskonAktif, setDiskonAktif] = useState(false);
  const [caraAmbil, setCaraAmbil] = useState<"sendiri" | "antar">("sendiri");
  const [kelas, setKelas] = useState("");
  const [nama, setNama] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [struk, setStruk] = useState<string | null>(null);

  useEffect(() => {
    setKeranjang(bacaKeranjang());
  }, []);

  function ubahJumlah(id: number, delta: number) {
    const menu = daftarMenu.find((m) => m.id === id);
    if (!menu) return;
    setKeranjang((prev) => {
      const baru = prev.map((k) => {
        if (k.id !== id) return k;
        const j = Math.min(Math.max(k.jumlah + delta, 1), menu.stok);
        return { ...k, jumlah: j };
      });
      simpanKeranjang(baru);
      return baru;
    });
  }

  function hapus(id: number) {
    setKeranjang((prev) => {
      const baru = prev.filter((k) => k.id !== id);
      simpanKeranjang(baru);
      return baru;
    });
  }

  const subtotal = keranjang.reduce((sum, k) => {
    const menu = daftarMenu.find((m) => m.id === k.id);
    return sum + (menu ? menu.harga * k.jumlah : 0);
  }, 0);

  const diskonBerlaku = diskonAktif && subtotal >= 20000;
  const nilaiDiskon = diskonBerlaku ? Math.round(subtotal * 0.1) : 0;
  const ongkir = caraAmbil === "antar" ? 2000 : 0;
  const total = subtotal - nilaiDiskon + ongkir;

  function pakaiPromo() {
    if (kodePromo.trim().toUpperCase() !== "HEMAT10") {
      setPesanPromo("Kode promo tidak dikenal.");
      setDiskonAktif(false);
      return;
    }
    if (subtotal < 20000) {
      setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      setDiskonAktif(false);
      return;
    }
    setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
    setDiskonAktif(true);
  }

  function pesanSekarang() {
    setStruk(null);
    setPesanError("");
    if (nama.trim().length < 3) return setPesanError("Nama minimal 3 huruf.");
    if (caraAmbil === "antar" && kelas.trim().length < 3)
      return setPesanError("Kelas minimal 3 karakter.");

    const baris = keranjang.map((k) => {
      const menu = daftarMenu.find((m) => m.id === k.id);
      return `${menu?.nama} x${k.jumlah} = ${rupiah((menu?.harga ?? 0) * k.jumlah)}`;
    });

    let isiStruk = `Terima kasih, ${nama.trim()}!\n`;
    isiStruk += baris.join("\n") + "\n";
    isiStruk += `Subtotal: ${rupiah(subtotal)}\n`;
    if (diskonBerlaku) isiStruk += `Diskon 10%: -${rupiah(nilaiDiskon)}\n`;
    if (caraAmbil === "antar") isiStruk += `Ongkir antar ke ${kelas.trim()}: ${rupiah(2000)}\n`;
    else isiStruk += `Diambil sendiri di kantin\n`;
    isiStruk += `Total bayar: ${rupiah(total)}`;
    setStruk(isiStruk);

    const riwayatLama = localStorage.getItem("riwayat");
    const riwayat: object[] = riwayatLama ? JSON.parse(riwayatLama) : [];
    const jumlahMenu = keranjang.reduce((sum, k) => sum + k.jumlah, 0);
    riwayat.push({
      waktu: new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      nama: nama.trim(),
      jumlahMenu,
      items: keranjang,
      subtotal,
      diskon: nilaiDiskon,
      ongkir,
      total,
    });
    localStorage.setItem("riwayat", JSON.stringify(riwayat));

    localStorage.setItem("keranjang", "[]");
    window.dispatchEvent(new Event("keranjang-berubah"));
    setKeranjang([]);
    setNama("");
    setKelas("");
    setKodePromo("");
    setPesanPromo("");
    setDiskonAktif(false);
    setCaraAmbil("sendiri");
  }

  if (keranjang.length === 0 && !struk) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Keranjang</h1>
        <p className="text-slate-500">Keranjang masih kosong.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Keranjang</h1>

      {struk ? (
        <pre className="rounded-xl border bg-white p-6 text-sm whitespace-pre-wrap">
          {struk}
        </pre>
      ) : (
        <>
          <div className="rounded-xl border bg-white p-4 space-y-3">
            {keranjang.map((k) => {
              const menu = daftarMenu.find((m) => m.id === k.id);
              if (!menu) return null;
              return (
                <div key={k.id} className="flex items-center justify-between gap-4">
                  <span className="flex-1 font-medium">{menu.nama}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => ubahJumlah(k.id, -1)}
                      className="rounded border px-2 py-0.5 hover:bg-slate-100"
                    >−</button>
                    <span className="w-6 text-center">{k.jumlah}</span>
                    <button
                      onClick={() => ubahJumlah(k.id, 1)}
                      className="rounded border px-2 py-0.5 hover:bg-slate-100"
                    >+</button>
                  </div>
                  <span className="w-28 text-right text-sm text-slate-600">
                    {rupiah(menu.harga * k.jumlah)}
                  </span>
                  <button
                    onClick={() => hapus(k.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={kodePromo}
              onChange={(e) => setKodePromo(e.target.value)}
              placeholder="Kode promo"
              className="rounded border px-3 py-2 text-sm"
            />
            <button
              onClick={pakaiPromo}
              className="rounded bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-800"
            >
              Pakai
            </button>
          </div>
          {pesanPromo && (
            <p className={`text-sm ${diskonBerlaku ? "text-green-700" : "text-red-600"}`}>
              {diskonAktif && !diskonBerlaku
                ? "Promo HEMAT10 butuh belanja minimal Rp 20.000."
                : pesanPromo}
            </p>
          )}

          <div className="space-y-2">
            <p className="font-medium">Cara ambil:</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="caraAmbil"
                value="sendiri"
                checked={caraAmbil === "sendiri"}
                onChange={() => setCaraAmbil("sendiri")}
              />
              Ambil sendiri
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="caraAmbil"
                value="antar"
                checked={caraAmbil === "antar"}
                onChange={() => setCaraAmbil("antar")}
              />
              Diantar (+Rp 2.000)
            </label>
            {caraAmbil === "antar" && (
              <input
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder="Kelas (contoh: XII RPL 1)"
                className="block rounded border px-3 py-2 text-sm"
              />
            )}
          </div>

          <div className="rounded-xl border bg-white p-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            {diskonBerlaku && (
              <div className="flex justify-between text-green-700">
                <span>Diskon</span>
                <span>-{rupiah(nilaiDiskon)}</span>
              </div>
            )}
            {caraAmbil === "antar" && (
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>{rupiah(2000)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-1">
              <span>Total</span>
              <span>{rupiah(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama pemesan"
              className="block w-full rounded border px-3 py-2 text-sm"
            />
            {pesanError && <p className="text-sm text-red-600">{pesanError}</p>}
            <button
              onClick={pesanSekarang}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Pesan sekarang
            </button>
          </div>
        </>
      )}
    </div>
  );
}

