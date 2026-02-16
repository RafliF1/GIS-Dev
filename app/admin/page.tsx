"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Hotel,
  Coffee,
  Plane,
  Plus,
  Map,
  ArrowUpRight,
} from "lucide-react";
import ChartData from "@/components/dashboard/ChartData";
import { Place } from "@/types";

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // --- PERBAIKAN: Definisi fungsi fetchPlaces ---
  const fetchPlaces = async () => {
    try {
      // Pastikan endpoint API ini sesuai dengan backend Anda (misal: /api/places)
      const response = await fetch("/api/places");
      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(); // Panggil saat mount

    // Auto refresh setiap 5 detik
    const refreshInterval = setInterval(fetchPlaces, 5000);
    // Auto update waktu setiap detik
    const clockInterval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(clockInterval);
    };
  }, []);

  // --- HITUNG STATISTIK ---
  const totalData = places.length;
  const hotelCount = places.filter((p) => p.category === "hotel").length;
  const cafeCount = places.filter((p) => p.category === "cafe").length;
  const wisataCount = places.filter((p) => p.category === "wisata").length;

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 border-t-lime-500"></div>
          <p className="text-slate-400 font-bold text-xs tracking-widest uppercase animate-pulse">
            Memuat Statistik...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Dashboard <span className="text-lime-600">Overview</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Pantau perkembangan data geospasial kawasan Blitar secara real-time.
          </p>
        </div>

        {/* Tanggal Hari Ini */}
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Update Terakhir
          </p>
          <p className="text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* CARD 1: TOTAL DATA */}
        <div className="relative bg-linear-to-br from-slate-900 to-slate-800 rounded-[24px] p-6 shadow-xl shadow-slate-900/20 text-white overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-lime-500/20 rounded-xl backdrop-blur-sm border border-lime-500/30 text-lime-400">
                <BarChart3 size={24} />
              </div>
              <p className="text-lime-400 text-xs font-bold uppercase tracking-widest">
                Total Data
              </p>
            </div>
            <p className="text-5xl font-black tracking-tight text-white mb-1">
              {totalData}
            </p>
            <p className="text-slate-400 text-sm font-medium">
              Lokasi Terdaftar
            </p>
          </div>
        </div>

        {/* CARD 2: HOTEL */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-[#65a30d]/20 hover:border-[#65a30d]/30 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#65a30d]/10 rounded-2xl text-[#65a30d] group-hover:bg-[#65a30d] group-hover:text-white transition-colors">
              <Hotel size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg group-hover:bg-[#65a30d]/10 group-hover:text-[#65a30d] transition-colors">
              {totalData > 0 ? ((hotelCount / totalData) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 mb-1">
              {hotelCount}
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
              Hotel & Penginapan
            </p>
          </div>
        </div>

        {/* CARD 3: CAFE */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-[#16a34a]/20 hover:border-[#16a34a]/30 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#16a34a]/10 rounded-2xl text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
              <Coffee size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg group-hover:bg-[#16a34a]/10 group-hover:text-[#16a34a] transition-colors">
              {totalData > 0 ? ((cafeCount / totalData) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 mb-1">
              {cafeCount}
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
              Cafe & Resto
            </p>
          </div>
        </div>

        {/* CARD 4: WISATA */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-[#0d9488]/20 hover:border-[#0d9488]/30 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#0d9488]/10 rounded-2xl text-[#0d9488] group-hover:bg-[#0d9488] group-hover:text-white transition-colors">
              <Plane size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg group-hover:bg-[#0d9488]/10 group-hover:text-[#0d9488] transition-colors">
              {totalData > 0 ? ((wisataCount / totalData) * 100).toFixed(0) : 0}
              %
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 mb-1">
              {wisataCount}
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
              Destinasi Wisata
            </p>
          </div>
        </div>
      </div>

      {/* Main Content  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Statistik Kategori
              </h3>
              <div className="flex gap-2">
                <span
                  className="h-3 w-3 rounded-full block"
                  style={{ backgroundColor: "#65a30d" }}
                  title="Hotel"
                ></span>
                <span
                  className="h-3 w-3 rounded-full block"
                  style={{ backgroundColor: "#16a34a" }}
                  title="Cafe"
                ></span>
                <span
                  className="h-3 w-3 rounded-full block"
                  style={{ backgroundColor: "#0d9488" }}
                  title="Wisata"
                ></span>
              </div>
            </div>
            {/* Komponen Chart */}
            <ChartData
              data={{
                hotel: hotelCount,
                cafe: cafeCount,
                wisata: wisataCount,
              }}
            />
          </div>
        </div>

        {/* Kolom Kanan: Quick Actions & Info */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <Link
                href="/admin/input"
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-lime-50 hover:border-lime-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:text-lime-600 shadow-sm">
                    <Plus size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-slate-800">
                    Tambah Data Baru
                  </span>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-lime-500"
                />
              </Link>

              <Link
                href="/"
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl text-slate-400 group-hover:text-blue-600 shadow-sm">
                    <Map size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-slate-800">
                    Lihat Peta Utama
                  </span>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-blue-500"
                />
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-lime-900 rounded-[32px] p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-center">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/30 blur-[50px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full"></div>

            <div className="relative z-10 text-center">
              <h4 className="text-lime-300 font-bold text-sm uppercase tracking-widest mb-1">
                Saat Ini (WIB)
              </h4>
              {/* Jam Digital */}
              <p className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-white">
                {time.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>

              {/* Tanggal */}
              <p className="text-lime-100 font-medium text-sm">
                {time.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}