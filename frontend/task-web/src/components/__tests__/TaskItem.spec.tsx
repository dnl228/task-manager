
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../TaskItem';

const mockUseTasks = jest.fn();

jest.mock('../../provider/TasksContext', () => ({
  useTasks: () => mockUseTasks(),
}));

afterEach(() => jest.resetAllMocks());

describe('TaskItem', () => {
  const baseTask = {
    id: 1,
    title: 'My Task',
    description: 'Details',
    isCompleted: true,
    createdAt: new Date().toISOString(),
  };

  test('renders title, description, and Done label when completed', () => {
    mockUseTasks.mockReturnValue({ toggleTask: jest.fn(), deleteTask: jest.fn(), moveTask: jest.fn(), setActiveTask: jest.fn() });
    render(<TaskItem task={baseTask} canMoveUp={true} canMoveDown={true} />);
    expect(screen.getByText(/My Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
  });

  test('calls toggleTask and deleteTask when buttons clicked', () => {
    const toggleTask = jest.fn();
    const deleteTask = jest.fn();
    mockUseTasks.mockReturnValue({ toggleTask, deleteTask, moveTask: jest.fn(), setActiveTask: jest.fn() });
    render(<TaskItem task={{ ...baseTask, id: 2, isCompleted: false }} canMoveUp={true} canMoveDown={true} />);
    const toggleBtn = screen.getByText(/Mark Done|Mark Pending/i);
    const deleteBtn = screen.getByText(/Delete/i);
    fireEvent.click(toggleBtn);
    fireEvent.click(deleteBtn);
    expect(toggleTask).toHaveBeenCalledWith(2);
    expect(deleteTask).toHaveBeenCalledWith(2);
  });

  test('calls moveTask when ▲ and ▼ buttons are clicked', () => {
    const moveTask = jest.fn();
    mockUseTasks.mockReturnValue({ toggleTask: jest.fn(), deleteTask: jest.fn(), moveTask, setActiveTask: jest.fn() });
    render(<TaskItem task={baseTask} canMoveUp={true} canMoveDown={true} />);
    fireEvent.click(screen.getByText('▲'));
    fireEvent.click(screen.getByText('▼'));
    expect(moveTask).toHaveBeenCalledWith(1, 'up');
    expect(moveTask).toHaveBeenCalledWith(1, 'down');
  });

  test('move buttons are disabled when canMoveUp/canMoveDown are false', () => {
    mockUseTasks.mockReturnValue({ toggleTask: jest.fn(), deleteTask: jest.fn(), moveTask: jest.fn(), setActiveTask: jest.fn() });
    render(<TaskItem task={baseTask} canMoveUp={false} canMoveDown={false} />);
    expect(screen.getByText('▲')).toBeDisabled();
    expect(screen.getByText('▼')).toBeDisabled();
  });

  test('calls setActiveTask when Edit button is clicked', () => {
    const setActiveTask = jest.fn();
    mockUseTasks.mockReturnValue({ toggleTask: jest.fn(), deleteTask: jest.fn(), moveTask: jest.fn(), setActiveTask });
    render(<TaskItem task={baseTask} canMoveUp={true} canMoveDown={true} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(setActiveTask).toHaveBeenCalledWith(baseTask);
  });
});
