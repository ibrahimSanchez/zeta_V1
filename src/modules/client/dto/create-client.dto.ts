import { clientes } from "@prisma/client";

export type CreateClientDto = Omit<clientes, ""> & {};
