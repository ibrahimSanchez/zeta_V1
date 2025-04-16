import { proveedores } from "@prisma/client";

export type CreateSupplierDto = Omit<proveedores, ""> & {};
