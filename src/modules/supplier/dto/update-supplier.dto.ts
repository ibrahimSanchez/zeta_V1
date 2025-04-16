import { CreateSupplierDto } from "./create-supplier.dto";

export type UpdateSupplierDto = Partial<Omit<CreateSupplierDto, "provcod">>;
