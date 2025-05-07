import { ordenes } from "@prisma/client";

export type CreateOrderDto = Omit<ordenes, ""> & {};
