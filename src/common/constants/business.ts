import {
  BookingStatus,
  BoxOrderStatus,
  UserRole,
  VehicleStatus,
} from '../enums/enums.db'

export const PRICE_PER_SQUAREFOOT = {
  SINGLE: 6,
  DOUBLE: 8,
}

export const UserRoleLabel = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Staff]: 'Staff',
  [UserRole.Customer]: 'Customer',
}

export const VehicleStatusLabel = {
  [VehicleStatus.Available]: 'Available',
  [VehicleStatus.Booked]: 'Booked',
  [VehicleStatus.OnTheRoad]: 'On the road',
  [VehicleStatus.Rented]: 'Rented',
  [VehicleStatus.UnderMaintenance]: 'Under maintenance',
}

export const BookingStatusTexts = {
  [BookingStatus.Cancelled]: 'Cancelled',
  [BookingStatus.Pending]: 'Pending',
  [BookingStatus.Confirmed]: 'Confirmed',
  [BookingStatus.OnTheRoad]: 'On the road',
  [BookingStatus.Completed]: 'Completed',
  [BookingStatus.Declined]: 'Declined',
}

export const BoxOrdersStatusText: Record<number, string> = {
  [BoxOrderStatus.InCart]: 'In Cart',
  [BoxOrderStatus.Placed]: 'Placed',
  [BoxOrderStatus.OrderCompleted]: 'Completed',
  [BoxOrderStatus.OrderReceived]: 'Received',
  [BoxOrderStatus.OutForDelivery]: 'Out for delivery',
  [BoxOrderStatus.ProcessingOrder]: 'Processing',
  [BoxOrderStatus.cancelled]: 'Cancelled',
}
