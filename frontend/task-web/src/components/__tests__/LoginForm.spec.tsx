import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';

const mockUseAuth = jest.fn();

jest.mock('../../provider/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

afterEach(() => jest.resetAllMocks());

describe('LoginForm', () => {
  test('renders inputs and calls login on submit', async () => {
    const login = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({ login });

    render(<LoginForm />);

    const userInput = screen.getByPlaceholderText(/Username/i);
    const passInput = screen.getByPlaceholderText(/Password/i);
    const btn = screen.getByRole('button', { name: /login/i });

    fireEvent.change(userInput, { target: { value: 'admin' } });
    fireEvent.change(passInput, { target: { value: 'admin123' } });

    fireEvent.click(btn);

    await waitFor(() => expect(login).toHaveBeenCalledWith('admin', 'admin123'));
  });

  test('shows error message when login fails', async () => {
    const login = jest.fn().mockRejectedValue(new Error('bad'));
    mockUseAuth.mockReturnValue({ login });

    render(<LoginForm />);

    const userInput = screen.getByPlaceholderText(/Username/i);
    const passInput = screen.getByPlaceholderText(/Password/i);
    const btn = screen.getByRole('button', { name: /login/i });

    fireEvent.change(userInput, { target: { value: 'wrong' } });
    fireEvent.change(passInput, { target: { value: 'wrong' } });
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
  });
});
