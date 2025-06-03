import { Module } from "@nestjs/common";
import { FetchDataService } from "./fetch-data.service";
import { FetchDataController } from "./fetch-data.controller";
import { ClientModule } from "../client/client.module";
import { ProductModule } from "../product/product.module";
import { SupplierModule } from "../supplier/supplier.module";

@Module({
  controllers: [FetchDataController],
  imports: [ClientModule, ProductModule, SupplierModule],
  providers: [FetchDataService],
})
export class FetchDataModule {}
