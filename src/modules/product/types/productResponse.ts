import { productos, tipoproductos } from "@prisma/client";

export interface ProductResponse {
  prodcod: string;
  prodnom: string;
  family: tipoproductos | null;
  componentsExist: boolean;
  components: string[] | ProductResponse[];
}
