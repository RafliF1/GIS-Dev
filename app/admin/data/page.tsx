"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Database, Settings2, CheckCircle, HelpCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "@/components/ui/searchbar";
import PlaceTable from "@/components/places/PlaceTable";
import PlaceForm from "@/components/places/PlaceForm";
import { generatePagination } from "@/lib/utils";
import { useAdminData } from "@/hooks/useAdminData";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Styles
const STYLES = {
  headerIcon:
    "bg-black text-lime-400 p-2.5 rounded-xl shadow-xl shadow-slate-900/10",
  pageTitle:
    "text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3",
  subTitle: "hidden md:block mt-1 text-sm text-slate-500 font-medium ml-1",
  actionButton:
    "flex items-center justify-center gap-2 bg-lime-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-lime-700 shadow-lg shadow-lime-800/30 transition-all active:scale-95",
  paginationWrapper:
    "mt-4 flex flex-col md:flex-row justify-between items-center gap-4 py-6 px-6 md:px-12",
  paginationCanvas:
    "bg-white text-slate-700 border border-slate-200 rounded-2xl px-2 py-2 w-fit shadow-sm",
};

export default function DataPage() {
  const searchParams = useSearchParams();

  // Hook untuk state management
  const {
    currentPlaces,
    filteredPlaces,
    totalPages,
    currentPage,
    itemsPerPage,
    editingPlace,
    sortConfig,
    notification,
    setItemsPerPage,
    setEditingPlace,
    handlePageChange,
    handleSearch,
    handleSort,
    handleSave,
    handleDelete,
    showNotification,
  } = useAdminData();

  // --- 2. DEFINISI FUNGSI START TOUR (Bisa dipanggil manual) ---
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      nextBtnText: 'Lanjut ➡',
      prevBtnText: '⬅ Kembali',
      doneBtnText: 'Selesai ✨',
      steps: [
        {
          element: '#tour-search',
          popover: {
            title: 'Pencarian Cepat',
            description: 'Ketik nama lokasi atau kategori di sini untuk menyaring data secara instan.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#tour-filter',
          popover: {
            title: 'Atur Tampilan',
            description: 'Tentukan berapa banyak baris data yang ingin Anda lihat dalam satu halaman.',
            side: "bottom",
            align: 'center'
          }
        },
        {
          element: '#tour-add-btn',
          popover: {
            title: 'Tambah Lokasi',
            description: 'Klik tombol ini untuk membuka formulir input data geospasial baru.',
            side: "left",
            align: 'center'
          }
        },
        {
          element: '#tour-action-buttons',
          popover: {
            title: 'Edit & Hapus Data',
            description: 'Gunakan tombol di kolom aksi ini untuk mengedit atau menghapus data lokasi yang spesifik.',
            side: "left",
            align: 'center'
          }
        }
      ]
    });

    driverObj.drive();
  };

  // --- 3. LOGIC AUTO START TOUR (Hanya sekali) ---
  useEffect(() => {
    if (filteredPlaces.length > 0) {
      const continueFromDashboard = sessionStorage.getItem('continueTourFromDashboard');
      const hasSeenDataTour = localStorage.getItem('hasSeenDataPageTour');

      if (continueFromDashboard || !hasSeenDataTour) {
        setTimeout(() => {
          startTour();
          localStorage.setItem('hasSeenDataPageTour', 'true');
          sessionStorage.removeItem('continueTourFromDashboard');
        }, 1000);
      }
    }
  }, [filteredPlaces.length]);

  // Success notification handler
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      showNotification(
        "Berhasil Disimpan",
        "Data lokasi baru telah ditambahkan.",
      );
    }
  }, [searchParams, showNotification]);

  // Edit form handler
  if (editingPlace) {
    return (
      <div className="w-full transition-all duration-500">
        <PlaceForm
          initialData={editingPlace}
          onSave={handleSave}
          onCancel={() => setEditingPlace(null)}
        />
      </div>
    );
  }

  return (
    <>
      {/* Notification toast */}
      {notification.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 min-w-[320px] flex flex-col gap-3">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm mb-0.5">
                  {notification.title}
                </h3>
                <p className="text-xs text-slate-500">{notification.message}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-full">
              <div className="h-full bg-emerald-500 w-full origin-left animate-[shrinkBar_5s_linear_forwards]"></div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full transition-all duration-500 ease-in-out">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 py-5 px-6 md:px-12 transition-all">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* --- HEADER KIRI --- */}
            <div>
              <div className="flex items-center gap-4">
                <h1 className={STYLES.pageTitle}>
                  <span className={STYLES.headerIcon}>
                    <Database size={22} />
                  </span>
                  Data <span className="text-lime-600">Lokasi</span>
                </h1>
                
                {/* 4. TOMBOL REPLAY TOUR DISINI */}
                <button 
                  onClick={startTour}
                  className="hidden md:flex items-center gap-2 text-[10px] font-bold text-lime-600 bg-lime-50 px-3 py-1.5 rounded-full hover:bg-lime-100 transition-colors border border-lime-200"
                  title="Putar Ulang Panduan"
                >
                  <HelpCircle size={14} />
                  Panduan
                </button>
              </div>

              <p className={STYLES.subTitle}>
                Kelola total {filteredPlaces.length} data geospasial Kota
                Blitar.
              </p>
            </div>

            {/* --- HEADER KANAN (Actions) --- */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div id="tour-search" className="flex-1 min-w-50 lg:w-72">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Cari nama atau kategori..."
                />
              </div>
              {/* Rows per page */}
              <div id="tour-filter" className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-lime-300 transition-colors">
                <Settings2 size={14} className="text-slate-400" />
                <select
                  className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer hover:text-black transition-colors"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    handlePageChange(1);
                  }}
                >
                  <option value={10}>10 Baris</option>
                  <option value={25}>25 Baris</option>
                  <option value={50}>50 Baris</option>
                  <option value={100}>100 Baris</option>
                </select>
              </div>
              <Link id="tour-add-btn" href="/admin/input" className={STYLES.actionButton}>
                <Plus size={20} strokeWidth={3} />{" "}
                <span className="hidden sm:inline">Tambah</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="w-full">
          <PlaceTable
            data={currentPlaces}
            onEdit={(place) => setEditingPlace(place)}
            onDelete={handleDelete}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>

        {/* Pagination */}
        <div className={STYLES.paginationWrapper}>
          <div className="text-center md:text-left pl-2">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
              Menampilkan{" "}
              {filteredPlaces.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}{" "}
              - {Math.min(currentPage * itemsPerPage, filteredPlaces.length)}{" "}
              dari {filteredPlaces.length} Lokasi
            </p>
          </div>

          {filteredPlaces.length > 0 && totalPages > 1 && (
            <div className={STYLES.paginationCanvas}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={`hover:bg-lime-50 hover:text-lime-700 transition-colors ${
                        currentPage === 1
                          ? "opacity-30 pointer-events-none"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                  {generatePagination(currentPage, totalPages).map(
                    (page, index) => {
                      if (page === "...")
                        return (
                          <PaginationItem key={`dots-${index}`}>
                            <PaginationEllipsis className="text-slate-300" />
                          </PaginationItem>
                        );
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page as number);
                            }}
                            className={`rounded-xl border-none font-bold transition-all ${
                              currentPage === page
                                ? "bg-lime-600 text-white shadow-lg shadow-lime-200/50 scale-105"
                                : "text-slate-500 hover:bg-lime-50 hover:text-lime-700"
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    },
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                      className={`hover:bg-lime-50 hover:text-lime-700 transition-colors ${
                        currentPage === totalPages
                          ? "opacity-30 pointer-events-none"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
}