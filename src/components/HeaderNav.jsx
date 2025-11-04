import React from 'react';
import { Home, Users, GraduationCap, ClipboardList } from 'lucide-react';

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'classes', label: 'Kelas', icon: GraduationCap },
  { key: 'students', label: 'Siswa', icon: Users },
  { key: 'grades', label: 'Absensi & Nilai', icon: ClipboardList },
];

export default function HeaderNav({ active, onChange }) {
  return (
    <header className="sticky top-0 z-20 bg-emerald-700/90 backdrop-blur border-b border-emerald-600">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
          ABSENSI SISWA MAS AL-WASHLIYAH NAGUR
        </h1>
        <nav className="flex gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                active === key
                  ? 'bg-white text-emerald-700 shadow'
                  : 'hover:bg-emerald-600/60'
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
