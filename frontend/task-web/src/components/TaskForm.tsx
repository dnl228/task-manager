import { useState } from 'react';
import { useTasks } from '../provider/TasksContext';

export default function TaskForm() {
  const { createTask } = useTasks();
  const [form, setForm] = useState({ title: '', description: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createTask(form);
      setForm({ title: '', description: '' });
    } catch {
      setError('Could not create task.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm(s => ({ ...s, title: e.target.value }))}
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm(s => ({ ...s, description: e.target.value }))}
      />
      <button type="submit" disabled={busy || !form.title.trim()}>
        {busy ? 'Adding…' : 'Add Task'}
      </button>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}
