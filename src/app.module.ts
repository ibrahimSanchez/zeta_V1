import { Module } from "@nestjs/common";
import { PrismaService } from "./modules/prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SupplierModule } from './modules/supplier/supplier.module';
import { ClientModule } from './modules/client/client.module';
import { ProductModule } from './modules/product/product.module';

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
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
