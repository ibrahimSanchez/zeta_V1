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
import { CreateUserDto } from "src/modules/users/dto/create-user.dto";
import { Response } from "express";
import { TOKEN_NAME } from "src/constants/key-decorators";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("/signup")
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    console.log("token", req.user);
    const { id } = req.user;
    const token = await this.authService.login(id);
    
    res.cookie(TOKEN_NAME, token, { httpOnly: true });
    return { token };
  }
}
