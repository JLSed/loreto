export enum UserRole {
  Admin = 1,
  Staff,
  Customer,
}

export enum UserStatus {
  Active = 1,
  InActive,
  Banned,
  Deleted,
}

export enum BoxThickness {
  Single = 1,
  Double,
}

export enum BoxPlacement {
  Master = 1, // The actual box
  Inner, // The divider inside the box
}

export enum BoxOrderStatus {
  cancelled,
  InCart,
  Placed,
  PaymentInfoConfirmed,
  ProcessingOrder,
  OutForDelivery,
  OrderReceived,
  OrderCompleted,
}

export enum ModeOfPayment {
  Cash = 1,
  GCash,
  Bank,
}

export enum TransactionType {
  FullPayment = 1,
  PartialPayment,
  DownPayment,
}

export enum TransactionItemType {
  Box = 1,
  Vehicle,
  Apartment,
}

export enum AuditAffectedTable {
  User = 1,
  Box,
  BoxOrder,
  Transaction,
}

export enum AuditAction {
  Creation = 1,
  Modification,
  Deletion,
}
