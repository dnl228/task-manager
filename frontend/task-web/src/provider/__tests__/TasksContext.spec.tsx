import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TasksProvider, useTasks } from '../TasksContext';
import { api } from '../../libs/api';

function TestConsumer() {
  const { groupedTasks, filter, setFilter, counts, loading, load, createTask, toggleTask, deleteTask } = useTasks();
  return (
    <div>
      <div data-testid="tasks">{JSON.stringify(groupedTasks)}</div>
      <div data-testid="filter">{filter}</div>
      <div data-testid="counts">{JSON.stringify(counts)}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <button onClick={() => load()}>doLoad</button>
      <button onClick={() => load('completed')}>doLoadCompleted</button>
      <button onClick={() => createTask({ title: 'T', description: 'D' })}>doCreate</button>
      <button onClick={() => toggleTask(1)}>doToggle</button>
      <button onClick={() => deleteTask(1)}>doDelete</button>
      <button onClick={() => setFilter('pending')}>doSetFilter</button>
    </div>
  );
}

describe('TasksProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test('loads tasks on mount and exposes counts/loading', async () => {
    const now = new Date().toISOString();
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 1, title: 'First', isCompleted: false, createdAt: now }] });

    render(
      <TasksProvider>
        <TestConsumer />
      </TasksProvider>
    );

    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('First'));
    expect(screen.getByTestId('counts').textContent).toContain('"all":1');
    expect(screen.getByTestId('counts').textContent).toContain('"pending":1');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  test('load(status) requests filtered endpoint', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <TasksProvider>
        <TestConsumer />
      </TasksProvider>
    );

    fireEvent.click(screen.getByText('doLoadCompleted'));

    await waitFor(() => expect((api.get as jest.Mock)).toHaveBeenCalledWith('/tasks'));
  });

  test('createTask posts and then reloads tasks', async () => {
    const now = new Date().toISOString();
    
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [{ id: 2, title: 'T', isCompleted: false, createdAt: now, description: 'D' }] });
    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    render(
      <TasksProvider>
        <TestConsumer />
      </TasksProvider>
    );

    fireEvent.click(screen.getByText('doCreate'));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/tasks', { title: 'T', description: 'D' }));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('T'));
  });

  test('toggleTask calls patch and reloads', async () => {
    const now = new Date().toISOString();
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ id: 1, title: 'A', isCompleted: false, createdAt: now }] })
      .mockResolvedValueOnce({ data: [{ id: 1, title: 'A', isCompleted: true, createdAt: now }] });
    (api.patch as jest.Mock).mockResolvedValue({});

    render(
      <TasksProvider>
        <TestConsumer />
      </TasksProvider>
    );

    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('A'));

    fireEvent.click(screen.getByText('doToggle'));

    await waitFor(() => expect(api.patch).toHaveBeenCalledWith('/tasks/1/toggle'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('isCompleted":true'));
  });

  test('deleteTask calls delete and reloads', async () => {
    const now = new Date().toISOString();
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ id: 1, title: 'ToDelete', isCompleted: false, createdAt: now }] })
      .mockResolvedValueOnce({ data: [] });
    (api.delete as jest.Mock).mockResolvedValue({});

    render(
      <TasksProvider>
        <TestConsumer />
      </TasksProvider>
    );

    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toContain('ToDelete'));

    fireEvent.click(screen.getByText('doDelete'));

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/tasks/1'));
    await waitFor(() => expect(screen.getByTestId('tasks').textContent).toBe("{\"all\":[],\"completed\":[],\"pending\":[]}"));
  });

  test('setFilter updates filter state', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <TasksProvider>
        <TestConsumer />
      </TasksProvider>
    );

    expect(screen.getByTestId('filter').textContent).toBe('all');
    fireEvent.click(screen.getByText('doSetFilter'));
    await waitFor(() => expect(screen.getByTestId('filter').textContent).toBe('pending'));
  });
});
