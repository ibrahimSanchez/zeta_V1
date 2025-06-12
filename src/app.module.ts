import { Module } from "@nestjs/common";
import { PrismaService } from "./modules/prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SupplierModule } from './modules/supplier/supplier.module';
import { ClientModule } from './modules/client/client.module';
import { ProductModule } from './modules/product/product.module';
import { ProductTypeModule } from './modules/product-type/product-type.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReportsModule } from './modules/reports/reports.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { OrderStateModule } from './modules/order-state/order-state.module';
import { ItemsModule } from './modules/items/items.module';
import { FetchDataModule } from './modules/fetch-data/fetch-data.module';
import { MinioModule } from './modules/minio/minio.module';
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),

     MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 50, // 50MB
      },
    }),
    AuthModule,
    UsersModule,
    SupplierModule,
    ClientModule,
    ProductModule,
    ProductTypeModule,
    OrdersModule,
    ReportsModule,
    CurrencyModule,
    PaymentMethodModule,
    OrderStateModule,
    ItemsModule,
    FetchDataModule,
    MinioModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
