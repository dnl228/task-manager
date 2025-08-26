import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../TaskForm';

const mockUseTasks = jest.fn();

jest.mock('../../provider/TasksContext', () => ({
  useTasks: () => mockUseTasks(),
}));

afterEach(() => jest.resetAllMocks());

describe('TaskForm', () => {
  test('disables submit when title empty', () => {
    mockUseTasks.mockReturnValue({ createTask: jest.fn() });
    render(<TaskForm />);
    const btn = screen.getByRole('button', { name: /add task/i });
    expect(btn).toBeDisabled();
  });

  test('calls createTask and clears form on success', async () => {
    const createTask = jest.fn().mockResolvedValue(undefined);
    mockUseTasks.mockReturnValue({ createTask });
    render(<TaskForm />);

    const title = screen.getByPlaceholderText(/Title/i);
    const desc = screen.getByPlaceholderText(/Description \(optional\)/i);
    const btn = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(title, { target: { value: 'New Task' } });
    fireEvent.change(desc, { target: { value: 'Desc' } });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);

    await waitFor(() => expect(createTask).toHaveBeenCalledWith({ title: 'New Task', description: 'Desc' }));

    expect((title as HTMLInputElement).value).toBe('');
    expect((desc as HTMLTextAreaElement).value).toBe('');
  });

  test('shows error message when createTask fails', async () => {
    const createTask = jest.fn().mockRejectedValue(new Error('fail'));
    mockUseTasks.mockReturnValue({ createTask });
    render(<TaskForm />);

    const title = screen.getByPlaceholderText(/Title/i);
    const btn = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(title, { target: { value: 'New' } });
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/Could not create task\./i)).toBeInTheDocument());
  });
});
