"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tautan = [
    { href: "/", teks: "Beranda" },
    { href: "/menu", teks: "Menu" },
    { href: "/favorit", teks: "Favorit" },
    { href: "/keranjang", teks: "Keranjang" },
    { href: "/riwayat", teks: "Riwayat" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [jumlahKeranjang, setJumlahKeranjang] = useState(0);

    function hitung() {
        const tersimpan = localStorage.getItem("keranjang");
        const keranjang: { id: number; jumlah: number }[] = tersimpan
            ? JSON.parse(tersimpan)
            : [];
        setJumlahKeranjang(keranjang.reduce((sum, k) => sum + k.jumlah, 0));
    }

    useEffect(() => {
        hitung();
        window.addEventListener("keranjang-berubah", hitung);
        return () => window.removeEventListener("keranjang-berubah", hitung);
    }, []);

    return (
        <nav className="flex items-center gap-6 border-b bg-white px-6 py-3">
            <span className="text-lg font-bold text-cyan-600">KantinKu</span>
            {tautan.map((m) => (
                <Link
                    key={m.href}
                    href={m.href}
                    className={
                        pathname === m.href
                            ? "font-semibold text-cyan-700"
                            : "text-slate-600 hover:text-cyan-600"
                    }
                >
                    {m.href === "/keranjang" && jumlahKeranjang > 0
                        ? `Keranjang (${jumlahKeranjang})`
                        : m.teks}
                </Link>
            ))}
        </nav>
    );
}
