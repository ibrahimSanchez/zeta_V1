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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    SupplierModule,
    ClientModule,
    ProductModule,
    ProductTypeModule,
    OrdersModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
