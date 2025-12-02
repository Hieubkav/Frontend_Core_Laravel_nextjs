import { SaleData, StatMetric, User, Product, ActivityLog, Alert, Transaction } from './types';
import { DollarSign, Users, ShoppingBag, MousePointerClick } from 'lucide-react';

export const REVENUE_DATA: SaleData[] = [
  { month: 'T1', revenue: 4000, expenses: 2400, orders: 120 },
  { month: 'T2', revenue: 3000, expenses: 1398, orders: 98 },
  { month: 'T3', revenue: 2000, expenses: 9800, orders: 150 },
  { month: 'T4', revenue: 2780, expenses: 3908, orders: 180 },
  { month: 'T5', revenue: 1890, expenses: 4800, orders: 200 },
  { month: 'T6', revenue: 2390, expenses: 3800, orders: 220 },
  { month: 'T7', revenue: 3490, expenses: 4300, orders: 250 },
  { month: 'T8', revenue: 4200, expenses: 2100, orders: 300 },
  { month: 'T9', revenue: 5100, expenses: 2300, orders: 320 },
  { month: 'T10', revenue: 4800, expenses: 2600, orders: 350 },
  { month: 'T11', revenue: 5600, expenses: 3100, orders: 400 },
  { month: 'T12', revenue: 6100, expenses: 3400, orders: 450 },
];

export const USERS_DATA: User[] = [
  { id: 'USR-001', name: 'Nguyễn Văn A', email: 'vana@example.com', role: 'Admin', status: 'Active', lastActive: '2 phút trước', spent: '12.500.000₫' },
  { id: 'USR-002', name: 'Trần Thị B', email: 'thib@example.com', role: 'User', status: 'Active', lastActive: '1 giờ trước', spent: '2.300.000₫' },
  { id: 'USR-003', name: 'Lê Văn C', email: 'vanc@example.com', role: 'User', status: 'Inactive', lastActive: '3 ngày trước', spent: '0₫' },
  { id: 'USR-004', name: 'Phạm Thị D', email: 'thid@example.com', role: 'Editor', status: 'Pending', lastActive: '5 giờ trước', spent: '500.000₫' },
  { id: 'USR-005', name: 'Hoàng Văn E', email: 'vane@example.com', role: 'User', status: 'Active', lastActive: '1 ngày trước', spent: '5.100.000₫' },
  { id: 'USR-006', name: 'Đỗ Thị F', email: 'thif@example.com', role: 'User', status: 'Active', lastActive: '20 phút trước', spent: '1.200.000₫' },
  { id: 'USR-007', name: 'Ngô Văn G', email: 'vang@example.com', role: 'User', status: 'Inactive', lastActive: '1 tuần trước', spent: '8.900.000₫' },
];

export const TOP_PRODUCTS: Product[] = [
  { id: 'PRD-01', name: 'Tai nghe Premium X', category: 'Electronics', sales: 1234, revenue: '617.000.000₫', growth: 12 },
  { id: 'PRD-02', name: 'Bàn phím cơ Pro', category: 'Accessories', sales: 850, revenue: '212.500.000₫', growth: -5 },
  { id: 'PRD-03', name: 'Chuột Gaming Wireless', category: 'Accessories', sales: 2300, revenue: '1.150.000.000₫', growth: 24 },
  { id: 'PRD-04', name: 'Màn hình 4K Ultra', category: 'Electronics', sales: 120, revenue: '960.000.000₫', growth: 8 },
];

export const DASHBOARD_STATS: StatMetric[] = [
  {
    title: 'Tổng Doanh Thu',
    value: '2.45 tỷ',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    description: 'so với tháng trước'
  },
  {
    title: 'Người dùng Active',
    value: '2,350',
    change: '+15.2%',
    trend: 'up',
    icon: Users,
    description: 'người dùng hoạt động'
  },
  {
    title: 'Đơn hàng',
    value: '12,234',
    change: '+19%',
    trend: 'up',
    icon: ShoppingBag,
    description: 'đơn hàng đã xử lý'
  },
  {
    title: 'Traffic',
    value: '573k',
    change: '-2.4%',
    trend: 'down',
    icon: MousePointerClick,
    description: 'lượt truy cập'
  },
];

export const ALERTS: Alert[] = [
  { id: 'AL-1', type: 'warning', message: 'Tỷ lệ thoát trang tăng cao bất thường (45%)', timestamp: '10 phút trước' },
  { id: 'AL-2', type: 'error', message: 'Thanh toán thất bại tăng đột biến tại cổng VNPay', timestamp: '30 phút trước' },
  { id: 'AL-3', type: 'info', message: 'Máy chủ bảo trì định kỳ vào 00:00 mai', timestamp: '2 giờ trước' },
];

export const ACTIVITY_LOG: ActivityLog[] = [
  { id: 'LOG-1', action: 'Login', timestamp: '2023-10-25 08:30:00', description: 'Đăng nhập thành công từ IP 192.168.1.1' },
  { id: 'LOG-2', action: 'Order', timestamp: '2023-10-24 14:20:00', description: 'Tạo đơn hàng mới #ORD-9921' },
  { id: 'LOG-3', action: 'Update Profile', timestamp: '2023-10-23 09:15:00', description: 'Cập nhật số điện thoại' },
  { id: 'LOG-4', action: 'Logout', timestamp: '2023-10-23 09:00:00', description: 'Đăng xuất khỏi hệ thống' },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-001', user: 'Nguyễn Văn A', email: 'vana@example.com', amount: '1.200.000₫', status: 'Success' },
  { id: 'TRX-002', user: 'Trần Thị B', email: 'thib@example.com', amount: '850.000₫', status: 'Pending' },
  { id: 'TRX-003', user: 'Lê Văn C', email: 'vanc@example.com', amount: '2.500.000₫', status: 'Failed' },
  { id: 'TRX-004', user: 'Phạm Thị D', email: 'thid@example.com', amount: '500.000₫', status: 'Success' },
  { id: 'TRX-005', user: 'Hoàng Văn E', email: 'vane@example.com', amount: '3.100.000₫', status: 'Success' },
];