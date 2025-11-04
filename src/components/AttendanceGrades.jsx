import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, FileDown } from 'lucide-react';

function monthName(m) {
  const names = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return names[m];
}

function getSemesterFromMonth(m) {
  // m: 0-11
  // Semester 1: Juli(6) - Des(11), Semester 2: Jan(0) - Jun(5)
  return m >= 6 ? 1 : 2;
}

function downloadCSV(filename, rows) {
  const process = (r) => r.map((v) => {
    if (v == null) return '';
    const s = String(v).replaceAll('"', '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  }).join(',');
  const csv = rows.map(process).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AttendanceGrades({ classes, students, entries, setEntries }) {
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const classStudents = useMemo(() => students.filter((s) => s.classId === classId), [students, classId]);
  const [studentId, setStudentId] = useState('');

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [score, setScore] = useState('');
  const [note, setNote] = useState('');
  const [present, setPresent] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const filteredEntries = useMemo(() => entries.filter((e) => e.studentId === studentId), [entries, studentId]);

  const addEntry = () => {
    if (!studentId) return alert('Pilih siswa');
    const s = Number(score);
    if (Number.isNaN(s)) return alert('Nilai harus angka');
    setEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), studentId, date, score: s, note, present },
    ]);
    setScore('');
    setNote('');
    setPresent(true);
  };

  const startEdit = (e) => {
    setEditingId(e.id);
    setDate(e.date);
    setScore(String(e.score));
    setNote(e.note || '');
    setPresent(!!e.present);
  };

  const saveEdit = () => {
    const s = Number(score);
    if (Number.isNaN(s)) return;
    setEntries((prev) => prev.map((e) => (e.id === editingId ? { ...e, date, score: s, note, present } : e)));
    setEditingId(null);
    setScore('');
    setNote('');
    setPresent(true);
  };

  const removeEntry = (id) => {
    if (!confirm('Hapus catatan ini?')) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const calculations = useMemo(() => {
    const byMonth = {};
    const bySemester = { 1: [], 2: [] };
    filteredEntries.forEach((e) => {
      const m = new Date(e.date).getMonth();
      byMonth[m] = byMonth[m] || [];
      byMonth[m].push(e.score);
      const sem = getSemesterFromMonth(m);
      bySemester[sem].push(e.score);
    });
    const monthly = Object.entries(byMonth).map(([m, arr]) => ({
      month: Number(m),
      avg: arr.reduce((a, b) => a + b, 0) / arr.length,
    })).sort((a, b) => a.month - b.month);
    const sem1 = bySemester[1].length ? bySemester[1].reduce((a, b) => a + b, 0) / bySemester[1].length : 0;
    const sem2 = bySemester[2].length ? bySemester[2].reduce((a, b) => a + b, 0) / bySemester[2].length : 0;
    return { monthly, sem1, sem2 };
  }, [filteredEntries]);

  const exportCSV = () => {
    const stu = students.find((s) => s.id === studentId);
    const rows = [
      ['Nama', stu?.name || ''],
      ['Kelas', classes.find((c) => c.id === classId)?.name || ''],
      [],
      ['Tanggal', 'Hadir', 'Nilai', 'Catatan'],
      ...filteredEntries.map((e) => [e.date, e.present ? 'Ya' : 'Tidak', e.score, e.note || '']),
      [],
      ['Rangkuman'],
      ...calculations.monthly.map((m) => [monthName(m.month), '', m.avg.toFixed(2), 'Rata-rata bulanan']),
      ['Semester 1 (Jul-Des)', '', calculations.sem1.toFixed(2), 'Rata-rata'],
      ['Semester 2 (Jan-Jun)', '', calculations.sem2.toFixed(2), 'Rata-rata'],
    ];
    const filename = `nilai_${stu?.name || 'siswa'}.csv`;
    downloadCSV(filename, rows);
  };

  const onChangeClass = (id) => {
    setClassId(id);
    const first = students.find((s) => s.classId === id)?.id || '';
    setStudentId(first);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-700">Absensi & Nilai Harian</h2>

        <div className="mt-4 grid sm:grid-cols-3 gap-2">
          <select value={classId} onChange={(e) => onChangeClass(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="">Pilih kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="">Pilih siswa</option>
            {classStudents.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} disabled={!studentId} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md disabled:opacity-50">
              <FileDown size={18} /> Ekspor CSV
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-2 rounded-md">
              Cetak/PDF
            </button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-full text-sm">
                <thead className="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th className="text-left p-2 border-b">Tanggal</th>
                    <th className="text-left p-2 border-b">Hadir</th>
                    <th className="text-left p-2 border-b">Nilai</th>
                    <th className="text-left p-2 border-b">Catatan</th>
                    <th className="text-left p-2 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-gray-500">Belum ada data.</td>
                    </tr>
                  )}
                  {filteredEntries.map((e) => (
                    <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2 border-b">{e.date}</td>
                      <td className="p-2 border-b">{e.present ? 'Ya' : 'Tidak'}</td>
                      <td className="p-2 border-b">{e.score}</td>
                      <td className="p-2 border-b">{e.note}</td>
                      <td className="p-2 border-b">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(e)} className="p-1.5 rounded-md bg-gray-100"><Edit size={16} /></button>
                          <button onClick={() => removeEntry(e.id)} className="p-1.5 rounded-md bg-red-600 text-white"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="rounded-md border p-3">
              <div className="font-medium text-emerald-700 mb-2">{editingId ? 'Edit' : 'Tambah'} Catatan</div>
              <div className="space-y-2">
                <label className="block text-sm">Tanggal</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-md border px-3 py-2" />

                <label className="block text-sm">Kehadiran</label>
                <select value={present ? 'ya' : 'tidak'} onChange={(e) => setPresent(e.target.value === 'ya')} className="w-full rounded-md border px-3 py-2">
                  <option value="ya">Hadir</option>
                  <option value="tidak">Tidak Hadir</option>
                </select>

                <label className="block text-sm">Nilai</label>
                <input type="number" value={score} onChange={(e) => setScore(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="0-100" />

                <label className="block text-sm">Catatan</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-md border px-3 py-2" placeholder="Opsional" />

                {editingId ? (
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md"><Save size={18} /> Simpan</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 px-3 py-2 rounded-md"><X size={18} /> Batal</button>
                  </div>
                ) : (
                  <button onClick={addEntry} className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md"><Plus size={18} /> Tambah</button>
                )}
              </div>
            </div>

            <div className="rounded-md border p-3 mt-4 bg-emerald-50">
              <div className="font-medium text-emerald-800 mb-2">Rangkuman</div>
              <div className="space-y-1 text-sm">
                {calculations.monthly.map((m) => (
                  <div key={m.month} className="flex justify-between">
                    <span>{monthName(m.month)}</span>
                    <span className="font-medium">{m.avg.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t">
                  <span>Semester 1 (Jul-Des)</span>
                  <span className="font-semibold">{calculations.sem1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Semester 2 (Jan-Jun)</span>
                  <span className="font-semibold">{calculations.sem2.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
