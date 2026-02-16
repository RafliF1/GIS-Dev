import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Phone,
  Globe,
  CheckSquare,
} from "lucide-react";
import { Place, ScheduleItem } from "@/types";

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceDetailModal({
  place,
  onClose,
}: PlaceDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gabungkan logic pengambilan gambar (support format object relation atau array string biasa)
  const images: string[] = place.placeImages
    ? place.placeImages.map((img) => img.url)
    : place.images || [];

  const hasImages = images.length > 0;

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // Autoplay functionality
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length, nextImage]);

  return (
    <div className="absolute inset-0 z-1000 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative flex flex-col">
        <div className="relative w-full h-64 sm:h-80 shrink-0 bg-gray-900 group">
          {hasImages ? (
            <>
              {/* GAMBAR UTAMA */}
              <Image
                src={images[currentImageIndex]}
                alt={place.name}
                fill
                className="object-cover transition-all duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />

              {/* NAVIGASI */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "bg-white w-6"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Tidak ada gambar
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 pointer-events-none">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {place.category}
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">{place.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 border-l-4 border-blue-500 pl-3">
              Deskripsi
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {place.description || "Tidak ada deskripsi."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Alamat
              </h4>
              <p className="text-sm text-gray-600">{place.address}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                Koordinat
              </h4>
              <div className="flex flex-col gap-1 text-sm text-gray-600 font-mono bg-white px-3 py-2 rounded border">
                <span className="text-red-500">Lat: {place.lat}</span>
                <span className="text-blue-500">Lon: {place.lon}</span>
              </div>
            </div>
          </div>

          {/* --- DETAIL SECTION (NEW) --- */}
          {place.detail && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-2">
                Info Tambahan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {place.detail.accessInfo && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Clock
                      size={16}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">
                        {place.category === "Hotel"
                          ? "Check-in/Out"
                          : place.category === "Cafe"
                            ? "Jam Buka"
                            : place.category === "Wisata"
                              ? "Jam Operasional"
                              : "Waktu Akses"}
                      </span>
                      {(() => {
                        try {
                          // Coba parse jika string JSON
                          if (place.detail.accessInfo?.startsWith("[")) {
                            const schedule = JSON.parse(
                              place.detail.accessInfo,
                            );
                            return (
                              <div className="mt-1 space-y-1">
                                {schedule.map(
                                  (item: ScheduleItem, idx: number) => {
                                    const isHoliday =
                                      item.isClosed ||
                                      [
                                        "Libur Nasional",
                                        "Tanggal Merah",
                                      ].includes(
                                        item.startDay || item.day || "",
                                      );
                                    return (
                                      <div
                                        key={idx}
                                        className="flex justify-between gap-4 text-xs"
                                      >
                                        <span className="font-medium text-slate-700 w-24">
                                          {item.startDay || item.day}
                                          {item.endDay &&
                                          item.endDay !== item.startDay
                                            ? ` - ${item.endDay}`
                                            : ""}
                                        </span>
                                        <span
                                          className={
                                            isHoliday
                                              ? "text-red-500 font-bold"
                                              : "text-slate-600"
                                          }
                                        >
                                          {isHoliday
                                            ? "TUTUP"
                                            : `${item.open} - ${item.close}`}
                                        </span>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            );
                          }
                          // Fallback untuk data lama (string biasa)
                          return (
                            <div className="mt-1 font-medium">
                              {place.detail.accessInfo}
                            </div>
                          );
                        } catch {
                          return (
                            <div className="mt-1 font-medium">
                              {place.detail.accessInfo}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}

                {place.detail.priceInfo && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Tag size={16} className="mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">
                        {place.category === "Hotel"
                          ? "Range Harga"
                          : place.category === "Cafe"
                            ? "Range Harga"
                            : place.category === "Wisata"
                              ? "Tiket Masuk"
                              : "Harga"}
                      </span>
                      {(() => {
                        const priceInfo = place.detail.priceInfo;
                        if (!priceInfo) return "-";

                        const formatCurrency = (val: string) => {
                          const num = parseInt(val.replace(/\D/g, "")); // Clean non-digits just in case
                          if (isNaN(num)) return val;
                          return `Rp. ${num.toLocaleString("id-ID")}`;
                        };

                        if (priceInfo.includes(" - ")) {
                          const [min, max] = priceInfo.split(" - ");
                          return `${formatCurrency(min)} - ${formatCurrency(max)}`;
                        }

                        return formatCurrency(priceInfo);
                      })()}
                    </div>
                  </div>
                )}

                {place.detail.contactInfo && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Phone
                      size={16}
                      className="mt-0.5 text-orange-500 shrink-0"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">
                        Kontak
                      </span>
                      {place.detail.contactInfo}
                    </div>
                  </div>
                )}

                {place.detail.webUrl && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Globe
                      size={16}
                      className="mt-0.5 text-blue-400 shrink-0"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase">
                        Website / Sosial Media
                      </span>
                      <a
                        href={place.detail.webUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline truncate block max-w-50"
                      >
                        Kunjungi URL
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {place.detail.facilities && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckSquare
                      size={16}
                      className="mt-0.5 text-purple-500 shrink-0"
                    />
                    <div className="w-full">
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">
                        Fasilitas
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {place.detail.facilities.split(",").map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600"
                          >
                            {f.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
