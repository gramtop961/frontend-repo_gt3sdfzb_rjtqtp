import React, { useEffect, useMemo, useState } from 'react';
import HeaderNav from './components/HeaderNav';
import Dashboard from './components/Dashboard';
import ClassManager from './components/ClassManager';
import StudentManager from './components/StudentManager';
import AttendanceGrades from './components/AttendanceGrades';

export default function App() {
  const [active, setActive] = useState('dashboard');

  const [classes, setClasses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('absensi_classes') || '[]'); } catch { return []; }
  });
  const [students, setStudents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('absensi_students') || '[]'); } catch { return []; }
  });
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('absensi_entries') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('absensi_classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('absensi_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('absensi_entries', JSON.stringify(entries)); }, [entries]);

  const stats = useMemo(() => ({
    classes: classes.length,
    students: students.length,
    entries: entries.length,
  }), [classes, students, entries]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 to-emerald-200 text-gray-900">
      <HeaderNav active={active} onChange={setActive} />

      {active === 'dashboard' && <Dashboard stats={stats} />}
      {active === 'classes' && (
        <ClassManager classes={classes} setClasses={setClasses} students={students} setStudents={setStudents} />
      )}
      {active === 'students' && (
        <StudentManager classes={classes} students={students} setStudents={setStudents} />
      )}
      {active === 'grades' && (
        <AttendanceGrades classes={classes} students={students} entries={entries} setEntries={setEntries} />
      )}

      <footer className="text-center text-xs text-emerald-900/70 py-8">
        Dibuat untuk: ABSENSI SISWA MAS AL-WASHLIYAH NAGUR
      </footer>
    </div>
  );
}
