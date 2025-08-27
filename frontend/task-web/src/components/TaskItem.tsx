import { useTasks } from '../provider/TasksContext';
import type { Task } from '../types/task';

export default function TaskItem({ task, canMoveUp, canMoveDown }: { task: Task, canMoveUp: boolean, canMoveDown: boolean }) {
  const { toggleTask, deleteTask, moveTask, setActiveTask } = useTasks();

  return (
    <li style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <strong>{task.title}</strong>
          {task.isCompleted && <span> — Done</span>}
          {task.description && <div style={{ opacity: 0.8 }}>{task.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>

          <button disabled={!canMoveUp}  onClick={() => moveTask(task.id, 'up')}>▲</button>
          <button disabled={!canMoveDown} onClick={() => moveTask(task.id, 'down')}>▼</button>


          <button onClick={() => toggleTask(task.id)}>
            {task.isCompleted ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button onClick={() => setActiveTask(task)}>Edit</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      </div>
    </li>
  );
}
