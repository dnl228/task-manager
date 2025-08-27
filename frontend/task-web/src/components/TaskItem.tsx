import { useTasks } from '../provider/TasksContext';
import type { Task } from '../types/task';

export default function TaskItem({ task, canMoveUp, canMoveDown }: { task: Task, canMoveUp: boolean, canMoveDown: boolean }) {
  const { toggleTask, deleteTask, moveTask, setActiveTask } = useTasks();

  return (
    <li style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <strong>{task.title}</strong>
          {task.isCompleted && <span className="text-white bg-green-600 rounded border px-2 py-1 text-xs ml-2">Done</span>}
          {task.description && <div style={{ opacity: 0.8 }}>{task.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>

          {canMoveUp && <button disabled={!canMoveUp}  onClick={() => moveTask(task.id, 'up')}>▲</button>}
          {canMoveDown && <button disabled={!canMoveDown} onClick={() => moveTask(task.id, 'down')}>▼</button>}


          <button onClick={() => toggleTask(task.id)} className={`cursor-pointer ${task.isCompleted ? 'bg-orange-400 text-white' : 'bg-green-600 text-white'} active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30`}>
            {task.isCompleted ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button onClick={() => setActiveTask(task)} className="cursor-pointer bg-white text-gray-500 active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30">Edit</button>
          <button onClick={() => deleteTask(task.id)} className="cursor-pointer bg-red-400 text-white active:scale-95 transition text-sm flex items-center px-4 py-2 gap-2 rounded w-max border border-gray-500/30">Delete</button>
        </div>
      </div>
    </li>
  );
}
