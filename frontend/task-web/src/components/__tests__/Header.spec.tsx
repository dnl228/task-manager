import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

const mockUseAuth = jest.fn();

jest.mock('../../provider/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

afterEach(() => jest.resetAllMocks());

describe('Header', () => {
  test('does not show logout when not authed', () => {
    mockUseAuth.mockReturnValue({ isAuthed: false, logout: jest.fn() });
    render(<Header />);
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });

  test('shows logout and calls logout when clicked', () => {
    const logout = jest.fn();
    mockUseAuth.mockReturnValue({ isAuthed: true, logout });

    render(<Header />);

    const btn = screen.getByText(/Logout/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(logout).toHaveBeenCalled();
  });
});
