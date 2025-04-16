import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "usunom",
      passwordField: "usucla",
    });
  }

  validate(usunom: string, usucla: string) {
    if (usucla === "")
      throw new UnauthorizedException("Please Provide The Password");
    return this.authService.validateUser(usunom, usucla);
  }
}
