import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Jual berbagai makanan dan minuman"
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="antialiased">
      <body className="min-h-screen flex flex-col bg-cyan-50 text-slate-800">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
        <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">
          KantinKu
        </footer>
      </body>
    </html>
  )
}