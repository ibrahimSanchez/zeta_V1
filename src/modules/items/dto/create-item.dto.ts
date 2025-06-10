import { items } from "@prisma/client";

export type CreateItemDto = Omit<items, "itemcod" | "itemfec"> & {
  ordprodcod?: number;
};
