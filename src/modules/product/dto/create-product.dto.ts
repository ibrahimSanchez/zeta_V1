import { productos } from "@prisma/client";

export type CreateProductDto = Omit<productos, ""> & {};
