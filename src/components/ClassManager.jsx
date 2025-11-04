import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function ClassManager({ classes, setClasses, students, setStudents }) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const classUsage = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      map[s.classId] = (map[s.classId] || 0) + 1;
    });
    return map;
  }, [students]);

  const addClass = () => {
    const n = name.trim();
    if (!n) return;
    const c = { id: crypto.randomUUID(), name: n };
    setClasses((prev) => [...prev, c]);
    setName('');
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.name);
  };

  const saveEdit = () => {
    const n = editName.trim();
    if (!n) return;
    setClasses((prev) => prev.map((c) => (c.id === editingId ? { ...c, name: n } : c)));
    setEditingId(null);
  };

  const removeClass = (id) => {
    if (classUsage[id]) {
      alert('Tidak bisa menghapus kelas yang masih memiliki siswa. Pindahkan siswa terlebih dahulu.');
      return;
    }
    if (!confirm('Hapus kelas ini?')) return;
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-700">Kelola Kelas</h2>
        <div className="mt-4 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kelas (mis. X IPA 1)"
            className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button onClick={addClass} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700">
            <Plus size={18} /> Tambah
          </button>
        </div>

        <div className="mt-6 divide-y">
          {classes.length === 0 && (
            <div className="text-sm text-gray-500">Belum ada kelas.</div>
          )}
          {classes.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{classUsage[c.id] || 0} siswa</div>
              </div>
              <div className="flex items-center gap-2">
                {editingId === c.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-md border px-2 py-1"
                    />
                    <button onClick={saveEdit} className="p-2 rounded-md bg-emerald-600 text-white">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-md bg-gray-100">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(c)} className="p-2 rounded-md bg-gray-100">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => removeClass(c.id)} className="p-2 rounded-md bg-red-600 text-white">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
