import { CreateProductTypeDto } from "./create-product-type.dto";

export type UpdateProductTypeDto = Partial<
  Omit<CreateProductTypeDto, "tipprodcod">
>;
