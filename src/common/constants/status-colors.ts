import { VehicleStatus } from "../enums/enums.db";

export const VehicleStatusColor: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: "dodgerblue",
  [VehicleStatus.Booked]: "orange",
  [VehicleStatus.Rented]: "green",
  [VehicleStatus.OnTheRoad]: "yellowgreen",
  [VehicleStatus.UnderMaintenance]: "red",
}
