import { useState } from 'react';
import { useAuth } from '../provider/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(form.username, form.password);
    } catch {
      setError('Invalid credentials');
    } finally {
      setBusy(false);
    }
  };

  return (

    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="w-full max-w-[340px] mx-4">
        <header className="text-center mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Task Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your tasks and finish what matters</p>
        </header>
        <form onSubmit={submit} className="bg-white text-gray-500 w-full md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign in</h2>
        <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm(s => ({ ...s, username: e.target.value }))}
            type="text"
            id="Username"
            className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
          />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
            className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
        />
        <button type="submit" disabled={busy} className="w-full py-3 cursor-pointer active:scale-95 transition text-sm text-white rounded-lg bg-slate-700">{busy ? 'Signing in…' : 'Login'}</button>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <p className="text-center mt-4">Try <code>admin/admin123</code> or <code>user/user123</code></p>
      </form>
      </div>
    </div>
  );
}
