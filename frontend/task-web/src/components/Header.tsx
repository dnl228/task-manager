import { useAuth } from '../provider/AuthContext';

export default function Header() {
  const { isAuthed, logout } = useAuth();
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Task Manager</h1>
      {isAuthed && <button onClick={logout} className="w-40 py-3 cursor-pointer active:scale-95 transition text-sm text-white rounded-lg bg-slate-700">Logout</button>}
    </header>
  );
}
