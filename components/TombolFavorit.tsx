"use client";
import { useEffect, useState } from "react";

export default function TombolFavorit({
  id,
  className,
}: {
  id: number;
  className?: string;
}) {
  const [favorit, setFavorit] = useState(false);

  useEffect(() => {
    const simpan: number[] = JSON.parse(
      localStorage.getItem("favorit") ?? "[]",
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorit(simpan.includes(id));
  }, [id]);

  function ubah() {
    const simpan: number[] = JSON.parse(
      localStorage.getItem("favorit") ?? "[]",
    );
    const baru = simpan.includes(id)
      ? simpan.filter((x) => x !== id)
      : [...simpan, id];
    localStorage.setItem("favorit", JSON.stringify(baru));
    setFavorit(!favorit);
  }

  return (
    <button
      onClick={ubah}
      className={className ?? "mt-3 rounded border px-3 py-1.5 text-sm hover:bg-slate-50"}
    >
      {favorit ? "♥ Favorit" : "♡ Tambah Favorit"}
    </button>
  );
}
