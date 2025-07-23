'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from './auth-guard';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Các trang không cần authentication - có thể truy cập tự do
const publicRoutes = [
  '/login',
  '/register',
  '/', // Trang chủ
  '/tasks', // Xem danh sách tasks (chỉ đọc)
  '/projects', // Xem danh sách projects (chỉ đọc)
  '/calendar', // Xem lịch (chỉ đọc)
  '/statistics', // Xem thống kê (chỉ đọc)
  '/categories', // Xem danh mục (chỉ đọc)
  '/notes', // Xem ghi chú (chỉ đọc)
];

// Các trang cần authentication bắt buộc
const protectedRoutes = [
  '/profile',
  '/settings',
];

export function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname();

  // Nếu là trang public, không cần AuthGuard
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Nếu là trang protected, bắt buộc phải có AuthGuard
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    );
  }

  // Các trang khác cũng có thể truy cập tự do (fallback)
  return <>{children}</>;
}
