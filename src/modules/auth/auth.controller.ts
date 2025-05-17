import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth/local-auth.guard";
import { Public } from "./decorators/public.decorator";
import {
  CreateUserDto,
  SwaggerCreateUserResponse,
  SwaggerUserDto,
} from "src/modules/users/dto/create-user.dto";
import { Response } from "express";
import { TOKEN_NAME } from "src/constants/key-decorators";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  LoginDto,
  SwaggerLoginDto,
  SwaggerLoginResponse,
} from "./dto/login.dto";

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("/signup")
  @ApiOperation({
    summary: "Registro de usuario",
    description: "Crea una nueva cuenta de usuario en el sistema",
  })
  @ApiResponse({
    status: 201,
    description: "Usuario registrado exitosamente",
    type: SwaggerCreateUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Datos de entrada inválidos",
  })
  @ApiResponse({
    status: 409,
    description: "El nombre de usuario ya está en uso",
  })
  @ApiBody({
    type: SwaggerUserDto,
    description: "Datos requeridos para el registro de un nuevo usuario",
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @ApiOperation({
    summary: "Inicio de sesión",
    description: "Autentica al usuario y devuelve un token JWT",
  })
  @ApiResponse({
    status: 200,
    description: "Inicio de sesión exitoso",
    type: SwaggerLoginResponse,
    headers: {
      "Set-Cookie": {
        description: "Token JWT como cookie HTTP-only",
        schema: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas",
  })
  @ApiBody({
    type: SwaggerLoginDto,
    description: "Credenciales para iniciar sesión",
  })
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log("token", req.user);
    const { id } = req.user;
    const token = await this.authService.login(id);

    res.cookie(TOKEN_NAME, token, { httpOnly: true });
    return { token };
  }
}
