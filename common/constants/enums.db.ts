enum UserRole {
  Admin = 1,
  Staff,
  Customer,
}

enum UserStatus {
  Active = 1,
  InActive,
  Banned,
  Deleted,
}

enum BoxThickness {
  Single = 1,
  Double,
}

enum BoxPlacement {
  Master = 1, // The actual box
  Inner, // The divider inside the box
}

enum BoxOrderStatus {
  cancelled,
  InCart,
  Placed,
  PaymentInfoConfirmed,
  ProcessingOrder,
  OutForDelivery,
  OrderReceived,
  OrderCompleted,
}

enum ModeOfPayment {
  Cash = 1,
  GCash,
  Bank,
}

enum TransactionType {
  FullPayment = 1,
  PartialPayment,
  DownPayment,
}

enum TransactionItemType {
  Box = 1,
  Vehicle,
  Apartment,
}

enum AuditAffectedTable {
  User = 1,
  Box,
  BoxOrder,
  Transaction,
}

enum AuditAction {
  Creation = 1,
  Modification,
  Deletion,
}
