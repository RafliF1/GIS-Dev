"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Place } from "@/types";
import ActionButtons from "./ActionButtons";

interface PlaceTableProps {
  data: Place[];
  onEdit: (place: Place) => void;
  onDelete: (id: string, name: string) => void;
  onSort?: (key: keyof Place) => void; 
  sortConfig?: { key: keyof Place; direction: "asc" | "desc" } | null;
}

export default function PlaceTable({
  data,
  onEdit,
  onDelete,
  onSort,
  sortConfig,
}: PlaceTableProps) {
  
  const getSortIcon = (columnName: keyof Place) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <ArrowUpDown size={14} className="text-slate-300 opacity-50 group-hover:opacity-100" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="text-lime-600" />
    ) : (
      <ArrowDown size={14} className="text-lime-600" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="p-20 text-center text-slate-500 bg-white rounded-[24px] border border-slate-200 shadow-sm">
        <p>Data tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left table-fixed min-w-250 border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {/* Header Nama (25%) */}
            <th 
              className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[25%] cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              onClick={() => onSort && onSort("name")}
            >
              <div className="flex items-center gap-2">
                Nama Tempat
                {onSort && getSortIcon("name")}
              </div>
            </th>

            {/* Header Kategori (15%) */}
            <th 
              className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[15%] cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              onClick={() => onSort && onSort("category")}
            >
              <div className="flex items-center gap-2">
                Kategori
                {onSort && getSortIcon("category")}
              </div>
            </th>

            {/* Header Lainnya */}
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[15%]">Koordinat</th>
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[30%]">Alamat</th>
            <th className="p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 w-[15%] text-center">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {data.map((place, index) => (
            <tr
              key={place.id || index}
              className="group border-l-4 border-l-transparent hover:bg-lime-500/10 hover:border-l-lime-500 transition-all duration-200 ease-in-out cursor-default"
            >
              <td className="p-5 align-middle">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="font-bold text-slate-800 text-sm truncate w-full group-hover:text-lime-700 transition-colors">
                    {place.name}
                  </span>
                  {place.placeImages && place.placeImages.length > 0 && (
                    <span className="inline-flex items-center justify-center rounded-lg bg-lime-100 border border-lime-300 px-1.5 py-1 text-[10px] font-black text-lime-800 tracking-tight shadow-sm">
                      {place.placeImages.length} IMG
                    </span>
                  )}
                </div>
              </td>

              <td className="p-5 align-middle">
                <span className={`px-3 py-1.5 text-[10px] font-black rounded-lg border tracking-wide inline-block shadow-sm ${
                    place.category === "wisata" ? "bg-purple-50 text-purple-700 border-purple-200" : 
                    place.category === "hotel" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                    "bg-orange-50 text-orange-700 border-orange-200"
                  }`}
                >
                  {place.category.toUpperCase()}
                </span>
              </td>

              <td className="p-5 align-middle">
                <div className="font-mono text-[12px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold group-hover:text-lime-600 transition-colors">Lat</span>
                    {Number(place.lat).toFixed(6)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold group-hover:text-lime-600 transition-colors">Lon</span>
                    {Number(place.lon).toFixed(6)}
                  </div>
                </div>
              </td>

              <td className="p-5 align-middle">
                <p className="text-slate-600 text-[13px] leading-relaxed line-clamp-2 font-medium" title={place.address}>
                  {place.address || "-"}
                </p>
              </td>

              <td 
                id={index === 0 ? "tour-action-buttons" : undefined}
                className="p-5 align-middle text-center"
              >
                <ActionButtons
                  name={place.name}
                  onEdit={() => onEdit(place)}
                  onDelete={() => place.id && onDelete(place.id, place.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}