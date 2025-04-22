import { tipoproductos } from "@prisma/client";

export type CreateProductTypeDto = Omit<tipoproductos, ""> & {};
