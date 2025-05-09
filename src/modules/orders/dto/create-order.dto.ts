import { ordenes } from "@prisma/client";
import { OrderProductType } from "../types/orderProductsType";

export type CreateOrderDto = Omit<ordenes, "ordcod"> & {
  orderProduct: OrderProductType[];
};
