import { PlaceDetail, ScheduleItem } from "@/types";
import { Info, Tag, Clock, Phone, Globe, CheckSquare } from "lucide-react";

interface AdditionalInfoSectionProps {
  category: string;
  detail: PlaceDetail;
  onChange: (field: keyof PlaceDetail, value: string) => void;
}

export default function AdditionalInfoSection({
  category,
  detail,
  onChange,
}: AdditionalInfoSectionProps) {
  // ... (keep existing getLabels)
  const getLabels = () => {
    switch (category.toLowerCase()) {
      case "hotel":
        return {
          accessInfo: "Waktu Check-in/Check-out",
          priceInfo: "Range Harga per Malam",
          facilities: "Fasilitas Kamar/Hotel",
          contactInfo: "Telepon Reservasi",
        };
      case "cafe":
        return {
          accessInfo: "Jam Buka - Tutup",
          priceInfo: "Range Harga Menu",
          facilities: "Fasilitas (WiFi/AC/Outdoor)",
          contactInfo: "Kontak / Whatsapp",
        };
      case "wisata":
        return {
          accessInfo: "Jam Operasional",
          priceInfo: "Harga Tiket Masuk",
          facilities: "Fasilitas Umum",
          contactInfo: "Kontak Informasi",
        };
      default:
        return {
          accessInfo: "Info Akses / Jam Buka",
          priceInfo: "Info Harga",
          facilities: "Fasilitas Tersedia",
          contactInfo: "Kontak",
        };
    }
  };

  const labels = getLabels();

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
      <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold border-b pb-2">
        <Info size={18} />
        <h3>Detail Tambahan ({category || "Umum"})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Access Info (Jam Buka / Check-in) */}
        <div className="space-y-2 col-span-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Clock size={12} /> {labels.accessInfo}
          </label>

          <div className="space-y-3 bg-white p-4 rounded-xl border border-dashed border-slate-300">
            {(detail.accessInfo?.startsWith("[")
              ? JSON.parse(detail.accessInfo)
              : [
                  {
                    startDay: "Senin",
                    endDay: "Jumat",
                    open: "08:00",
                    close: "17:00",
                  },
                ]
            ).map((item: ScheduleItem, index: number) => {
              const isRowClosed =
                item.isClosed ||
                ["Libur Nasional", "Tanggal Merah"].includes(
                  item.startDay || "",
                );

              return (
                <div
                  key={index}
                  className="relative bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                    {/* LABEL: HARI */}
                    <div className="col-span-12 lg:col-span-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-1 block lg:hidden">
                        Hari Operasional
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={item.startDay || item.day || ""}
                          onChange={(e) => {
                            const current: ScheduleItem[] =
                              detail.accessInfo?.startsWith("[")
                                ? JSON.parse(detail.accessInfo)
                                : [
                                    {
                                      startDay: "Senin",
                                      endDay: "Jumat",
                                      open: "",
                                      close: "",
                                    },
                                  ];
                            current[index].startDay = e.target.value;
                            delete current[index].day;
                            onChange("accessInfo", JSON.stringify(current));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <option value="" disabled>
                            Hari Mulai
                          </option>
                          {[
                            "Senin",
                            "Selasa",
                            "Rabu",
                            "Kamis",
                            "Jumat",
                            "Sabtu",
                            "Minggu",
                            "Setiap Hari",
                          ].map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>

                        <span className="text-slate-400 font-bold">-</span>

                        <select
                          value={item.endDay || ""}
                          disabled={isRowClosed}
                          onChange={(e) => {
                            const current: ScheduleItem[] =
                              detail.accessInfo?.startsWith("[")
                                ? JSON.parse(detail.accessInfo)
                                : [
                                    {
                                      startDay: "Senin",
                                      endDay: "Jumat",
                                      open: "",
                                      close: "",
                                    },
                                  ];
                            current[index].endDay = e.target.value;
                            onChange("accessInfo", JSON.stringify(current));
                          }}
                          className={`w-full p-2 border border-slate-300 rounded-lg text-sm outline-none transition-colors ${
                            isRowClosed
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-white cursor-pointer hover:bg-slate-50 focus:ring-2 focus:ring-blue-500"
                          }`}
                        >
                          <option value="">Sampai Hari (Opsional)</option>
                          {[
                            "Senin",
                            "Selasa",
                            "Rabu",
                            "Kamis",
                            "Jumat",
                            "Sabtu",
                            "Minggu",
                          ].map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* LABEL: JAM & STATUS */}
                    <div className="col-span-12 lg:col-span-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mb-1 block lg:hidden">
                        Jam Operasional
                      </span>
                      <div className="grid grid-cols-12 gap-2">
                        {/* Status Toggle */}
                        <div className="col-span-4">
                          <select
                            value={isRowClosed ? "tutup" : "buka"}
                            onChange={(e) => {
                              const current: ScheduleItem[] =
                                detail.accessInfo?.startsWith("[")
                                  ? JSON.parse(detail.accessInfo)
                                  : [
                                      {
                                        startDay: "Senin",
                                        endDay: "Jumat",
                                        open: "",
                                        close: "",
                                      },
                                    ];

                              const val = e.target.value;
                              current[index].isClosed = val === "tutup";
                              if (val === "tutup") {
                                current[index].open = "";
                                current[index].close = "";
                              }
                              onChange("accessInfo", JSON.stringify(current));
                            }}
                            className={`w-full p-2 border rounded-lg text-sm outline-none font-bold ${item.isClosed ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}
                          >
                            <option value="buka">BUKA</option>
                            <option value="tutup">TUTUP</option>
                          </select>
                        </div>

                        {/* Time Inputs */}
                        <div className="col-span-8 flex items-center gap-2">
                          {isRowClosed ? (
                            <div className="w-full p-2 bg-slate-100 text-slate-400 text-sm font-bold text-center border border-slate-200 rounded-lg">
                              LIBUR
                            </div>
                          ) : (
                            <>
                              <input
                                type="text"
                                value={item.open}
                                placeholder="00:00"
                                maxLength={5}
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                                onChange={(e) => {
                                  let val = e.target.value.replace(
                                    /[^0-9:]/g,
                                    "",
                                  );

                                  // Auto-insert colon after 2 digits
                                  if (val.length === 2 && !val.includes(":")) {
                                    val = val + ":";
                                  }

                                  const current: ScheduleItem[] =
                                    detail.accessInfo?.startsWith("[")
                                      ? JSON.parse(detail.accessInfo)
                                      : [
                                          {
                                            startDay: "Senin",
                                            endDay: "Jumat",
                                            open: "",
                                            close: "",
                                          },
                                        ];
                                  current[index].open = val;
                                  onChange(
                                    "accessInfo",
                                    JSON.stringify(current),
                                  );
                                }}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  if (
                                    val &&
                                    !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                      val,
                                    )
                                  ) {
                                    alert(
                                      "Format jam harus HH:mm (contoh: 08:00, 14:30)",
                                    );
                                  }
                                }}
                              />
                              <span className="text-slate-400 font-bold">
                                -
                              </span>
                              <input
                                type="text"
                                value={item.close}
                                placeholder="00:00"
                                maxLength={5}
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono"
                                onChange={(e) => {
                                  let val = e.target.value.replace(
                                    /[^0-9:]/g,
                                    "",
                                  );

                                  // Auto-insert colon after 2 digits
                                  if (val.length === 2 && !val.includes(":")) {
                                    val = val + ":";
                                  }

                                  const current: ScheduleItem[] =
                                    detail.accessInfo?.startsWith("[")
                                      ? JSON.parse(detail.accessInfo)
                                      : [
                                          {
                                            startDay: "Senin",
                                            endDay: "Jumat",
                                            open: "",
                                            close: "",
                                          },
                                        ];
                                  current[index].close = val;
                                  onChange(
                                    "accessInfo",
                                    JSON.stringify(current),
                                  );
                                }}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  if (
                                    val &&
                                    !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                      val,
                                    )
                                  ) {
                                    alert(
                                      "Format jam harus HH:mm (contoh: 08:00, 14:30)",
                                    );
                                  }
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTION: DELETE */}
                    <div className="col-span-12 lg:col-span-2 flex justify-end lg:justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const current: ScheduleItem[] =
                            detail.accessInfo?.startsWith("[")
                              ? JSON.parse(detail.accessInfo)
                              : [
                                  {
                                    startDay: "Senin",
                                    endDay: "Jumat",
                                    open: "",
                                    close: "",
                                  },
                                ];
                          const newItems = current.filter(
                            (_, i) => i !== index,
                          );
                          onChange("accessInfo", JSON.stringify(newItems));
                        }}
                        className="w-full lg:w-auto p-2 text-red-500 bg-white border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                        title="Hapus Jadwal Ini"
                      >
                        <span className="lg:hidden text-sm font-medium">
                          Hapus Baris
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                const current = detail.accessInfo?.startsWith("[")
                  ? JSON.parse(detail.accessInfo)
                  : [];
                current.push({
                  startDay: "Senin",
                  endDay: "",
                  open: "08:00",
                  close: "17:00",
                });
                onChange("accessInfo", JSON.stringify(current));
              }}
              className="w-full py-3 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-100 transition-colors border-2 border-blue-100 border-dashed flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Tambah Jadwal Baru
            </button>
          </div>
        </div>

        {/* Price Info */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Tag size={12} /> {labels.priceInfo}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text" // Keep as text to control input manually
              value={detail.priceInfo?.split(" - ")[0] || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                const start = val;
                const end = detail.priceInfo?.split(" - ")[1] || "";
                onChange(
                  "priceInfo",
                  start && end
                    ? `${start} - ${end}`
                    : start
                      ? start
                      : end
                        ? ` - ${end}`
                        : "",
                );
              }}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
              placeholder="Rp Min"
            />
            <span className="text-slate-400 font-bold">-</span>
            <input
              type="text" // Keep as text to control input manually
              value={detail.priceInfo?.split(" - ")[1] || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                const start = detail.priceInfo?.split(" - ")[0] || "";
                const end = val;
                onChange(
                  "priceInfo",
                  start && end
                    ? `${start} - ${end}`
                    : start
                      ? start
                      : end
                        ? ` - ${end}`
                        : "",
                );
              }}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
              placeholder="Rp Max"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Phone size={12} /> {labels.contactInfo}
          </label>
          <input
            type="text"
            value={detail.contactInfo || ""}
            onChange={(e) => {
              // Format: 08xx-xxxx-xxxx
              let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
              if (val.length > 13) val = val.slice(0, 13); // Max length for generic mobile numbers

              let formatted = val;
              if (val.length > 4) {
                formatted = `${val.slice(0, 4)}-${val.slice(4)}`;
              }
              if (val.length > 8) {
                formatted = `${formatted.slice(0, 9)}-${val.slice(8)}`;
              }

              onChange("contactInfo", formatted);
            }}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            placeholder="Contoh: 0812-3456-7890"
          />
        </div>

        {/* Website / Social Media */}
        <div className="space-y-1 col-span-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Globe size={12} /> Website / Social Media
          </label>
          <input
            type="text"
            value={detail.webUrl || ""}
            onChange={(e) => onChange("webUrl", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            placeholder="Contoh: https://instagram.com/..."
          />
        </div>

        {/* Facilities (Full Width) */}
        <div className="space-y-1 col-span-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <CheckSquare size={12} /> {labels.facilities}
          </label>
          <textarea
            rows={2}
            value={detail.facilities || ""}
            onChange={(e) => onChange("facilities", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm resize-none"
            placeholder="Tulis fasilitas yang tersedia, pisahkan dengan koma..."
          />
        </div>
      </div>
    </div>
  );
}
