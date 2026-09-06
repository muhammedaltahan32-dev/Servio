export const allowedRoles_User = [2, 3]; // 2 for waiter and 3 kitchen
export const Kind_ADMIN = "admin";
export const Kind_WAITER = "waiter";
export const Kind_KITCHEN = "kitchen";
export const Kind_GUESTS = "guests";

export const ST_AVAILABLE = "Available";
export const ST_OCCUPIED = "Occupied";
export const ST_NEEDS_CLEANING = "Needs_Cleaning";
export const TABLE_STATUS = [ST_AVAILABLE, ST_OCCUPIED, ST_NEEDS_CLEANING];
export const KINDS_VALUES = {
	[Kind_KITCHEN]: 2,
	[Kind_WAITER]: 3,
};

// Order Status Options
export const OrderStatus_PENDING = "PENDING";
export const OrderStatus_PREPARING = "PREPARING";
export const OrderStatus_READY = "READY";
export const OrderStatus_SERVED = "SERVED";
export const OrderStatus_PAID = "PAID";
export const OrderStatus_CANCELLED = "CANCELLED";

export const ORDER_STATUS_VALUES = [
	OrderStatus_PENDING,
	OrderStatus_PREPARING,
	OrderStatus_READY,
	OrderStatus_SERVED,
	OrderStatus_PAID,
	OrderStatus_CANCELLED,
];
