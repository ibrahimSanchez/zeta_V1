import { tipoproductos } from "@prisma/client";

export interface ListProductResponse {
  prodcod: string;
  prodnom: string;
  family: tipoproductos | null;
  componentsExist: boolean;
  components: string[];
}

//   components: ListProductResponse[];
