import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import refreshJwtConfig from "./config/refresh-jwt.config";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "./guards/roles/roles.guard";
import googleOauthConfig from "./config/google-oauth.config";
import { UsersService } from "src/modules/users/users.service";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, //@UseGuards(JwtAuthGuard) applied on all API endppints
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
