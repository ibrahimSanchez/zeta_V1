import { CreateOrdersProductDto } from "./create-orders-product.dto";

export type UpdateOrdersProductDto = Partial<
  Omit<CreateOrdersProductDto, "ordprodcod">
>;
