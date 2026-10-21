import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Register from './Register';

jest.mock('../auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

test('submits valid signup details and navigates after registration', async () => {
  const user = userEvent.setup();
  const register = jest.fn().mockResolvedValue(undefined);
  useAuth.mockReturnValue({ register });

  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<p>สมัครสำเร็จ</p>} />
      </Routes>
    </MemoryRouter>
  );

  await user.type(screen.getByPlaceholderText('ชื่อที่แสดง'), 'Movie Fan');
  await user.type(screen.getByPlaceholderText('อีเมล'), 'fan@example.com');
  await user.type(screen.getByPlaceholderText('รหัสผ่าน (4 ตัวขึ้นไป)'), '1234');
  await user.click(screen.getByRole('button', { name: 'สมัครสมาชิก' }));

  expect(register).toHaveBeenCalledWith('fan@example.com', '1234', 'Movie Fan');
  expect(await screen.findByText('สมัครสำเร็จ')).toBeInTheDocument();
});
