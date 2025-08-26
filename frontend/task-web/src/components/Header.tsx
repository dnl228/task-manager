import { useAuth } from '../provider/AuthContext';

export default function Header() {
  const { isAuthed, logout } = useAuth();
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h1 style={{ margin: 0 }}>Task Manager</h1>
      {isAuthed && <button onClick={logout}>Logout</button>}
    </header>
  );
}
