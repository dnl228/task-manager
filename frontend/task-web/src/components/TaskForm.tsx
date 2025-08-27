import { useEffect, useState } from 'react';
import { useTasks } from '../provider/TasksContext';

export default function TaskForm() {
  const { createTask, updateTask, activeTask, setActiveTask } = useTasks();
  const [form, setForm] = useState({ title: activeTask?.title ?? '', description: activeTask?.description ?? '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      if(!activeTask || !activeTask.id){ 
        await createTask(form);
      }
      else {
        await updateTask(activeTask.id, form);
      }
      setForm({ title: '', description: '' });
      setActiveTask(null);
    } catch {
      setError('Could not create task.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if(activeTask) {
      setForm({ title: activeTask.title, description: activeTask.description ?? ''});
    }
    else {
      setForm({title: '', description: ''});
    }
  }, [activeTask])

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
        {busy ? 'Saving' : 'Save Task'}
      </button>
      { activeTask && <button type="button" disabled={busy} onClick={() => setActiveTask(null)}>
        Cancel
      </button>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}
