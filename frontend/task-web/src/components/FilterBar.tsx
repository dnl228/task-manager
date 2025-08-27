import { useTasks } from '../provider/TasksContext';
import type { TaskStatus } from '../types/taskStatus';

export default function FilterBar() {
  const { filter, setFilter, counts } = useTasks();
  interface BtnProps {
    id: TaskStatus;
    label: string;
    count: number;
  }

  const Btn = ({ id, label, count }: BtnProps) => (
    <button
      onClick={() => setFilter(id)}
      style={{
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid #ddd',
        background: filter === id ? '#eee' : 'white',
      }}
      className="cursor-pointer"
    >
      {label} ({count})
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <Btn id="all" label="All" count={counts.all} />
      <Btn id="completed" label="Completed" count={counts.completed} />
      <Btn id="pending" label="Pending" count={counts.pending} />
    </div>
  );
}
