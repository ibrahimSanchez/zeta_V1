import { PartialType } from "@nestjs/swagger";
import { CreateItemDto } from "./create-item.dto";

export type UpdateItemDto = Partial<Omit<CreateItemDto, "itemcod" | "itemfec">>;
