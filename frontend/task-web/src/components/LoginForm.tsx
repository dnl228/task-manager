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
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 360, margin: '10vh auto' }}>
      <h2>Sign in</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={e => setForm(s => ({ ...s, username: e.target.value }))}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
      />
      <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <small>Try <code>admin/admin123</code> or <code>user/user123</code></small>
    </form>
  );
}
