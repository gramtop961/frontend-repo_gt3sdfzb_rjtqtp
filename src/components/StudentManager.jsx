import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function StudentManager({ classes, students, setStudents }) {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editClassId, setEditClassId] = useState('');

  const grouped = useMemo(() => {
    const map = {};
    classes.forEach((c) => (map[c.id] = []));
    students.forEach((s) => {
      if (!map[s.classId]) map[s.classId] = [];
      map[s.classId].push(s);
    });
    return map;
  }, [students, classes]);

  const addStudent = () => {
    const n = name.trim();
    if (!n || !classId) return;
    setStudents((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: n, classId },
    ]);
    setName('');
    setClassId('');
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditClassId(s.classId);
  };

  const saveEdit = () => {
    const n = editName.trim();
    if (!n || !editClassId) return;
    setStudents((prev) => prev.map((s) => (s.id === editingId ? { ...s, name: n, classId: editClassId } : s)));
    setEditingId(null);
  };

  const removeStudent = (id) => {
    if (!confirm('Hapus siswa ini?')) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-700">Kelola Siswa</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama siswa"
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="">Pilih kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={addStudent} className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700">
            <Plus size={18} /> Tambah
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {classes.length === 0 && (
            <div className="text-sm text-gray-500">Tambahkan kelas terlebih dahulu.</div>
          )}
          {classes.map((c) => (
            <div key={c.id} className="rounded-md border p-3">
              <div className="font-medium text-emerald-700">{c.name}</div>
              <div className="divide-y mt-2">
                {(grouped[c.id] || []).length === 0 && (
                  <div className="text-sm text-gray-500 py-2">Belum ada siswa.</div>
                )}
                {(grouped[c.id] || []).map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2">
                    <div>{s.name}</div>
                    <div className="flex items-center gap-2">
                      {editingId === s.id ? (
                        <>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="rounded-md border px-2 py-1"
                          />
                          <select
                            value={editClassId}
                            onChange={(e) => setEditClassId(e.target.value)}
                            className="rounded-md border px-2 py-1"
                          >
                            {classes.map((cc) => (
                              <option key={cc.id} value={cc.id}>{cc.name}</option>
                            ))}
                          </select>
                          <button onClick={saveEdit} className="p-2 rounded-md bg-emerald-600 text-white">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 rounded-md bg-gray-100">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(s)} className="p-2 rounded-md bg-gray-100">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => removeStudent(s.id)} className="p-2 rounded-md bg-red-600 text-white">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
