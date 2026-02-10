"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Update Interface agar menerima defaultValue
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string; // <--- Tambahkan ini
}

export default function SearchBar({ 
  onSearch, 
  placeholder, 
  defaultValue = "" // Set default string kosong
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  // Fitur penting: Update isi kotak search jika URL berubah
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    onSearch(newVal);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-200 transition-all text-sm font-medium"
      />
    </div>
  );
}