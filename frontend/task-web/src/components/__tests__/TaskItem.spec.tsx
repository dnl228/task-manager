import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../TaskItem';

const mockUseTasks = jest.fn();

jest.mock('../../provider/TasksContext', () => ({
  useTasks: () => mockUseTasks(),
}));

afterEach(() => jest.resetAllMocks());

describe('TaskItem', () => {
  test('renders title and description and Done label when completed', () => {
    const task = { id: 1, title: 'My Task', description: 'Details', isCompleted: true, createdAt: new Date().toISOString() };
    mockUseTasks.mockReturnValue({ toggleTask: jest.fn(), deleteTask: jest.fn() });

    render(<TaskItem task={task} />);

    expect(screen.getByText(/My Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
  });

  test('calls toggleTask and deleteTask when buttons clicked', () => {
    const toggleTask = jest.fn();
    const deleteTask = jest.fn();
    const task = { id: 2, title: 'Another', isCompleted: false, createdAt: new Date().toISOString() };

    mockUseTasks.mockReturnValue({ toggleTask, deleteTask });

    render(<TaskItem task={task} />);

    const toggleBtn = screen.getByText(/Mark Done|Mark Pending/i);
    const deleteBtn = screen.getByText(/Delete/i);

    fireEvent.click(toggleBtn);
    fireEvent.click(deleteBtn);

    expect(toggleTask).toHaveBeenCalledWith(2);
    expect(deleteTask).toHaveBeenCalledWith(2);
  });
});
