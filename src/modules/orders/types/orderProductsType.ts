import { CreateItemDto } from "src/modules/items/dto/create-item.dto";

export interface OrderProductType {
  // ordprodcod: number;
  prodcod: string;
  provcod: string;
  // ordprodcon: string;
  prodcost: number;
  prodvent: number;
  ordprodcan: number;

  items: CreateItemDto[];
}
