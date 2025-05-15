import { ordenesproductos } from "@prisma/client";

export type CreateOrdersProductDto = Omit<ordenesproductos, ""> & {};
