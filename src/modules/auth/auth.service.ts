import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtPayload } from "./types/auth-jwtPayload";
import refreshJwtConfig from "./config/refresh-jwt.config";
import { ConfigType } from "@nestjs/config";
import { CurrentUser } from "./types/current-user";
import { UsersService } from "src/modules/users/users.service";
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";
import { compare } from "bcrypt";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  // Todo:*************************************************************************
  async hashed(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  // Todo:*************************************************************************
  async validateUser(usunom: string, usucla: string) {
    const user = await this.userService.getUserByUsunom(usunom);
    if (!user) throw new UnauthorizedException("User not found!");
    let isPasswordMatch = await compare(usucla, user.usucla);
    if (!isPasswordMatch) isPasswordMatch = usucla === user.usucla;
    if (!isPasswordMatch)
      throw new UnauthorizedException("Invalid credentials");

    return { id: user.usucod };
  }

  // Todo:*************************************************************************
  async signUp(createUserDto: CreateUserDto) {
    const { usucla, usunom } = createUserDto;

    try {
      const foundUser = await this.userService.getUserByUsunom(usunom);

      if (foundUser)
        throw new ConflictException(
          `The user with the name: ${usunom} already exists.`,
        );

      const hashedPassword = await this.hashed(usucla);
      createUserDto.usucla = hashedPassword;
      
      console.log(createUserDto)
      return await this.userService.create(createUserDto);
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            `The user with the name: ${usunom} already exists.`,
          );
        }
      }
    }
  }

  // Todo:*************************************************************************
  async login(id: number) {

    try {
      const userFound = await this.userService.getUserById(id);
      if (!userFound) {
        throw new NotFoundException(`User with id ${id} cannot be found`);
      }

      // const role = await this.prismaService.tipousuarios.findUnique({
      //   where: { tipusucod: userFound?.tipusucod },
      // });

      // if (!role?.tipusunom) {
      //   throw new NotFoundException(
      //     `Role with code ${userFound.tipusucod} cannot be found`,
      //   );
      // }

      const payload: AuthJwtPayload = {
        userData: {
          userCode: userFound.usucod,
          userName: userFound.usunom,
          role: userFound.tipusucod,
        },
      };

      const { token } = await this.generateTokens(payload);
      return token;
    } catch (error) {
      throw new BadRequestException("An error has occurred");
    }
  }

  // Todo:*************************************************************************
  async generateTokens(payload: AuthJwtPayload) {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      token,
      refreshToken,
    };
  }

  // Todo:*************************************************************************
  async validateJwtUser(usucod: number) {
    const user = await this.userService.getUserById(usucod);

    if (!user) throw new UnauthorizedException("User not found!");
    const currentUser: CurrentUser = {
      usucod: user.usucod,
      tipusucod: user.tipusucod,
    };
    return currentUser;
  }
}
