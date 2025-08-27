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
        className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm(s => ({ ...s, description: e.target.value }))}
        className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
      />
      <button type="submit" disabled={busy || !form.title.trim()} className="w-full py-3 cursor-pointer active:scale-95 transition text-sm text-white rounded-lg bg-slate-700">
        {busy ? 'Saving' : 'Save Task'}
      </button>
      { activeTask && <button type="button" disabled={busy} onClick={() => setActiveTask(null)} className="w-full py-3 cursor-pointer active:scale-95 transition text-sm text-slate-700 rounded-lg bg-slate-300">
        Cancel
      </button>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
    </form>
  );
}
