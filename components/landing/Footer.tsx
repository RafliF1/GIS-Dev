"use client";

import Link from "next/link";
import {
  Globe,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

interface FooterProps {
  onOpenMap: () => void;
  onScrollTo: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function Footer({ onOpenMap, onScrollTo }: FooterProps) {
  return (
    <footer className="bg-black text-zinc-400 pt-10 pb-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Kolom 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="bg-linear-to-br from-lime-500 to-emerald-600 p-1.5 rounded-lg text-white">
                <Globe size={18} strokeWidth={3} />
              </div>
              <span className="font-black text-lg tracking-tight">
                GIS <span className="text-lime-500">App</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              Platform pemetaan digital resmi untuk pariwisata dan ekonomi
              kreatif di Blitar Raya.
            </p>
          </div>

          {/* Kolom 2: Tautan */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
              Menu Utama
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={onOpenMap}
                  className="hover:text-lime-500 transition flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span>{" "}
                  Peta Digital
                </button>
              </li>
              <li>
                <Link
                  href="#categories"
                  onClick={(e) => onScrollTo(e, "categories")}
                  className="hover:text-lime-500 transition flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span>{" "}
                  Kategori Data
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-lime-500 transition flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></span>{" "}
                  Login Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
              Kantor Pusat
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-lime-600 shrink-0" />
                <span className="leading-relaxed">
                  Jl. Merdeka No. 105,
                  <br />
                  Kepanjen Kidul, Kota Blitar
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-lime-600 shrink-0" />
                <span>info@blitarkota.go.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-lime-600 shrink-0" />
                <span>(0342) 801xxx</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
              Sosial Media
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-lime-500 hover:text-white hover:border-lime-500 transition-all text-zinc-400"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-zinc-400"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all text-zinc-400"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-900/50 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-zinc-600">
            &copy; {new Date().getFullYear()} GIS BLITAR.
          </p>
          <p className="text-xs font-medium text-zinc-600 flex items-center gap-1">
            Developed by{" "}
            <span className="text-zinc-500">Adalah Pokoknya Mah</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
