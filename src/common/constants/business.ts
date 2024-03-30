import { AuditAction, UserRole, VehicleStatus } from '../enums/enums.db'

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
