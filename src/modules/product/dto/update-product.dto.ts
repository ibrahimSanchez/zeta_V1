import { CreateProductDto } from "./create-product.dto";

export type UpdateProductDto = Partial<Omit<CreateProductDto, "prodcod">>;
