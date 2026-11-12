import Link from "next/link"

export default function Beranda() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold">Berbagai makanan dan minuman ada di sini</h1>
        <p className="mt-3 text-slate-600">
          Nasi Goreng, Mie Ayam, Es Teh, dll.
        </p>
      <Link
      href="/menu"
      className="text-white mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-2.5 font-medium hover:bg-cyan-600"
      >
        Lihat menu yang tersedia
      </Link>
      </section>
    </div>
  )
}
