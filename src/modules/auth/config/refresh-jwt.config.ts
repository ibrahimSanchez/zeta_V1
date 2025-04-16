import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.SECRETORPRIVATEKEY,

    expiresIn: process.env.JWT_EXPIRE_IN,
  }),
);
