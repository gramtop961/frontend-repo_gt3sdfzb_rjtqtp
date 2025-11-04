import React from 'react';

export default function Dashboard({ stats }) {
  const cards = [
    { title: 'Total Kelas', value: stats.classes },
    { title: 'Total Siswa', value: stats.students },
    { title: 'Catatan Nilai', value: stats.entries },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-6 text-emerald-900">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Selamat datang</h2>
        <p className="text-sm sm:text-base opacity-80">
          Kelola kelas, data siswa, absensi, dan nilai harian yang otomatis
          terkonversi ke nilai bulanan dan semester.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {cards.map((c) => (
          <div key={c.title} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="text-sm text-emerald-600 font-medium">{c.title}</div>
            <div className="text-3xl font-semibold mt-2">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
