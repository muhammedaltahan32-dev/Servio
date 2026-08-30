// Users Table Fields
export const User_ID = "id";
export const User_Name = "username";
export const User_Password = "password";
export const User_HashedPassword = "hashed_password";
export const User_Kind = "kind";
export const User_CreatedAt = "created_at";
export const User_IsActive = "is-active";

// Tables Table Fields
export const Table_ID = "id";
export const Table_Number = "table_number";
export const Table_Capacity = "capacity";
export const Table_Status = "status";
export const Table_UpdatedAt = "updated_at";

// Categories Table Fields
export const Cat_ID = "id";
export const Cat_Name = "name";
export const Cat_Sort = "sort_order";

// Menu Items Table Fields
export const Menu_ID = "id";
export const Menu_CatID = "category_id";
export const Menu_Name = "name";
export const Menu_Price = "price";
export const Menu_IsAvailable = "is_available";
export const Menu_Descriptions = "descriptions";
export const Menu_BaseImage = "base_image";
export const Menu_Images = "images";

// Orders Table Fields
export const Order_ID = "id";
export const Order_TableID = "table_id";
export const Order_WaiterID = "waiter_id";
export const Order_Status = "status";
export const Order_Subtotal = "subtotal";
export const Order_Tax = "tax_amount";
export const Order_Total = "total_amount";
export const Order_CreatedAt = "created_at";
export const Order_UpdatedAt = "updated_at";

// Order Items Table Fields
export const Item_ID = "id";
export const Item_OrderID = "order_id";
export const Item_MenuID = "menu_item_id";
export const Item_Quantity = "quantity";
export const Item_UnitPrice = "unit_price";
export const Item_Notes = "notes";

// Payments Table Fields
export const Pay_ID = "id";
export const Pay_OrderID = "order_id";
export const Pay_Method = "payment_method";
export const Pay_Amount = "amount_paid";
export const Pay_CreatedAt = "created_at";
