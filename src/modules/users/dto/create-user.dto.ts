import { usuarios } from "@prisma/client";

export type CreateUserDto = Omit<usuarios, ""> & {};
